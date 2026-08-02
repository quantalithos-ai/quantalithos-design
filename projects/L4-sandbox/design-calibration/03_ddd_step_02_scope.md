# Step 2. 明确本轮实现范围和非范围

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
> 回填章节: `03-详细设计.md` §2 本次详细设计目标与范围
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 把正式 `02-概要设计.md` 已经交给 `03` 的稳定输入转写为详细设计自身的覆盖范围、非范围和实现者可完成代码范围。本步不写文件布局、模块最终命名、对象字段、trait 签名、DTO、状态矩阵、事务规则或测试用例。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 2 | 是。Step 1 审查点后用户已明确回复“继续”。 |
| 项目级台账是否允许进入 Step 2 | 是。`project_execution_ledger.md` 已将恢复点停在 `03-详细设计.md` Step 1,用户确认后允许进入 Step 2。 |
| 文档级 flow 是否允许进入 Step 2 | 是。`03_ddd_calibration_flow.md` 已记录 Step 1 `pass_wait_review`,进入 Step 2 的门禁已满足。 |
| 是否已读取 Step 1 中间产物 | 是。Step 1 已明确 `03` 的上游输入、旧 `03` historical material 定位、本文不再回答和必须回答内容。 |
| 是否已读取详细设计 SOP Step 2 | 是。Step 2 只明确本轮实现范围和非范围,不写排期和开发任务拆分。 |
| 是否发现阻塞 Step 2 的上游 blocker | 否。旧 `03` 与新版 `02` 冲突已作为 historical material 隔离;`04/07` 缺失属于下游文档缺口,不阻塞 Step 2。 |

---

## 2. 本步目标

本步要把 `03-详细设计.md` 的“本轮写到哪里”说清楚,使后续 Step 3~17 不会一边写实现契约,一边临时决定范围。

本步要收稳:

- 本轮详细设计必须覆盖哪些实现单元、模块主轴、对象族、接口族、处理流、状态机和横切契约。
- 哪些能力只保留接缝、状态或风险,不在当前 `03` 展开为完整实现契约。
- 哪些内容属于 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md`、ADR、运维 / 部署文档或相邻仓文档。
- 实现者拿到正式 `03` 后应能完成哪些代码范围,以及不应自行补哪些真相源。

本步不处理:

- crate / module / file layout。
- 对象字段、enum variant、member function、factory 或 invariants。
- trait / port / adapter 签名。
- DTO、event envelope、job report 或 error surface。
- transaction、persistence、state matrix、idempotency、config binding、audit hook 或测试切口细节。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成且用户确认继续 | 提供上游关系映射、旧 `03` historical material 定位、本文不再回答和必须回答边界。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、FR / BR / AC / VF、NFR、数据归属和一票否决线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供依赖方向、运行承载、数据所有权、一致性、通信分层和配置不可越界口径。 |
| `projects/L4-sandbox/02-概要设计.md` | 当前直接上游 | 提供本轮详细设计范围的直接来源:代码主体框架、6 个主要组成部分、关键对象、接口骨架、flow family、状态机、配置影响和承接清单。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供 `03` 必须继续展开的稳定输入和主语变更回退规则。 |
| `02_hld_step_13_risks_open_questions.md` | 已完成 | 提供不应在 Step 2 被误写成已定范围的风险和待确认事项。 |
| `projects/L4-sandbox/03-详细设计.md` | historical_material | 只用于范围误差诊断,不得作为本轮范围来源。 |
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | 已读取 | 作为 Step 2 单文件结构和粒度参考。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_02_scope.md` | 已读取 | 作为范围表、非范围表和实现者可完成范围写法参考。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、`03` flow、Step 1、详细设计 SOP Step 2 和 L1 样例。 | done | 确认当前允许进入 Step 2。 |
| 2 | 从正式 `02` §4~§13、`02_hld_step_12/13` 和 Step 1 中提取范围候选。 | done | 形成必须覆盖、后移和禁止越界候选池。 |
| 3 | 回答 SOP Step 2 五个问题。 | done | 明确本轮覆盖范围、P1 / 后续阶段、下游文档归属和实现者可完成范围。 |
| 4 | 输出设计目标表、覆盖范围表、非范围表和实现者可完成范围表。 | done | 满足正式 §2 回填输入要求。 |
| 5 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 2 审查点,不跨到 Step 3。 |
| 6 | 自检未修改正式 `03-详细设计.md`,未提前写文件布局或实现契约细节。 | done | 进入用户审查点。 |

