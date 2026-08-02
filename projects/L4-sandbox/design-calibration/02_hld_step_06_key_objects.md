# Step 6. 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 从 Step 5 的对象候选池完成对象正式化筛选,为每个正式关键对象给出概要层对象类型、所属组成部分、责任、关键字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项;不写完整 Rust struct / enum、完整函数签名、DTO / event schema、repository、数据库表、配置 key、测试或实施 boundary。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 6 | 是。用户在 Step 5 审查点后回复“同意”,允许进入 Step 6。 |
| 项目级台账是否允许进入 Step 6 | 是。`project_execution_ledger.md` 记录 Step 5 已完成并等待用户确认,用户确认后可进入 Step 6。 |
| 文档级 flow 是否允许进入 Step 6 | 是。`02_hld_calibration_flow.md` 记录 Step 6 `blocked_by_step_5_review`,用户确认后可进入。 |
| 是否已读取 Step 5 中间产物 | 是。Step 5 提供对象发现维度表、每个组成部分对象发现线索和 Step 6 展开门禁。 |
| 是否已读取概要 SOP Step 6 | 是。Step 6 必须从候选池筛选对象,按主要组成部分逐个 formalize,每个对象独立成节。 |
| 是否已读取概要书写规范 §4.6 | 是。必须输出候选池筛选说明、单对象小节、字段 / 状态 / 函数 / 工厂 / 禁止事项表和 Step 8 / Step 9 反查清单。 |
| 是否发现阻塞 Step 6 的上游 blocker | 否。backend 组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、profile、SLO、DB / object store / observability / bus 产品选择仍是后续待确认,不阻塞对象轮廓。 |

---

## 2. 本步目标

本步把 Step 5 的候选对象池转成可被 Step 7 接口、Step 8 flow、Step 9 状态和 `03-详细设计.md` 反查的正式关键对象轮廓。

本步要回答:

- 哪些对象必须作为 sandbox 概要层正式主语出现。
- 哪些候选只作为字段类型、ref、summary、trace、port、DTO 或详细设计线索出现。
- 每个关键对象属于哪个主要组成部分,对象类型是什么,承担什么结构责任。
- 每个关键对象至少需要哪些关键字段骨架、状态候选、成员函数骨架和工厂函数骨架。
- 哪些字段、函数、状态和禁止事项会保护 truth / snapshot / reference / derived / forbidden body 分层。
- Step 8 / Step 9 将使用哪些对象,是否都能在本步反查。

本步不完成完整字段全集、返回类型、错误枚举、状态迁移矩阵、repository 读取面、port trait、DTO schema、event payload、数据库列、配置项或测试用例。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游承接、historical material 隔离和本文必须回答的问题。 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供本轮概要要达到的可实现结构骨架深度。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth / snapshot / reference / derived / forbidden body 分层、依赖裁剪和配置不可越界门禁。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架和实现分层。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供六个主要组成部分、对象候选池、对象发现维度表和 Step 6 展开门禁。 |
| `projects/L4-sandbox/00-需求文档.md` §7 / §9 / §10 / §11 / §14 / §16 | 当前正式需求基线 | 提供 C-SBX-1~5、FR / BR / AC / VF、数据归属和追溯矩阵。 |
| `projects/L4-sandbox/01-架构设计.md` §4 / §6 / §9 / §10 / §15 / §17 | 当前正式架构基线 | 提供职责边界、核心 / 支撑子域、数据所有权、关键交互、风险和 ADR 候选。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 6 | 约束对象 formalization 顺序、字段 / 函数骨架和停审记录。 |
| `standards/document/概要设计书写规范.md` | 已读取 §4.6 | 约束对象候选池筛选说明、单对象小节和字段 / 函数表格式。 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects.md` | 已读取 | 参考主控文件 + 对象附录拆分方式。 |
| `projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | 已读取 | 参考对象分布、反查清单和停审方式。 |
| 旧 `projects/L4-sandbox/README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于旧对象词、旧后端和旧五段主线污染审计;不得反推当前对象。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`02` flow、Step 5、Step 1~4、正式 `00/01`、概要 SOP Step 6 和书写规范 §4.6。 | done | 确认用户已允许进入 Step 6,正式 `02` 不修改。 |
| 2 | 从 Step 5 对象发现维度表和各组成部分对象发现线索整理候选池。 | done | 形成正式对象、合并对象、字段类型、Step 7 接口 / port 和详细设计后移分类。 |
| 3 | 按六个主要组成部分逐组完成对象 formalization。 | done | 对象骨架拆入 4 个附录文件,每个对象独立成节。 |
| 4 | 输出对象分布、Step 8 / Step 9 反查清单、停审记录和跨对象一致性审计。 | done | 保证后续 flow / 状态不能隐式发明对象。 |
| 5 | 诊断旧 README / 旧 `02` 的旧对象回流风险。 | done | 旧 `SandboxExecution / Session / Command / Policy / Output` 只作为 historical material。 |
| 6 | 更新 `02_hld_calibration_flow.md` 和项目台账,并停在用户审查点。 | pending | 不创建 Step 7 文件,不修改正式 `02-概要设计.md`。 |

---

## 5. 对象候选池筛选说明

### 5.1 正式进入 Step 6 的关键对象

| 主要组成部分 | 正式关键对象 | 展开文件 |
|---|---|---|
| `Controlled execution intake and identity` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`ControlledExecutionIntakeGuard`;`SandboxExecutionStatusView`;`ContextReferenceResolution`;`SandboxAuditTrace` | `02_hld_step_06_key_objects_intake_boundary.md`;`02_hld_step_06_key_objects_projection_audit.md` |
| `Boundary establishment and enforcement` | `CoherentBoundary`;`BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`IsolationEnvironmentHandle`;`BackendCapabilitySummary`;`BoundaryCoherenceGuard`;`BackendCapabilityGuard`;`BoundaryStatusView` | `02_hld_step_06_key_objects_intake_boundary.md` |
| `Policy execution decision` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard`;`PolicyDecisionSummaryView`;`SandboxAuditTrace` | `02_hld_step_06_key_objects_policy_capture.md`;`02_hld_step_06_key_objects_projection_audit.md` |
| `Execution capture and material handoff` | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact`;`CaptureCompletenessGuard`;`HandoffOwnershipGuard`;`CaptureSummaryView`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord`;`SandboxAuditTrace` | `02_hld_step_06_key_objects_policy_capture.md`;`02_hld_step_06_key_objects_projection_audit.md` |
| `Failure control and safety closure` | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment`;`ControlConflictGuard`;`CleanupSafetyGuard`;`RedlineContainmentGuard`;`FailureControlStatusView`;`CleanupReadinessView`;`RedlineContainmentView`;`SandboxAuditTrace` | `02_hld_step_06_key_objects_failure_safety.md`;`02_hld_step_06_key_objects_projection_audit.md` |
| `Local reference, projection and derived support` | `ReferenceResolutionState`;`DerivedInspectPreviewTrendState`;`DerivedReadOnlyGuard`;`ExternalBodyExclusionGuard`;`SandboxReadProjection`;`DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport`;`SandboxEventRelayRecord`;`SandboxAuditTrace` | `02_hld_step_06_key_objects_projection_audit.md` |