---

## 5. SOP 问题回答

### 5.1 本轮详细设计必须覆盖哪些模块?

本轮必须覆盖 `L4-sandbox` 核心隔离闭环和必要接缝所需的全部实现范围,但“模块最终命名和文件落点”留给 Step 4~5 收口。

覆盖主轴如下:

- 入口与运行触发范围:
  `Sandbox Sync Entry`、`Sandbox async control and handoff consumption unit`、`Sandbox controlled execution fulfillment unit`、`Sandbox backend maintenance and cleanup unit` 需要在后续 Step 落成实现单元、handler / consumer / job runner / builder / report contract。
- 业务主要组成部分:
  `Controlled execution intake and identity`、`Boundary establishment and enforcement`、`Policy execution decision`、`Execution capture and material handoff`、`Failure control and safety closure`、`Local reference, projection and derived support` 都必须进入模块实现契约主轴。
- 实现分层:
  Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Handoff 都必须有明确模块职责和依赖方向。
- 横切实现范围:
  shared contracts、typed refs、metadata / idempotency、truth persistence、projection / derived read models、event relay、handoff、cleanup / reaper、config binding、observability / audit 和测试切口都必须覆盖。

本轮不能只写 happy path run / capture,也不能只写后端 adapter。只要某条路径影响 execution environment identity、coherent boundary、policy fail-closed、capture / handoff、failure classification、cleanup guard、lease / orphan / reaper 或 redline containment,就必须进入当前 `03` 的实现契约范围。

### 5.2 本轮必须定义哪些对象、接口、事件、job 和状态机?

本轮必须把概要设计第 6~9 章已经点名的主语全部展开为可落码契约。

必须覆盖的对象族包括:

- Intake / Identity:
  `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution`、`ContextReferenceResolution`、`ControlledExecutionIntakeGuard`、`SandboxExecutionStatusView`、`SandboxAuditTrace`。
- Boundary / Capability:
  `BoundaryRequirementSet`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`IsolationEnvironmentHandle`、`BackendCapabilitySummary`、`BoundaryCoherenceGuard`、`BackendCapabilityGuard`、`BoundaryStatusView`。
- Policy / High-Risk:
  `PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision`、`PolicyApplicabilityGuard`、`FailClosedPolicyGuard`、`PolicyDecisionSummaryView`。
- Run / Capture / Handoff:
  `ControlledExecutionRun`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`、`CaptureCompletenessGuard`、`HandoffOwnershipGuard`、`CaptureSummaryView`、`MaterialHandoffStatusView`、`SandboxEventRelayRecord`。
- Failure / Cleanup / Redline:
  `FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`、`ControlConflictGuard`、`CleanupSafetyGuard`、`RedlineContainmentGuard`、`FailureControlStatusView`、`CleanupReadinessView`、`RedlineContainmentView`。
- Read / Derived / Reconciliation:
  `ReferenceResolutionState`、`DerivedInspectPreviewTrendState`、`DerivedReadOnlyGuard`、`ExternalBodyExclusionGuard`、`SandboxReadProjection`、`DerivedInspectPreviewTrendView`、`BackendCapabilityComparisonView`、`SandboxReconciliationReport`。

必须覆盖的接口族包括:

- Command:
  `OpenControlledExecutionContext`、`EstablishExecutionBoundary`、`EvaluatePolicyExecution`、`StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`SubmitSandboxControl`、`ClassifySandboxFailure`、`EvaluateCleanupReadiness`、`RecordRedlineContainment`。