### 5.2 候选池筛选表

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| Step 5 显式列为 truth / state 的对象 | Truth / State | 正式关键对象 | 承接 sandbox 独立 truth、状态或正式事实,Step 8 / Step 9 会直接引用。 |
| Step 5 显式列为 policy / guard 的对象 | Policy / Invariant | 正式关键对象 | 这些 guard 会保护 intake、boundary、policy、capture、handoff、cleanup、redline 和 derived read 的关键不变量。 |
| Step 5 显式列为 projection / read model 的对象 | Projection / Read model | 正式关键对象 | Query、inspect、preview、trend、status 和 cleanup readiness 需要稳定只读对象主语。 |
| `SandboxAuditTrace` | Audit / History | 正式关键对象 | 各组成部分 trace 不拆成多套 audit 对象,统一由该对象承接来源、subject 和 trace material。 |
| `SandboxEventRelayRecord` | Audit / Handoff | 正式关键对象 | event relay 不拥有 truth,但需要记录已成立 fact 的传播、pending / failed 和 retryable 语义。 |
| `ContextReferenceResolution` | Reference / Boundary | 正式关键对象 | 用于区分 refs、safe summary 和 forbidden body,避免 intake 对象吞并外部正文。 |
| `IsolationBackendContractRef` | Reference / Boundary | 并入 `IsolationEnvironmentHandle` 和 Step 7 port | 它是 backend contract 引用字段,不是独立 domain truth;Step 7 会展开 `IsolationBackendPort`。 |
| artifact / runtime / runner / observability handoff refs | Reference / Boundary | 并入 `CapturedMaterialRef` / `HandoffFact` 字段 | 这些 refs 只标识交接目标和回链,不拥有下游 truth。 |
| investigation refs / handoff status refs / backend lifecycle refs | Reference / Boundary | 并入 `CleanupGuard` / `RedlineContainment` / `ReferenceResolutionState` 字段 | 这些 refs 服务判断和交接,不独立成为 sandbox truth。 |
| external refs / safe summaries / snapshot refs | Reference / Boundary | 并入 `ReferenceResolutionState` / `ContextReferenceResolution` 字段 | Step 6 需要定义解析状态,但不为每种外部 ref 建独立对象。 |
| policy decision trace、boundary establishment trace、failure / cleanup trace | Audit / History | 并入 `SandboxAuditTrace` | 防止每个组成部分产生重复 audit record 家族。 |
| derived refresh / reconciliation trace | Audit / History | 并入 `SandboxAuditTrace` 或 `SandboxReconciliationReport` | 派生维护 trace 不反写核心 truth。 |
| `Sandbox Sync Entry`、`Sandbox Async Control Intake`、`Sandbox Operations Jobs` | Inbound / Operations | 不作为关键对象 | 属于入口 / 触发 / job 主体,留给 Step 7 / Step 8。 |
| `SandboxTruthPersistencePorts`、`ContextReferenceResolverPorts`、`BackendCapabilityPort`、`IsolationBackendPort`、`PolicySummaryPort`、`MaterialHandoffPorts`、`ObservabilityMaterialPort`、`EventRelayPort`、`InvestigationHandoffPort` | Port / Repository | 不作为关键对象 | 属于接口骨架和详细设计 port 面,留给 Step 7 和 `03`。 |
| API command / query / event / callback / operations trigger 名称 | API / Trigger | 不作为关键对象 | 留给 Step 7 接口骨架和 Step 8 flow,不得抢写 DTO。 |
| 旧 `SandboxExecution`、`SandboxSession`、`SandboxCommand`、`SandboxPolicy`、`SandboxOutput` | historical material | 不作为当前关键对象 | 旧对象词未经新版 Step 5 capability 筛选,且混入 runtime / tools / policy / artifact 语义风险。 |

---

## 6. 对象展开文件

| 文件 | 内容 |
|---|---|
| `02_hld_step_06_key_objects.md` | 主控文件:候选池筛选、对象分布、反查清单、停审记录、审计和回填口径。 |
| `02_hld_step_06_key_objects_intake_boundary.md` | 受理 / identity / reference resolution / boundary / backend capability 对象骨架。 |
| `02_hld_step_06_key_objects_policy_capture.md` | policy execution / high-risk action / controlled run / capture / material / handoff 对象骨架。 |
| `02_hld_step_06_key_objects_failure_safety.md` | failure / control / lease / orphan / cleanup / redline / status view 对象骨架。 |
| `02_hld_step_06_key_objects_projection_audit.md` | reference state / derived state / read projection / comparison / reconciliation / audit / event relay 对象骨架。 |

正式 `02-概要设计.md` 后续只摘录对象筛选表、对象分布表和必要对象摘要;对象字段 / 函数完整骨架保留在 Step 6 附录中供 `03-详细设计.md` 承接。

---

## 7. 关键对象与主要组成部分分布

| 主要组成部分 | 关键对象 |
|---|---|
| `Controlled execution intake and identity` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`ControlledExecutionIntakeGuard`;`SandboxExecutionStatusView`;`ContextReferenceResolution`;`SandboxAuditTrace` |
| `Boundary establishment and enforcement` | `CoherentBoundary`;`BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`IsolationEnvironmentHandle`;`BackendCapabilitySummary`;`BoundaryCoherenceGuard`;`BackendCapabilityGuard`;`BoundaryStatusView` |
| `Policy execution decision` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard`;`PolicyDecisionSummaryView`;`SandboxAuditTrace` |
| `Execution capture and material handoff` | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact`;`CaptureCompletenessGuard`;`HandoffOwnershipGuard`;`CaptureSummaryView`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord`;`SandboxAuditTrace` |
| `Failure control and safety closure` | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment`;`ControlConflictGuard`;`CleanupSafetyGuard`;`RedlineContainmentGuard`;`FailureControlStatusView`;`CleanupReadinessView`;`RedlineContainmentView`;`SandboxAuditTrace` |
| `Local reference, projection and derived support` | `ReferenceResolutionState`;`DerivedInspectPreviewTrendState`;`DerivedReadOnlyGuard`;`ExternalBodyExclusionGuard`;`SandboxReadProjection`;`DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport`;`SandboxEventRelayRecord`;`SandboxAuditTrace` |

---

## 8. Step 8 / Step 9 反查清单

### 8.1 关键处理流反查

| 预计处理流 | 必须能反查到的对象 |
|---|---|
| 受控执行请求受理 / 拒绝 | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`ControlledExecutionIntakeGuard`;`SandboxAuditTrace` |
| context refs / safe summary 解析 | `ContextReferenceResolution`;`ReferenceResolutionState`;`ExternalBodyExclusionGuard`;`SandboxAuditTrace` |
| boundary requirement 合成与能力校验 | `BoundaryRequirementSet`;`BackendCapabilitySummary`;`BoundaryCoherenceGuard`;`BackendCapabilityGuard`;`BoundaryEstablishmentDecision` |
| 正式隔离环境建立 / 拒绝 / 等待 | `CoherentBoundary`;`IsolationEnvironmentHandle`;`BoundaryEstablishmentDecision`;`BoundaryStatusView`;`SandboxAuditTrace` |
| policy snapshot 承接与 fail-closed 裁定 | `PolicyApplicabilitySnapshot`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard`;`PolicyExecutionDecision`;`PolicyDecisionSummaryView` |
| 高风险动作阻断 | `HighRiskActionDecision`;`PolicyExecutionDecision`;`FailureClassification`;`ControlFact`;`SandboxAuditTrace` |
| 受控执行运行承接 | `ControlledExecutionRun`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`PolicyExecutionDecision`;`SandboxAuditTrace` |
| capture 与候选材料收口 | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`CaptureCompletenessGuard`;`CaptureSummaryView` |
| material / observability / event handoff | `HandoffFact`;`HandoffOwnershipGuard`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord`;`SandboxAuditTrace` |
| failure classification 与 control 收束 | `FailureClassification`;`ControlFact`;`ControlConflictGuard`;`FailureControlStatusView`;`SandboxAuditTrace` |
| lease / orphan / cleanup / reaper | `LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`CleanupSafetyGuard`;`CleanupReadinessView`;`SandboxAuditTrace` |
| redline containment 与 investigation handoff | `RedlineContainment`;`RedlineContainmentGuard`;`RedlineContainmentView`;`ReferenceResolutionState`;`SandboxAuditTrace` |
| read projection / inspect / preview / trend 维护 | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView`;`DerivedReadOnlyGuard`;`ExternalBodyExclusionGuard`;`SandboxReconciliationReport` |
| backend comparison / capacity trend | `BackendCapabilitySummary`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport`;`DerivedReadOnlyGuard` |

### 8.2 状态机反查