- Query:
  `GetSandboxExecutionStatus`、`GetBoundaryStatus`、`GetPolicyDecisionSummary`、`GetCaptureSummary`、`GetMaterialHandoffStatus`、`GetFailureControlStatus`、`GetCleanupReadiness`、`GetRedlineContainmentStatus`、`GetSandboxReadProjection`、`GetDerivedInspectPreviewTrend`、`GetBackendCapabilityComparison`、`GetSandboxReconciliationReport`、`GetSandboxAuditTrace`。
- Inbound Event Consumer:
  `ConsumeCallerContextReferenceChanged`、`ConsumePolicySummaryChanged`、`ConsumeBackendCapabilitySummaryChanged`、`ConsumeIsolationBackendLifecycleSignal`、`ConsumeMaterialHandoffStatusChanged`、`ConsumeObservabilityHandoffStatusChanged`、`ConsumeSandboxControlRequested`、`ConsumeInvestigationHandoffStatusChanged`、`ConsumeSandboxTruthRelayFeedback`。
- Outbound Event:
  sandbox context / boundary / policy / run / capture / handoff / failure / control / cleanup / redline / projection / derived / reconciliation 变化事件。
- Operations Job:
  `PublishSandboxEventRelay`、`RefreshSandboxReferenceStates`、`RefreshBackendCapabilitySummaries`、`RetryPendingMaterialHandoffs`、`RunLeaseOrphanReaper`、`EvaluatePendingCleanupGuards`、`MaintainRedlineContainmentHandoffs`、`RebuildSandboxReadProjections`、`MaintainDerivedInspectPreviewTrend`、`RunSandboxReconciliation`。
- External / Infrastructure Port:
  `ContextReferenceResolverPort`、`PolicySummaryPort`、`BackendCapabilityPort`、`IsolationBackendPort`、`MaterialHandoffPort`、`ObservabilityMaterialPort`、`EventRelayPort`、`InvestigationHandoffPort`、`SandboxTruthPersistencePort`、`SandboxProjectionPersistencePort`。

必须覆盖的状态机包括:

- Intake / Identity / Intake Reference。
- Boundary / Capability / Environment Lifecycle。
- Policy / High-Risk Launch Decision。
- Run / Capture / Material Handoff。
- Failure / Control / Cleanup / Redline。
- Reference / Projection / Relay / Read Surface。

### 5.3 哪些能力属于 P1 / 后续阶段,不应在本轮展开?

本轮 `03` 必须覆盖核心闭环和必要接缝,但不把外围增强写成当前核心实现契约。以下内容只允许保留最小接缝、只读状态、风险或后续承接,不在当前详细设计中展开为完整能力:

- 高级 replay / inspect、operator console、人工调查工作台和可视化调查流程。
- 输出预览、结果分析、趋势分析、容量成本分析、backend comparison 的完整产品体验。
- 多宿主调度、跨集群调度策略、node pool / namespace / cluster 生命周期管理。
- isolation backend 产品深度绑定、完整 seccomp / AppArmor / cap-drop / mount / network profile 矩阵。
- policy 来源矩阵、policy DSL、allowlist truth、approval workflow 或 capability truth 建模。
- formal artifact 入库、baseline / evidence truth、artifact retention 和 archive truth。
- observability store、metric / trace / alert rule、dashboard、raw log retention 和告警策略。
- external investigation case lifecycle、operator remediation workflow 和正式事故流程。
- 生产 SLO、容量模型、压测阈值、具体 timeout / retry / retention / batch / cursor 数字。

需要注意:这些能力不进入完整核心实现,不等于完全消失。若它们影响 cleanup guard、handoff pending / failed、redline containment、read degraded surface 或 config binding,`03` 必须为接缝、状态、port 或风险保留最小契约。