| 状态主题 | Step 6 对象来源 |
|---|---|
| intake accepted / rejected / pending / unresolved | `ControlledExecutionContext`;`ExecutionContextResolution`;`ControlledExecutionIntakeGuard` |
| execution environment identity active / closed / invalidated | `ExecutionEnvironmentIdentity`;`ControlledExecutionContext` |
| boundary required / established / rejected / pending / failed | `BoundaryRequirementSet`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`IsolationEnvironmentHandle` |
| backend capability usable / stale / unsupported / unknown | `BackendCapabilitySummary`;`BackendCapabilityGuard`;`BoundaryStatusView` |
| policy accepted / rejected / blocked / pending / fail-closed | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`FailClosedPolicyGuard` |
| controlled run preparing / running / completed / failed / terminated | `ControlledExecutionRun`;`CaptureFact`;`FailureClassification`;`ControlFact` |
| capture complete / partial / failed / unavailable | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`CaptureCompletenessGuard` |
| handoff pending / delivered / failed / retryable | `HandoffFact`;`HandoffOwnershipGuard`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord` |
| failure / control stable / conflict / terminal | `FailureClassification`;`ControlFact`;`ControlConflictGuard`;`FailureControlStatusView` |
| lease active / expiring / expired / orphaned / recovered | `LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard` |
| cleanup allowed / blocked / pending / completed | `CleanupGuard`;`CleanupSafetyGuard`;`CleanupReadinessView` |
| redline detected / contained / handoff-pending / released / terminal | `RedlineContainment`;`RedlineContainmentGuard`;`RedlineContainmentView` |
| reference resolved / unresolved / stale / invalid | `ReferenceResolutionState`;`ContextReferenceResolution` |
| derived fresh / stale / rebuilding / failed / unavailable | `DerivedInspectPreviewTrendState`;`SandboxReadProjection`;`SandboxReconciliationReport` |

---

## 9. 每个主要组成部分的对象正式化停审记录

| 主要组成部分 | 结论 | 说明 |
|---|---|---|
| `Controlled execution intake and identity` | pass | 已 formalize context、identity、resolution、intake guard、status view、reference resolution 和 audit trace;未保存 identity / work / runner / tool / runtime 正文。 |
| `Boundary establishment and enforcement` | pass | 已 formalize boundary、requirement、decision、handle、backend summary、coherence / capability guard 和 boundary status view;未硬化后端产品。 |
| `Policy execution decision` | pass | 已 formalize snapshot、decision、high-risk action、applicability / fail-closed guard 和 summary view;未生成 policy source truth。 |
| `Execution capture and material handoff` | pass | 已 formalize run、capture、material ref、observability material、handoff、capture / ownership guard、summary view 和 relay record;未迁移下游 ownership。 |
| `Failure control and safety closure` | pass | 已 formalize failure、control、lease、orphan、cleanup、redline、safety guards 和 status views;未推进 runtime recover 或 artifact retention。 |
| `Local reference, projection and derived support` | pass | 已 formalize reference state、derived state、read-only guards、projection、derived view、comparison、reconciliation、audit 和 relay;派生只读,不反写核心 truth。 |

---

## 10. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Step 5 必须展开候选是否处理完 | pass | 所有 truth / state、policy / guard、projection / read model、reference / boundary、audit / history 候选已正式展开或在 §5.2 说明合并 / 后移理由。 |
| 核心 truth 是否重复建模 | pass | context、boundary、policy、run / capture、failure / cleanup / redline 各有唯一主对象,共享 audit / relay 统一归属。 |
| 字段骨架是否暗含外部正文 | pass | 字段只使用 refs、summary、snapshot、material refs 和 status,禁止保存 identity / work / artifact / observability / policy / investigation 正文。 |
| backend 产品是否反向定义对象 | pass | 仅通过 `BackendCapabilitySummary` 和 `IsolationEnvironmentHandle` 表达抽象 capability 与 handle,不写 Docker/gVisor/k8s 等产品字段。 |
| policy source 是否被吞并 | pass | `PolicyApplicabilitySnapshot` 和 `PolicyExecutionDecision` 只承接给定 policy / authorization 摘要,不拥有 allowlist / approval / DSL truth。 |
| capture / handoff 是否迁移 ownership | pass | `CapturedMaterialRef` 和 `HandoffFact` 只表达候选材料和交接事实,不宣布 formal artifact、runtime result 或 observability store truth。 |
| cleanup / redline 是否被弱化 | pass | `CleanupGuard`、`CleanupSafetyGuard`、`RedlineContainment`、`RedlineContainmentGuard` 均为正式关键对象。 |
| derived read surface 是否成为写源 | pass | `DerivedReadOnlyGuard` 和 `ExternalBodyExclusionGuard` 明确禁止 query / preview / trend / comparison 反写核心 truth。 |
| Step 8 / Step 9 预计对象是否可反查 | pass | §8 已覆盖预计 flow 和状态主题。 |
| 是否越层进入详细设计 | pass | 未写完整 Rust 签名、返回类型、schema、DDL、repository、配置 key、event payload、测试或实施 boundary。 |

---

## 11. 本步设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否沿用旧 `SandboxExecution / Session / Command / Policy / Output` | 不沿用 | 旧对象词混入 runtime、tools、policy source 和 artifact 语义,不能作为当前对象真相源。 |
| 是否把所有 refs 都独立成对象 | 不全部独立 | 只有 `ContextReferenceResolution` 和 `ReferenceResolutionState` 这类具有边界语义的对象独立;普通 refs 留作字段类型。 |
| 是否把每个组成部分 audit trace 拆成独立对象 | 不拆 | 统一为 `SandboxAuditTrace`,避免重复 audit 家族和命名漂移。 |
| 是否把 ports / repositories 当关键对象 | 不展开 | 留给 Step 7 接口骨架和 `03` 详细设计,避免 Step 6 抢写 trait / repository 面。 |
| 是否把 read model 视为关键对象 | 展开 | Query、status、preview、trend、comparison 和 reconciliation 需要稳定只读对象主语,并通过 guard 防止反写。 |

---

## 12. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02` 的 `SandboxExecution` / `SandboxSession` 等旧对象 | 会把 command、session、policy 和 output 旧主线带回当前设计。 | 降为 historical material,当前对象从 Step 5 capability 和新版 `00/01` 数据归属推导。 |
| 旧 README 的 backend / trait / 目录线索 | 会把 Docker/gVisor/local_process、SandboxService 和旧目录变成对象来源。 | 只保留 `BackendCapabilitySummary`、`IsolationEnvironmentHandle` 和 Step 7 port 边界。 |
| Step 5 候选数量较大 | 若只写对象总览,会让详细设计重新发明字段、状态和函数骨架。 | 拆成主控文件和 4 个对象附录,每个关键对象独立成节。 |
| read / projection / derived 容易被视为次要 | 如果 Step 6 不 formalize,Step 8 / Step 9 会临时补 query view 和 derived state。 | 将 projection、status view、derived state、comparison view、reconciliation report 全部纳入正式对象。 |
| failure / cleanup / redline 容易变成运维补偿 | 若对象不足,后续 flow 会把非 happy path 交给调用方或脚本。 | 将 failure、control、lease、orphan、cleanup、redline 和 guards 全部 formalize。 |

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §6 “关键对象轮廓”引用本文件 §5.1 的正式对象筛选表和 §7 的对象分布表。
- §6 可按六个主要组成部分分组摘录关键对象摘要,不机械粘贴 4 个附录的所有字段 / 函数骨架。
- §6 对核心 truth 对象必须至少摘录 `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`CoherentBoundary`、`PolicyExecutionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`ControlFact`、`CleanupGuard`、`RedlineContainment`。
- §6 对支撑对象必须摘录 `BackendCapabilitySummary`、`PolicyApplicabilitySnapshot`、`CapturedMaterialRef`、`ObservabilityMaterial`、`ReferenceResolutionState`、`SandboxReadProjection`、`SandboxAuditTrace`、`SandboxEventRelayRecord`。
- Step 7~9 必须引用本文件 §8 的反查清单,不得引入 Step 6 未定义的新正式对象。

---

## 14. 待确认事项

| 待确认项 | 当前处理 | 后续落点 |
|---|---|---|
| `ControlledExecutionRun` 与 runtime `ExecutionInstance` 的边界是否仍需额外命名 | 当前独立展开,并明确不等于 runtime truth。 | Step 8 / Step 9 / `03` 继续保护边界。 |
| `IsolationEnvironmentHandle` 是否过早靠近 backend SDK | 当前作为 sandbox truth 侧 handle 独立展开,字段只保留 backend ref 和 lifecycle marker。 | Step 7 / `03` 展开 port,不得写 SDK 原始响应。 |
| `SandboxAuditTrace` 是否统一所有 trace | 当前统一。 | Step 7 / Step 8 如需 outbox / event payload,必须继续从该对象或对应 fact 构造。 |
| failure taxonomy / control conflict / redline lifecycle 细节 | 当前只给状态候选和函数骨架。 | Step 9 / Step 10 / `03` 继续收敛。 |

本步不新增阻塞 Step 7 的上游 blocker。backend 组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、security profile、SLO 和产品选型仍按 `01` 风险口径挂起,不得在 Step 7 伪装成已确认接口或错误码。

---

## 15. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已从 Step 5 对象候选池完成对象 formalization | pass |
| 每个正式关键对象均有独立小节或附录对象卡片 | pass |
| 字段表使用 `字段 / 类型 / 作用` | pass |
| 成员函数 / 工厂函数参数使用 `TypeName param_name` | pass |
| 已说明不展开的候选名称和原因 | pass |
| 已完成每个主要组成部分对象正式化停审 | pass |
| 已完成 Step 8 / Step 9 反查清单 | pass |
| 已完成跨对象 / 跨组成部分一致性审计 | pass |
| 未写完整 Rust struct / enum、返回类型、schema、repository、DDL、配置、测试或实施边界 | pass |
| 未修改正式 `02-概要设计.md` | pass |
| 是否可以进入 Step 7 | 需要用户审查并明确确认后,才能进入 Step 7 `API / 接口骨架`。 |