### 5.4 哪些内容属于测试方案、实施计划、配置设计或运维手册?

详细设计只定义代码实现契约和最小验证切口,不替代下游文档:

- `04-配置设计.md`:
  完整配置项清单、profile、默认值、env var、secret、配置样例、环境矩阵、迁移策略、调度数字、外部产品参数和 profile 变更说明。
- `05-测试方案.md`:
  完整测试矩阵、测试数据、fixture / mock、自动化执行计划、报告产物、回归策略、evidence 组织和覆盖率计划。
- `06-验收标准.md`:
  验收基线、准入准出、验收证据、发布门禁、最终判定和一票否决项落地方式。
- `07-实施计划.md`:
  phase / commit boundary、任务拆分、提交顺序、实现前阅读矩阵、交付门禁、回退说明和 implementation ledger / planned boundary skeleton。
- ADR:
  DB、message bus、object store、observability、scheduler、secrets、isolation backend、investigation system 等产品 / 架构级选型。
- 运维 / 部署文档:
  部署拓扑、告警阈值、容量规划、on-call runbook、故障处置和生产值守。

### 5.5 实现者拿到本文后,应能完成哪些代码范围?

实现者拿到正式 `03-详细设计.md` 后,应能直接在目标实现仓完成以下代码范围:

- Rust workspace / crate / module / file skeleton。
- contracts 层 DTO、view、event、job report、receipt、error surface、typed ref carrier 和 metadata carrier。
- domain 层 aggregate / entity / value object / policy / guard / state transition。
- application 层 command / query / consumer / job service 和编排函数。
- ports 层 repository、resolver、policy summary、backend capability、isolation backend、handoff、observability material、event relay、investigation handoff、projection、clock / id / config / unit-of-work trait。
- infra fake repository、fake adapter、config loader 和最小 runner / consumer / job shell。
- projection / derived view / backend comparison / reconciliation / relay / handoff 的可重建维护逻辑。
- failure / cleanup / lease / orphan / reaper / redline containment 的正式状态推进和 guard。
- trace / audit / outbox / material handoff / investigation handoff 的 accepted truth side effect。
- unit / contract / service / integration 最小测试切口。

实现者不应再自行决定:

- 哪些对象属于 truth、snapshot、reference、derived、handoff、relay 或 external body exclusion。
- 哪些接口是 Command、Query、Consumer、Outbound Event、Operations Job 或 Port。
- 哪些状态可迁移、哪些迁移禁止、哪些错误应映射为 pending / blocked / failed / degraded / unavailable。
- 哪些字段、typed ref、metadata authority、idempotency digest、dedup key、stored result、expected version 或 trace carrier 由哪里提供。
- 哪些配置可以改变 boundary、fail-closed、capture / handoff、cleanup guard、redline 或 dependency crop 语义。答案应由 `03/04` 明确给出,不得实现侧私补。

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` 文档元信息 | 仍绑定旧 `02-概要设计.md v0.1.0` 和旧“15 节结构”口径。 | 本轮范围只承接新版 `00/01/02` 和 `02_hld_step_12/13`。 |
| 旧 `03` §1~§5 | 以“五部分主线 + 内容采集提示 + 旧目录树 + command / provider bridge”为起点。 | 本 Step 改为“详细设计必须覆盖什么 / 不覆盖什么”的实现范围表。 |
| 正式 `02` §12 | 给出了详细设计继续展开方向,但还不是 `03` 自身的范围声明。 | 本步转写为详细设计目标、覆盖范围、非范围和实现者可完成范围。 |
| 正式 `02` §13 | 风险与待确认事项混合了详细设计职责、后续演进、配置 / 测试 / 实施职责和产品未定项。 | 本步明确哪些属于当前 `03` 范围,哪些只作为后续文档、风险或 ADR 输入。 |
| `04-配置设计.md` / `07-实施计划.md` 缺失 | 容易让 `03` 越界写配置手册和实施边界。 | 本步把配置 / 实施内容明确后移,但要求 `03` 保留 config owner、validator、binding point 和 implementation handoff 输入。 |
| read-side 增强和外围能力未定 | 容易被误当成当前核心闭环或完全忽略。 | 本步规定核心 read projection、derived state、degraded surface 和 no-write guard 必须覆盖;完整产品增强后移。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 范围来源 | 可能混入旧 `03` 的五部分旧结构、旧目录和旧对象词。 | 只承接新版 `00/01/02` 与 `02_hld_step_12/13`。 | 防止历史草稿回流。 |
| 详细设计目标 | 容易被理解为“把概要对象写细一点”。 | 明确定义为 1:1 可落码的模块、对象、接口、流程、状态、事务、错误、幂等、配置绑定、观测和测试切口契约。 | 对齐详细设计书写规范。 |
| 非范围 | 边界不明,容易越界到配置 / 测试 / 验收 / 实施 / 运维。 | 明确下游文档职责和后移内容。 | 保持文档链分工。 |
| read-side 增强 | 可能被完全排除或升级为核心真相。 | 只覆盖必要只读 / 派生接缝和 no-write / degraded 语义,完整增强后移。 | 保护核心 truth 主线。 |
| 实现者预期 | 可能仍需实现侧猜字段、状态、port 和 phase。 | 明确实现者应能直接落 workspace、contracts、domain、application、ports、infra、projection、jobs 和 tests。 | 形成可落码门禁。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只覆盖 context / boundary / policy / run / capture 的核心 happy path | 文档量较小,推进快。 | failure / cleanup / redline、handoff、projection、consumer、job 和 no-write 边界缺设计,实现仍会私补。 | 不采用。 |
| B. 覆盖 `02` 已收稳的核心闭环和必要接缝 | 可直接支撑后续实现和 `07` 实施计划,减少实现侧补 schema / port / state 的风险。 | 写作量较大,后续 Step 需要严格逐步推进。 | 采用。 |
| C. 同时把完整配置、测试、验收、实施和运维内容写入 `03` | 看起来一次成稿。 | 混淆文档职责,会提前锁定产品、参数、排期和证据口径。 | 不采用。 |
| D. 把所有 read-side 增强排除出当前 `03` | 降低当前范围。 | Query / derived / reconciliation / degraded surface 没有契约,会反向污染核心或实现私补。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现边界 | 把 4 个运行单元、6 个主要组成部分和 4 层实现分层落成正式实现组织主轴 | 实现者可以创建 workspace / crate / module / file layout |
| 收稳对象契约 | 把 intake、boundary、policy、run / capture / handoff、failure / cleanup / redline、read / derived 对象族展开为 Rust-facing carrier、字段、状态和不变量 | 实现者可以定义 domain / contracts 类型,不自选字段 |
| 收稳协议契约 | 把 Command / Query / Consumer / Outbound Event / Job / Port 骨架展开为 DTO、receipt、report、metadata、idempotency 和错误 surface | 实现者可以实现 entry / consumer / job / port shell |
| 收稳处理流与事务 | 把关键 flow family 展开为 application service 编排、repository / port 调用、save order、relay / handoff / cleanup 副作用 | 实现者可以实现 service 与 unit-of-work |
| 收稳状态矩阵 | 把 6 组并行状态机落成正式 enum、迁移矩阵、forbidden transition 和传播关系 | 实现者可以实现 state guard 和状态测试 |
| 收稳持久化与一致性 | 明确 truth、history、audit、projection、handoff、relay、stored result 和 job report 的 repository / port 语义 | 实现者可以实现 fake adapter 和 repository trait |
| 收稳错误 / 幂等 / 并发 | 定义错误类型、request digest、duplicate / conflict、dedup、retry、stored result、expected version 和 UoW 规则 | 实现者可以落幂等 repository 与 service guard |
| 收稳配置 / 外部绑定 | 只定义代码引用配置、adapter binding、job binding、consumer / publisher / handoff binding 和禁止配置化边界 | `04-配置设计.md` 可继续展开完整手册 |
| 收稳审计 / trace / handoff | 明确 accepted truth 的 trace、audit、outbox、material / observability / investigation handoff 和 relay 切口 | 实现者可以落 trace / audit hook、handoff marker 和 relay job shell |
| 收稳测试切口 | 给出每个关键模块 / 接口 / 状态的最小验证清单 | `05-测试方案.md` 可承接为完整测试矩阵 |

### 9.2 本轮覆盖范围表

| 范围 | 必须覆盖的设计内容 | 后续 Step |
|---|---|---|
| 实现约束与仓级规则 | Rust 语言、workspace 约束、依赖方向、`L0-core` 编译期依赖、sibling / backend 运行期接缝、恢复纪律 | Step 3 |
| 文件布局 | crate、module、file、binary / library、目录映射、运行单元到实现单元映射 | Step 4 |
| 模块契约 | 6 个主要组成部分、4 层实现分层、service / domain / port / projection / handoff / job 归属 | Step 5 |
| 对象契约 | Intake / Identity、Boundary / Capability、Policy / High-Risk、Run / Capture / Handoff、Failure / Cleanup / Redline、Read / Derived / Reconciliation 对象族 | Step 6 |
| trait / port / adapter | context resolver、policy summary、backend capability、isolation backend、material handoff、observability material、event relay、investigation handoff、truth / projection persistence、config、clock、id、UoW | Step 7 |
| 协议契约 | Command、Query、Consumer、Outbound Event、Job、Port 的 DTO / receipt / report / error mapping / metadata / idempotency | Step 8 |
| 函数级处理流 | intake、boundary、policy、run、capture / handoff、failure / control、cleanup / reaper、redline、relay、projection rebuild、reference refresh、reconciliation | Step 9 |
| 状态矩阵 | 6 组并行状态机、允许 / 禁止迁移、重入、冲突和跨状态传播规则 | Step 10 |
| 持久化 / 事务 / 一致性 | expected version、same-transaction truth boundary、outbox / audit / handoff ordering、projection eventual consistency、job report persistence | Step 11 |
| 错误恢复 | domain / application / protocol / infra error、reject、pending、blocked、not_found、conflict、restricted、stale、failed、retryable、dead-letter、degraded、unavailable | Step 12 |
| 并发幂等 | idempotency key、request digest、dedup key、result_ref、duplicate、expected version、control signal conflict、job cursor / retry | Step 13 |
| 配置绑定 | RuntimeConfig owner、config validator、adapter / consumer / publisher / handoff / job config、禁止配置化规则 | Step 14 |
| 审计观测 | trace、audit、event relay、material / observability / investigation handoff marker、metrics / log hook 的代码切口 | Step 15 |
| 测试切口 | unit、contract、service、integration、state matrix、query no-write、consumer / job no-core-write、handoff no-rollback、cleanup / redline negative tests | Step 16 |
| 实施承接 | 实现前阅读矩阵、闭环复核输入、未闭合项、交给 `07` 的 boundary skeleton 输入 | Step 17 |

### 9.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、验收目标和一票否决项重写 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向和技术方案取舍重写 | `01-架构设计.md` |
| 新增 / 删除概要设计的运行单元、主要组成部分、关键对象、接口族、flow family 或状态机组 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置 profile、默认值、JSON 示例、env var、secret、迁移策略、环境矩阵和具体调度数字 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、fixture / mock、自动化脚本、报告证据、回归策略和覆盖率计划 | `05-测试方案.md` |
| 验收基线、准入准出、验收证据、发布门禁和最终判定 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明、回退计划和交付报告 | `07-实施计划.md` |
| implementation ledger 和 planned boundary skeleton | `07-实施计划.md` 完成时同步创建 |
| 具体 DB、message bus、object store、observability、secrets、scheduler、investigation system 或 isolation backend 产品最终选型 | `04-配置设计.md` / `07-实施计划.md` / ADR |
| 部署拓扑、生产告警、容量规划、on-call runbook 和故障处置 | 运维 / 部署文档 |
| tools semantic execution、runtime agent loop、member lifecycle、artifact formal truth、observability store、policy definition / approval / allowlist / capability truth | 对应相邻仓设计文档或外部系统契约 |
| 高级 replay / inspect、operator console、输出预览、结果分析、趋势分析、backend comparison 完整体验、多宿主调度 | 后续版本 / 产品增强 / ADR |

### 9.4 实现者拿到正式 `03` 后应能完成的代码范围

| 代码范围 | 应具备的设计输入 |
|---|---|
| workspace / crate / module / file skeleton | Step 3 / Step 4 |
| contracts DTO / ref / view / event / job report / receipt / error | Step 6 / Step 8 / Step 12 |
| domain aggregate / value object / policy / guard / state transition | Step 6 / Step 10 |
| application command / query / consumer / job service | Step 7 / Step 8 / Step 9 / Step 13 |
| ports repository / resolver / policy / backend / isolation / handoff / observability / relay / investigation / projection / UoW | Step 7 / Step 11 / Step 14 |
| infra fake repository / fake adapter / config loader | Step 7 / Step 11 / Step 14 |
| projection / derived view / backend comparison / reconciliation / relay / handoff maintenance | Step 6 / Step 9 / Step 11 / Step 15 |
| failure / cleanup / lease / orphan / reaper / redline state progression | Step 6 / Step 9 / Step 10 / Step 12 |
| trace / audit / outbox / material handoff / investigation handoff side effect | Step 8 / Step 9 / Step 11 / Step 15 |
| unit / contract / service / integration test shell | Step 16 |

---

## 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本轮详细设计覆盖范围、非范围和下游文档边界。

#### 2. 本次详细设计目标与范围

本轮详细设计目标是把新版 `02-概要设计.md` 已收稳的 `L4-sandbox` 代码主体框架、4 个运行单元口径、6 个主要组成部分、关键对象、6 类接口骨架、关键处理流、6 组并行状态机和配置影响轮廓,展开为目标实现仓可以 1:1 落码的实现契约。

##### 2.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现边界 | 把 4 个运行单元、6 个主要组成部分和 4 层实现分层落成正式实现组织主轴 | workspace / crate / module / file layout |
| 收稳对象契约 | 把 intake、boundary、policy、run / capture / handoff、failure / cleanup / redline、read / derived 对象族展开为 Rust-facing carrier、字段、状态和不变量 | domain 与 contracts 类型 |
| 收稳协议契约 | 把 Command / Query / Consumer / Outbound Event / Job / Port 骨架展开为 DTO、receipt、report、metadata、idempotency 和错误 surface | entry / consumer / job / port shell |
| 收稳处理流与事务 | 把关键 flow family 展开为 application service 编排、repository / port 调用、save order、relay / handoff / cleanup 副作用 | service 与 unit-of-work |
| 收稳状态矩阵 | 把 6 组并行状态机落成正式 enum、迁移矩阵、forbidden transition 和传播关系 | state guard 与状态测试 |
| 收稳持久化与一致性 | 明确 truth、history、audit、projection、handoff、relay、stored result 和 job report 的 repository / port 语义 | repository trait 与 fake adapter |
| 收稳错误 / 幂等 / 并发 | 定义错误类型、request digest、duplicate / conflict、dedup、retry、stored result、expected version 和 UoW 规则 | 幂等 repository 与 service guard |
| 收稳配置 / 外部绑定 | 只定义代码引用配置、adapter binding、job binding、consumer / publisher / handoff binding 和禁止配置化边界 | `04-配置设计.md` 可继续展开完整手册 |
| 收稳审计 / trace / handoff | 明确 accepted truth 的 trace、audit、outbox、material / observability / investigation handoff 和 relay 切口 | trace / audit hook、handoff marker 和 relay job shell |
| 收稳测试切口 | 给出每个关键模块 / 接口 / 状态的最小验证清单 | `05-测试方案.md` 可承接为完整测试矩阵 |

##### 2.2 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、验收目标和一票否决项重写 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向和技术方案取舍重写 | `01-架构设计.md` |
| 新增 / 删除概要设计的运行单元、主要组成部分、关键对象、接口族、flow family 或状态机组 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置 profile、默认值、JSON 示例、env var、secret、迁移策略、环境矩阵和具体调度数字 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、自动化脚本、报告证据和回归策略 | `05-测试方案.md` |
| 验收基线、准入准出、验收证据、发布门禁和最终判定 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明、回退计划、implementation ledger 和 planned boundary skeleton | `07-实施计划.md` |
| 具体产品选型、部署拓扑、容量规划、on-call runbook 和故障处置 | ADR / 运维 / 部署文档 |
| tools semantic execution、runtime agent loop、member lifecycle、artifact formal truth、observability store、policy definition / approval / allowlist / capability truth | 对应相邻仓设计文档或外部系统契约 |
| 高级 replay / inspect、operator console、输出预览、结果分析、趋势分析、backend comparison 完整体验、多宿主调度 | 后续版本 / 产品增强 / ADR |

---

## 11. 待确认事项

- 当前无阻塞 Step 3 的待确认事项。
- Step 3 需要继续收稳 Rust 编码规范、workspace 约束、依赖裁剪和本地 sibling repo 约束。
- 后续 Step 6~10 若发现需要新增、删除或改名概要设计主语,必须回退 `02-概要设计.md`,不能在详细设计中暗改。
- 后续 Step 14 只定义代码引用配置和外部绑定点,不提前锁定完整配置手册、产品选型或容量数值。
- 后续 Step 17 必须把正式 `03` 可交给 `07` 的 implementation boundary 输入列清,但不直接创建 implementation ledger 或 planned boundary skeleton。

---

## 12. 进入下一步条件

- 已明确本轮详细设计覆盖所有核心隔离闭环和必要接缝。
- 已明确配置、测试、验收、实施、运维、ADR 和相邻仓正文不属于本轮详细设计正文范围。
- 已明确 read-side / derived / comparison / trend 只覆盖必要只读接缝与 no-write / degraded surface,完整增强后移。
- 已明确实现者拿到正式 `03` 后应能完成的代码范围。
- 可以进入 Step 3 `收稳编码规范、语言 / runtime、仓库约束`。

---

## 13. 自检

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否严格限于 Step 2 范围 | 是 | 只写范围、非范围和实现者可完成代码范围,未写文件布局、字段、DTO、trait 或状态矩阵。 |
| 是否承接正式 `00/01/02` | 是 | 范围来源全部来自正式 `00/01/02`、Step 1 和 `02_hld_step_12/13`。 |
| 是否隔离旧 `03` | 是 | 旧 `03` 只用于范围误差诊断,未作为范围来源。 |
| 是否明确下游文档归属 | 是 | 配置、测试、验收、实施、运维、ADR 和相邻仓正文均有归属。 |
| 是否发现上游 blocker | 否 | 当前无阻塞 Step 3 的上游 blocker。 |
| 是否改动正式 `projects/L4-sandbox/03-详细设计.md` | 否 | 正式文档仍待 Step 19 装配。 |

---

## 14. 当前结论

`03-详细设计.md` Step 2 `明确本轮实现范围和非范围` 已完成当前中间产物收敛。

当前恢复点应停在 Step 2 `completed_wait_user_review`。下一允许动作只有:

1. 等待用户审查本 Step 2 中间产物。
2. 只有在用户再次明确确认后,才允许读取详细设计 SOP Step 3、详细设计书写规范相关章节和仓库 / 编码约束输入,并进入 Step 3 `收稳编码规范、语言 / runtime、仓库约束`。
