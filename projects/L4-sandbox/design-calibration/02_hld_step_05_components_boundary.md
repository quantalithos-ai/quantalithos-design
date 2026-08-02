# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 在 Step 4 已收稳代码主体框架和实现分层之后,正式收敛 `L4-sandbox` 的主要组成部分、capability、非职责、接缝、代码主体归属和 Step 6 对象候选池;不展开对象字段、成员函数、工厂函数、完整接口契约、处理流、状态矩阵、目录、后端产品或配置项。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 5 | 是。用户在 Step 4 审查点后回复“同意”,允许进入 Step 5。 |
| 项目级台账是否允许进入 Step 5 | 是。`project_execution_ledger.md` 记录 Step 4 已完成并等待用户确认,用户确认后可进入 Step 5。 |
| 文档级 flow 是否允许进入 Step 5 | 是。`02_hld_calibration_flow.md` 记录 Step 5 等待 Step 4 用户确认。 |
| 是否已读取 Step 1~4 中间产物 | 是。Step 1 提供上游边界,Step 2 提供目标和范围,Step 3 提供结构约束,Step 4 提供代码主体骨架和业务组成部分候选。 |
| 是否已读取概要 SOP Step 5 | 是。Step 5 必须输出组成部分总表、capability 清单、对象发现维度表、各部分交互总图、每部分独立小节和停审记录。 |
| 是否已读取概要书写规范 §4.5 与 ASCII 图规则 | 是。正式 §5 必须使用组成部分总表、对象发现维度表、各部分交互总图和各部分小节。 |
| 是否发现阻塞 Step 5 的上游 blocker | 否。旧 README / 旧 `02` 的旧对象、旧后端、旧事件和旧目录仍为 historical material;后端组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、profile 和 SLO 仍是后续待确认,不阻塞本 Step。 |

---

## 2. 本步目标

本步在 Step 4 的代码主体框架之上,把 `L4-sandbox` 收敛为可继续进入对象、接口、flow 和状态设计的主要组成部分。

本步要回答:

- `L4-sandbox` 在概要层由哪些业务结构主语构成。
- 每个组成部分承担什么 capability,明确不承担什么职责。
- 每个组成部分包含哪些 Step 4 已点名的代码主体 / 模块。
- 每个组成部分和其他部分通过什么接缝协作。
- 每个组成部分能发现哪些 truth / state、policy / invariant、projection / read model、reference / boundary、audit / history 候选对象。
- 哪些候选对象必须进入 Step 6 独立筛选和展开。

本步不定义对象自身字段、状态集合、成员函数、工厂函数、接口参数、处理流步骤或完整状态迁移。这些内容分别留给 Step 6~9。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游边界、旧材料隔离、本文必须回答和暂不进入范围。 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供本轮 `02` 的可实现结构骨架深度、目标和非范围。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth / snapshot / reference / derived / forbidden body 分层、coherent boundary、policy fail-closed、capture / handoff、cleanup / redline 等 Step 5 门禁。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供六个业务主要组成部分候选、代码主体骨架、实现分层视图和关键判断。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、数据归属、接口依赖、AC / VF 红线。 |
| `projects/L4-sandbox/01-架构设计.md` §6~10 / §15 | 当前正式架构基线 | 提供核心 / 支撑子域、运行承载、依赖方向、数据所有权、关键交互、风险和待确认项。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 5 | 约束本 Step 必须按主要组成部分逐个展开并停审。 |
| `standards/document/概要设计书写规范.md` | 已读取 §4.5 / §5.3.4 | 约束总表、对象发现维度表、图和小节格式。 |
| `projects/L1-artifact/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 参考 Step 5 按组成部分、capability、候选对象和停审记录展开的粒度。 |
| `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 参考业务主要组成部分与对象候选池的停审方式。 |
| 旧 `projects/L4-sandbox/README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于审计 `SandboxExecution`、`SandboxSession`、`SandboxCommand`、`SandboxPolicy`、`SandboxOutput`、`SandboxService`、Docker/gVisor、旧事件、旧目录和旧性能数字污染风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`02` flow、Step 4、Step 1~3、概要 SOP Step 5 和书写规范 §4.5。 | done | 确认 Step 5 只能创建 `02_hld_step_05_components_boundary.md`,正式 `02` 不修改。 |
| 2 | 回读正式 `00/01` 中核心能力、功能需求、数据归属、子域、运行承载、依赖、交互和风险待确认。 | done | 确认 Step 5 组成部分必须闭合 C-SBX-1~5 和 Step 3 约束。 |
| 3 | 对照 L1-artifact / L1-governance Step 5 粒度。 | done | 采用总表 + 对象发现维度表 + 交互总图 + 逐组成部分小节 + 停审记录。 |
| 4 | 诊断旧 README / 旧 `02` 的旧对象和后端回流风险。 | done | 确认旧对象词不直接进入正式主要组成部分。 |
| 5 | 回答 Step 5 SOP 问题。 | done | 明确六个主要组成部分、capability、非职责、接缝和候选对象。 |
| 6 | 输出组成部分总表、对象发现维度表、各部分交互总图和逐部分小节。 | done | 满足正式 §5 回填输入要求。 |
| 7 | 输出总体边界说明、Step 6 展开门禁、跨组成部分闭环审计和后续一致性说明。 | done | Step 6 可从候选池筛选对象,但不能提前展开对象字段 / 函数。 |
| 8 | 更新 `02_hld_calibration_flow.md` 和项目台账,并停在用户审查点。 | done | 不创建 Step 6 文件,不修改正式 `02-概要设计.md`。 |

---

## 5. SOP 问题回答

### 5.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

当前 `L4-sandbox` 在概要设计层划分为 6 个主要组成部分:

1. `Controlled execution intake and identity`
2. `Boundary establishment and enforcement`
3. `Policy execution decision`
4. `Execution capture and material handoff`
5. `Failure control and safety closure`
6. `Local reference, projection and derived support`

这些名称是业务结构主语,不是实现分层、源码目录、后端产品、旧 `SandboxExecution / Session / Command / Policy / Output` 对象词或外部系统。每个组成部分会跨越 Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Handoff 等实现分层。

### 5.2 每个主要组成部分分别承担什么职责?

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Controlled execution intake and identity` | 受理需要真实执行的请求,收束调用方来源、identity / work refs、责任链、最小拒绝前提和 execution environment identity。 | `Sandbox Sync Entry`;`ControlledExecutionIntakeService`;`ExecutionEnvironmentService`;`ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ContextReferenceResolverPorts` | 不拥有 ToolInvocation、ExecutionInstance、SandboxBinding、RunnerRun、identity / work 正文或调用方业务 truth。 |
| `Boundary establishment and enforcement` | 建立正式隔离环境,把 resource / filesystem / network / process / workspace / mount 限制作为 coherent boundary 整体裁定和施加。 | `BoundaryEstablishmentService`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`BackendCapabilityPort`;`IsolationBackendPort` | 不拥有 Docker/gVisor/Firecracker/k8s/local_process 产品 truth、host / cluster lifecycle 或 backend 产品配置。 |
| `Policy execution decision` | 消费给定 launch / isolation policy、authorization、approval 或 capability 摘要,形成继续、拒绝、阻断、pending 或 fail-closed 裁定。 | `PolicyExecutionService`;`PolicyExecutionDecision`;`PolicySummaryPort`;`ContextReferenceResolverPorts` | 不生成 allowlist truth、approval truth、policy definition truth、capability truth、policy DSL 或 tools semantic policy。 |
| `Execution capture and material handoff` | 在已成立语境、边界和 policy 下承接受控执行、capture 输出 / 候选材料 / observability material,并形成显式 handoff fact。 | `ControlledExecutionCarrierService`;`CaptureHandoffService`;`CaptureFact`;`HandoffFact`;`MaterialHandoffPorts`;`ObservabilityMaterialPort`;`EventRelayPort` | 不拥有 tools semantic execution、runtime agent loop、Artifact / baseline / evidence truth、runtime result、runner UI state 或 observability store。 |
| `Failure control and safety closure` | 把 timeout、deny、kill、cancel、backend failure、capture failure、lease expiry、orphan、cleanup guard、reaper 和 redline containment 作为核心闭环收束。 | `Sandbox Async Control Intake`;`Sandbox Operations Jobs`;`FailureControlService`;`CleanupReaperService`;`RedlineContainmentService`;`FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment`;`InvestigationHandoffPort` | 不推进 runtime recover、不做业务 replay、不拥有 artifact retention / investigation lifecycle / operator UI,也不允许 cleanup 先删证据。 |
| `Local reference, projection and derived support` | 维护 refs、safe summary、snapshot、projection、inspect / preview / trend、backend comparison 和只读解释面,支撑读取、对账、调查和后续决策。 | `SandboxReadService`;`SandboxDerivedMaintenanceService`;`SandboxProjectionReadModels`;`DerivedInspectPreviewTrendReadModels`;`ContextReferenceResolverPorts`;`BackendCapabilityPort`;`EventRelayPort` | 不新建或覆盖 execution isolation truth,不把 query / inspect / preview / trend 变成写路径或核心通过前提。 |

### 5.3 每个主要组成部分明确不承担什么职责?

每个组成部分的非职责必须保护三类边界:

- 相邻仓 truth 边界:tools、runtime、member-service、identity、work、artifact、observability、policy sources、runner、investigation 和 UI 正文都不得进入 sandbox truth。
- 后端与技术承载边界:backend capability、storage、event、observability、profile、SLO 和配置只能支撑判断或承载,不得定义业务语义。
- 概要与详细设计边界:Step 5 只形成 capability 与对象候选池,不写字段、函数、完整接口、状态矩阵、repository、schema、配置 key 或测试。

### 5.4 每个主要组成部分需要完成哪些功能 / capability?

本步将功能 / capability 按组成部分拆分为:

- 受控执行语境接入、执行环境身份与责任链绑定、跨调用方入口归并、状态 / 归责读取。
- 隔离环境建立、边界限制合成、限制可落实性校验、backend capability 摘要消费、边界建立拒绝。
- policy 语境承接、策略内执行裁定、高风险动作阻断、policy 缺失 / 冲突 / 不支持 fail-closed、跨调用方统一策略口径。
- 受控执行承接、执行输出 capture、候选材料收口、observability material 形成、material handoff、handoff pending / failed / retryable 记录。
- 失败分类、control fact、lease / orphan、cleanup guard、reaper、redline containment、investigation handoff、非 happy path 追溯材料。
- 只读查询、refs / summary 解析、backend capability / workspace 摘要刷新、projection / inspect / preview / trend 维护、derived unavailable / stale / rebuilding 可见化。

### 5.5 每个功能需要哪些输入、输出、状态影响、外部协作或后续 Step 承接?

功能输入来自调用方受控执行意图、identity / work / runner / tool / runtime refs、given policy / authorization summary、backend capability summary、isolation backend 承载反馈、执行输出、下游 handoff 状态、control signal、investigation summary 和已成立 sandbox truth。

功能输出分为:

- sandbox truth: accepted / rejected context、execution environment identity、coherent boundary、policy execution decision、capture fact、handoff fact、failure classification、control fact、lease / orphan / cleanup / redline fact。
- 外部协作材料: captured output refs、candidate material refs、observability material、event relay、handoff refs、investigation handoff refs。
- 只读派生: projection、inspect / preview / trend、backend comparison、derived status。

状态影响由 Step 9 展开;接口分类由 Step 7 展开;关键对象由 Step 6 从本步候选池正式筛选。

### 5.6 每个主要组成部分包含哪些代码主体 / 模块?

本步只按 Step 4 已点名主体归属到组成部分,不新增目录和实现框架。代码主体 / 模块包括 Inbound / Operations 主体、Application Service 主体、Domain Model 主体、Ports / Persistence / Projection / Handoff 主体。各组成部分小节中的 `后续展开位置` 会明确指向 Step 6 / 7 / 8 / 9 或详细设计。

### 5.7 这些代码主体 / 模块在本部分中只需要说明到什么粒度?

只说明:

- 名称。
- 类型。
- 在本部分中的作用。
- 后续展开位置。

不说明:

- 字段。
- 函数签名。
- 参数类型。
- DTO / event schema。
- repository 方法。
- 数据库表。
- 目录路径。
- 后端产品 API。

### 5.8 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

| 相关内容 | 正确归属 | `L4-sandbox` 的处理口径 |
|---|---|---|
| ToolDefinition、ToolPolicy、ToolInvocationResult、ToolAuditEntry、工具语义执行 | `L2-tools` | 只承接受控执行请求、给定 policy summary 和材料 handoff,不解释工具语义。 |
| ExecutionInstance、CurrentStep、agent loop、checkpoint / recover、runtime result truth | `L2-runtime` | 只提供受控执行反馈、capture / handoff material 和失败 / control 材料,不推进 runtime 主线。 |
| MemberExecutionHost、SandboxBinding、session、worker、host health、callback material | `L2-member-service` | 只提供隔离执行语境、bind / execute 材料和反馈边界,不拥有 host lifecycle。 |
| actor / member / project / work / runner 正文 | `L1-identity`;`L1-work`;`L5-runner` | 只消费 refs、safe summary 和责任语境。 |
| Artifact 正文、baseline、formal evidence、retention truth | `L1-artifact` | 只形成 captured output、candidate material、handoff fact 和 cleanup guard 输入。 |
| audit / trace / metric store、alert stream、observability retention | `L4-observability` | 只形成 observability material 和 handoff fact,不拥有 store truth。 |
| policy definition、approval、allowlist、capability、policy DSL | governance / capability / tools policy sources | 只消费给定 policy / authorization 摘要并 fail-closed。 |
| Docker/gVisor/Firecracker/k8s/local_process、DB、object store、OTel、secrets、GRC、profile、SLO | 后端 / 配置 / 测试 / 实施阶段 | 只作为 capability summary、adapter boundary 或后续待确认,不定义业务组成部分。 |

### 5.9 哪些职责如果不写清,后续最容易让概要设计滑进实现层或让不同部分串线?

最容易串线的职责包括:

- `ControlledExecutionCarrierService` 被误读为 tools 语义执行或 runtime agent loop。
- `BackendCapabilityPort` 被误读为 backend product owner。
- `PolicyExecutionDecision` 被误读为 policy definition / approval truth。
- `CaptureFact` 和 `HandoffFact` 被误读为 Artifact、runtime result 或 observability store truth。
- `FailureControlService`、`CleanupReaperService` 和 `RedlineContainmentService` 被降级成运维脚本或调用方补偿。
- `SandboxProjectionReadModels` 和 `DerivedInspectPreviewTrendReadModels` 被误写成 truth 写路径。

### 5.10 每个主要组成部分分别包含哪些对象发现线索?

对象发现线索在 §9.2 总表和 §10 各组成部分小节中展开。每个候选都标注为 truth / state、policy / invariant、projection / read model、reference / boundary、audit / history 等维度。Step 6 必须从这些候选池正式筛选,不能在 Step 6 隐式发明对象主语。

### 5.11 这些线索分别属于 truth / state / policy / projection / reference / audit / history 哪个维度?

本步按以下维度判断:

- Truth / State: sandbox 独立拥有的正式事实、决策、控制、lease、cleanup、redline 或可独立状态主语。
- Policy / Invariant: 判断是否允许受理、建立边界、继续执行、交接、cleanup 或 read 的规则主语。
- Projection / Read model: 只读摘要、状态读取、inspect / preview / trend、backend comparison、对账和消费面。
- Reference / Boundary: 外部 refs、safe summary、policy refs、backend refs、handoff refs、investigation refs 和 port 边界。
- Audit / History: trace、audit、change、handoff、control、cleanup、redline 等可追溯记录。

### 5.12 哪些候选对象必须进入 Step 6 独立成节展开?

Step 6 必须从本步候选池中筛选并独立展开以下候选:

- `ControlledExecutionContext`
- `ExecutionEnvironmentIdentity`
- `ExecutionContextResolution`
- `CoherentBoundary`
- `BoundaryRequirementSet`
- `BoundaryEstablishmentDecision`
- `BackendCapabilitySummary`
- `IsolationEnvironmentHandle`
- `PolicyExecutionDecision`
- `PolicyApplicabilitySnapshot`
- `HighRiskActionDecision`
- `ControlledExecutionRun`
- `CaptureFact`
- `CapturedMaterialRef`
- `ObservabilityMaterial`
- `HandoffFact`
- `FailureClassification`
- `ControlFact`
- `LeaseRecord`
- `OrphanRecoveryRecord`
- `CleanupGuard`
- `RedlineContainment`
- `SandboxReadProjection`
- `DerivedInspectPreviewTrendState`
- `ReferenceResolutionState`
- `SandboxAuditTrace`
- `SandboxEventRelayRecord`

Step 6 可以解释个别候选合并或后移,但必须在对象候选池筛选说明中给出原因。

### 5.13 哪些名称只是 API / repository / port / trigger / DTO / 字段类型,不应在 Step 6 被误写成领域对象?

以下名称默认不作为 Step 6 关键对象独立展开,除非 Step 6 明确说明其对象责任:

- `Sandbox Sync Entry`
- `Sandbox Async Control Intake`
- `Sandbox Operations Jobs`
- `SandboxTruthPersistencePorts`
- `ContextReferenceResolverPorts`
- `BackendCapabilityPort`
- `IsolationBackendPort`
- `PolicySummaryPort`
- `MaterialHandoffPorts`
- `ObservabilityMaterialPort`
- `EventRelayPort`
- `InvestigationHandoffPort`
- API command / query / event / callback / operations trigger 名称
- repository、adapter、worker、DTO、HTTP body、CloudEvent payload、database table、backend SDK raw response

### 5.14 当前组成部分完成后,功能、候选对象、接缝和禁止事项是否通过停审?

本文件 §10 为每个组成部分提供停审记录。所有组成部分当前都通过本 Step 停审:功能来源明确、候选对象有 capability 来源、接缝清楚、非职责清楚、未越界进入字段 / 函数 / schema / 状态矩阵。

### 5.15 所有组成部分完成后,是否存在重复对象、职责重叠、候选对象遗漏或后续展开位置冲突?

本文件 §13 提供跨组成部分闭环审计表。当前未发现 unresolved 冲突。存在的共享候选通过归属口径处理:

- `ContextReferenceResolverPorts` 和 `ReferenceResolutionState` 服务多个部分,但作为 reference / boundary support 归属 `Local reference, projection and derived support`。
- `BackendCapabilityPort` 服务边界建立和派生比较,但正式 boundary 裁定归属 `Boundary establishment and enforcement`。
- `EventRelayPort` 服务 handoff 与 failure material,但 event relay 不拥有 truth,后续 Step 7 作为接口 / port 骨架展开。
- `CapturedMaterialRef` 服务 capture、handoff、cleanup guard 和 read projection,但 truth owner 是 `Execution capture and material handoff`。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02` 五段主线 | “执行请求与会话 / 隔离资源 / command-provider / 输出审计 / 失败运维”未覆盖新版 execution environment identity、policy fail-closed、handoff ownership、cleanup guard 和 redline containment。 | Step 5 改为六个业务主要组成部分,逐个映射 C-SBX-1~5 和 Step 4 代码主体。 |
| 旧 `SandboxExecution` / `SandboxSession` / `SandboxCommand` / `SandboxPolicy` / `SandboxOutput` | 容易把旧对象词提前固定为 Step 6 对象,且混入 runtime / tools / policy source / artifact 语义。 | 本步只保留为 historical material;对象候选改为新版 truth / boundary / policy / capture / handoff / failure / cleanup 主语。 |
| 旧 README 的 Docker/gVisor、local_process、SandboxService、目录结构和旧性能数字 | 会让后端产品、trait 名、测试后端和目录反向决定业务组成部分。 | 本步只保留抽象 `BackendCapabilitySummary`、`IsolationEnvironmentHandle` 和 backend / port 边界;产品选择后移。 |
| retry / replay / kill / cleanup 旧运维主线 | 旧文档容易把 replay 写成业务重放或 runtime recover,把 cleanup 写成运维脚本。 | 本步归入 `Failure control and safety closure`,并明确不推进 runtime recover、不做业务 replay、不先删证据。 |
| 输出 / audit 旧混写 | 旧材料把 stdout/stderr、output files、resource usage、audit trail、artifact 和 observability 混在一起。 | 本步拆为 `CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`、`SandboxAuditTrace`。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 主要组成部分 | 旧五段执行隔离叙事,偏会话 / 命令 / 输出 / 控制。 | 六个业务组成部分,闭合受理 identity、边界、policy、capture handoff、failure cleanup redline、local derived support。 |
| 对象候选来源 | 旧对象词和 README 目录线索。 | 从 Step 4 代码主体、Step 3 约束、正式 `00/01` 功能 / 数据 / 交互推导。 |
| 非职责边界 | 旧文档有提醒,但 tools / runtime / member / artifact / observability / policy 边界不够硬。 | 每个组成部分明确不承担的相邻仓 truth、后端产品 truth 和详细设计内容。 |
| 后续可落码性 | 旧文档要么太解释型,要么提前进入对象和流程。 | Step 5 形成 Step 6 对象候选池、Step 7 接口归属、Step 8 flow 入口和 Step 9 状态主语来源。 |
| 非 happy path | 容易被写成运维控制和 retry / replay。 | 作为 `Failure control and safety closure` 一等组成部分,对象候选覆盖 failure / control / lease / orphan / cleanup / redline。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧五段主线 | 迁移成本低,和旧 `02` 相似。 | 旧主线混入 command-provider、retry / replay 和旧对象词,不能覆盖新版 redline / handoff / data ownership。 | 不采用。 |
| 方案 B: 直接沿用 Step 4 六个候选为正式组成部分 | 与 Step 4 一致,便于后续引用。 | 需要逐项补 capability、非职责、接缝和对象候选,否则只是摘要。 | 采用并深化。 |
| 方案 C: 按 C-SBX-1~5 五个能力拆分 | 和需求追溯最直观。 | local reference / projection / derived support 会被挤压到外围,但它是读取、对账和派生维护的必要支撑。 | 不采用为最终拆分,但每个组成部分回指 C-SBX。 |
| 方案 D: 按实现分层拆分 | 实现层清晰。 | 违反 Step 5 要求,会把 Inbound / Application / Domain / Ports 误当业务组成部分。 | 不采用。 |
| 方案 E: 把 backend capability 单独作为组成部分 | 突出隔离后端复杂度。 | 后端 capability 只是边界建立的支撑接缝,单列会让后端反向定义业务边界。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Controlled execution intake and identity` | 形成正式受控执行入口、受理 / 拒绝归责、执行环境身份和责任链绑定。 | `Sandbox Sync Entry`;`ControlledExecutionIntakeService`;`ExecutionEnvironmentService`;`ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ContextReferenceResolverPorts` | 不拥有调用方业务 truth、ToolInvocation、ExecutionInstance、SandboxBinding、RunnerRun、identity / work 正文或第二套入口语义。 |
| `Boundary establishment and enforcement` | 建立正式隔离环境,裁定并施加 resource / filesystem / network / process / workspace / mount coherent boundary。 | `BoundaryEstablishmentService`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`BackendCapabilityPort`;`IsolationBackendPort` | 不拥有 backend 产品生命周期、host / cluster truth、弱测试路径、具体 profile 或后端配置。 |
| `Policy execution decision` | 承接给定 launch / isolation policy 和 authorization 摘要,形成策略内继续 / 拒绝 / 阻断 / pending / fail-closed 裁定。 | `PolicyExecutionService`;`PolicyExecutionDecision`;`PolicySummaryPort`;`ContextReferenceResolverPorts` | 不拥有 policy definition、approval、allowlist、capability、policy DSL 或工具策略 truth。 |
| `Execution capture and material handoff` | 承接受控执行、捕获 output / candidate material / observability material,并显式交接下游但不迁移 ownership。 | `ControlledExecutionCarrierService`;`CaptureHandoffService`;`CaptureFact`;`HandoffFact`;`MaterialHandoffPorts`;`ObservabilityMaterialPort`;`EventRelayPort` | 不拥有 tools 语义执行、runtime agent loop、Artifact / baseline / evidence truth、runtime result、runner UI state 或 observability store。 |
| `Failure control and safety closure` | 对 failure、control、lease、orphan、cleanup guard、reaper、redline containment 和 investigation handoff 做保守收束。 | `Sandbox Async Control Intake`;`Sandbox Operations Jobs`;`FailureControlService`;`CleanupReaperService`;`RedlineContainmentService`;`FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment`;`InvestigationHandoffPort` | 不推进 runtime recover、不执行业务 replay、不拥有 artifact retention、investigation lifecycle、operator UI 或后端运维脚本 truth。 |
| `Local reference, projection and derived support` | 维护 refs、safe summary、snapshot、read projection、inspect / preview / trend、backend comparison 和派生维护状态。 | `SandboxReadService`;`SandboxDerivedMaintenanceService`;`SandboxProjectionReadModels`;`DerivedInspectPreviewTrendReadModels`;`ContextReferenceResolverPorts`;`BackendCapabilityPort`;`EventRelayPort` | 不写核心 truth、不让查询 / 派生 / trend 反写、不保存外部正文、不成为核心通过前提。 |

### 9.2 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Controlled execution intake and identity` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution` | `ControlledExecutionIntakeGuard` | `SandboxExecutionStatusView` | identity / work / runner / tool / runtime refs;`ContextReferenceResolution` | `SandboxAuditTrace` | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`ControlledExecutionIntakeGuard`;`SandboxExecutionStatusView`;`ContextReferenceResolution`;`SandboxAuditTrace` |
| `Boundary establishment and enforcement` | `CoherentBoundary`;`BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`IsolationEnvironmentHandle` | `BoundaryCoherenceGuard`;`BackendCapabilityGuard` | `BoundaryStatusView`;backend comparison summary | `BackendCapabilitySummary`;backend / workspace refs;`IsolationBackendContractRef` | boundary establishment trace | `CoherentBoundary`;`BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`IsolationEnvironmentHandle`;`BoundaryCoherenceGuard`;`BackendCapabilitySummary`;`BackendCapabilityGuard`;`BoundaryStatusView` |
| `Policy execution decision` | `PolicyExecutionDecision`;`HighRiskActionDecision` | `PolicyApplicabilityGuard`;`FailClosedPolicyGuard` | `PolicyDecisionSummaryView` | `PolicyApplicabilitySnapshot`;policy / approval / capability refs | policy decision trace | `PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicyApplicabilitySnapshot`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard`;`PolicyDecisionSummaryView` |
| `Execution capture and material handoff` | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact` | `CaptureCompletenessGuard`;`HandoffOwnershipGuard` | `CaptureSummaryView`;`MaterialHandoffStatusView` | artifact / runtime / runner / observability handoff refs;material source refs | `SandboxEventRelayRecord`;handoff trace | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact`;`CaptureCompletenessGuard`;`HandoffOwnershipGuard`;`CaptureSummaryView`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord` |
| `Failure control and safety closure` | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | `ControlConflictGuard`;`CleanupSafetyGuard`;`RedlineContainmentGuard` | `FailureControlStatusView`;`CleanupReadinessView`;`RedlineContainmentView` | investigation refs;handoff status refs;backend lifecycle refs | failure / control / cleanup / redline trace | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment`;`ControlConflictGuard`;`CleanupSafetyGuard`;`RedlineContainmentGuard`;`FailureControlStatusView`;`CleanupReadinessView`;`RedlineContainmentView` |
| `Local reference, projection and derived support` | `ReferenceResolutionState`;`DerivedInspectPreviewTrendState` | `DerivedReadOnlyGuard`;`ExternalBodyExclusionGuard` | `SandboxReadProjection`;`DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport` | external refs;safe summaries;snapshot refs;projection source refs | derived refresh / reconciliation trace | `ReferenceResolutionState`;`DerivedInspectPreviewTrendState`;`DerivedReadOnlyGuard`;`ExternalBodyExclusionGuard`;`SandboxReadProjection`;`DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport` |

### 9.3 各部分交互总图

#### 各部分交互总图

```text
┌──────────────────────────────────────────────────────────────┐
│ Controlled execution intake and identity                     │
│ context refs / responsibility / execution environment id     │
└───────────────────────────┬──────────────────────────────────┘
                            |
                            ▼
┌───────────────────────────┴──────────────────────────────────┐
│ Boundary establishment and enforcement                       │
│ coherent boundary / backend capability / isolation handle    │
└───────────────────────────┬──────────────────────────────────┘
                            |
                            ▼
┌───────────────────────────┴──────────────────────────────────┐
│ Policy execution decision                                    │
│ given policy / high-risk action / fail-closed decision       │
└───────────────────────────┬──────────────────────────────────┘
                            |
                            ▼
┌───────────────────────────┴──────────────────────────────────┐
│ Execution capture and material handoff                       │
│ controlled run / capture fact / handoff fact                 │
└───────────────────────────┬──────────────────────┬───────────┘
                            |                      |
                            ▼                      ▼
┌──────────────────────────────────────┐   ┌──────────────────┐
│ Failure control and safety closure   │   │ Local reference, │
│ failure / control / cleanup / redline│   │ projection and   │
└───────────────────────────┬──────────┘   │ derived support  │
                            │              └───────┬──────────┘
                            │                      │
                            └──────────read / refs / derived───
```

关键说明：
- 图表达主要组成部分之间的大体流向和关键交接点,不表达协议字段、函数调用链、详细时序、数据库表或部署拓扑。
- 受理 identity、boundary、policy 和 capture / handoff 形成主路径;failure / cleanup / redline 横切主路径并可阻断或保守收束。
- local reference / projection / derived support 只提供 refs、read surface、派生解释和对账,不得反写主路径 truth。
- handoff、cleanup guard 和 redline containment 是关键交接点,但下游 formal truth、investigation lifecycle 和 observability store 不归 sandbox。

---

## 10. 各主要组成部分

### 10.1 Controlled execution intake and identity

#### 10.1.1 本部分职责

承接受控执行请求,在真实执行开始前收束调用方来源、identity / work / runner / tool / runtime refs、责任链摘要、trace 语境和最小拒绝前提,形成 sandbox 内部可追溯的 execution environment identity。该部分是 sandbox truth 的正式入口,后续 boundary、policy、capture、failure 和 cleanup 都必须回到同一执行语境。

#### 10.1.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 受控执行请求语境接入 | 调用方受控执行意图、request refs、actor / work / runner / tool / runtime refs | `ControlledExecutionContext` 或拒绝 / pending 结果 | 建立正式受理 / 拒绝归责入口 | Step 6 / Step 7 / Step 8 / Step 9 |
| execution environment identity 建立 | 已收束 context、责任链摘要、trace 语境 | `ExecutionEnvironmentIdentity` | 后续 boundary / policy / capture / failure 统一回指 | Step 6 / Step 8 / Step 9 |
| 跨调用方入口语义归并 | tools、runtime、member-service、runner 等来源摘要 | 统一受理语义和调用方来源回指 | 防止第二套正式入口 | Step 7 / Step 8 |
| 上下文引用解析与最小拒绝前提判断 | identity / work / runner / tool / runtime refs、safe summary | `ExecutionContextResolution` | refs 缺失 / 冲突时 rejected / pending / unresolved | Step 6 / Step 10 |
| 受理 / 归责 / 当前状态读取 | execution identity、query context | `SandboxExecutionStatusView` | 只读状态读取,不改变 truth | Step 7 / Step 9 |

#### 10.1.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Sandbox Sync Entry` | inbound | 承接受控执行请求、状态读取和控制意图受理入口 | Step 7 / Step 8 |
| `ControlledExecutionIntakeService` | application service | 编排受理、拒绝、重复请求和调用方来源归并 | Step 7 / Step 8 |
| `ExecutionEnvironmentService` | application service | 编排执行环境身份建立、责任链绑定和回指 | Step 7 / Step 8 |
| `ControlledExecutionContext` | domain object | 承载受控执行正式语境 | Step 6 |
| `ExecutionEnvironmentIdentity` | domain object | 承载 sandbox 内部执行环境身份 | Step 6 |
| `ContextReferenceResolverPorts` | port family | 解析 identity / work / runner / tool / runtime refs 与 safe summary | Step 7 / 详细设计 |

#### 10.1.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ControlledExecutionContext` | Step 6 独立成节 |
| Truth / State | `ExecutionEnvironmentIdentity` | Step 6 独立成节 |
| Truth / State | `ExecutionContextResolution` | Step 6 独立成节 |
| Policy / Invariant | `ControlledExecutionIntakeGuard` | Step 6 独立成节 |
| Projection / Read model | `SandboxExecutionStatusView` | Step 6 独立成节 |
| Reference / Boundary | `ContextReferenceResolution` | Step 6 独立成节 |
| Audit / History | `SandboxAuditTrace` | Step 6 独立成节 |

#### 10.1.5 本部分不承担什么

不拥有 ToolInvocation、ExecutionInstance、SandboxBinding、RunnerRun、GlobalMember、Project、WorkItem 或调用方业务 truth;不解释工具语义、不推进 runtime step、不创建 member host lifecycle、不复制 identity / work 正文;不把匿名执行、宿主直跑或 test-only 承载写成正式受控执行。

#### 10.1.6 与其他部分的接缝

向 `Boundary establishment and enforcement` 提供正式受理语境和 execution identity;向 `Policy execution decision` 提供 policy 判断所需的责任语境;向 `Execution capture and material handoff`、`Failure control and safety closure` 和 `Local reference, projection and derived support` 提供统一回指。

#### 10.1.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 C-SBX-1 和 FR-SBX-001~003。 |
| 候选对象是否有功能来源 | pass | context、identity、resolution、status view 均来自受理 / 归责 capability。 |
| 接缝是否清楚 | pass | 下接 boundary、policy、capture、failure 和 read surface。 |
| 禁止事项是否清楚 | pass | 已排除 tools / runtime / member / identity / work / runner truth。 |
| 是否越界 | pass | 未写字段、函数、schema、目录或完整接口。 |

### 10.2 Boundary establishment and enforcement

#### 10.2.1 本部分职责

在已有 execution context 和 identity 前提下,建立正式隔离环境,把 resource、filesystem、network、process、workspace 和 mount 限制作为一组 coherent boundary 裁定、施加和验证。任何必需边界不可落实、不可验证或后端不支持时,该部分必须形成拒绝、等待或保守失败语义。

#### 10.2.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 隔离边界需求合成 | accepted execution context、matching identity、显式 resource / filesystem / network / process / workspace requirements、同代 validated profile / template / runtime generation | `BoundaryRequirementSet` | 明确必须整体成立的边界集合;不得读取后序 policy | Step 6 / Step 8 |
| backend capability 可落实性校验 | boundary requirements、backend capability summary | `BoundaryEstablishmentDecision` | 不支持 / stale / 缺失时 rejected / pending / failed | Step 6 / Step 10 |
| 正式隔离环境建立 | execution identity、boundary decision、isolation backend contract | `IsolationEnvironmentHandle` | 形成正式环境建立事实或建立失败 | Step 6 / Step 8 / Step 9 |
| coherent boundary 裁定与施加 | resource / filesystem / network / process / workspace / mount 限制 | `CoherentBoundary` | 有效边界限制事实成立 | Step 6 / Step 9 |
| 边界状态读取与比较 | boundary identity、backend summary | `BoundaryStatusView` | 只读状态 / 比较输出,不反写 truth | Step 6 / Step 7 |

#### 10.2.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `BoundaryEstablishmentService` | application service | 编排边界需求合成、能力校验、建立和拒绝 | Step 7 / Step 8 |
| `CoherentBoundary` | domain object | 表达一组共同成立的隔离边界 | Step 6 |
| `BoundaryEstablishmentDecision` | domain object | 表达边界建立成功、拒绝、等待或失败 | Step 6 |
| `BackendCapabilityPort` | port | 读取后端能力摘要和限制可落实性线索 | Step 7 / 详细设计 |
| `IsolationBackendPort` | port | 承接真实隔离环境创建、限制施加和 lifecycle 控制能力 | Step 7 / 详细设计 |

#### 10.2.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CoherentBoundary` | Step 6 独立成节 |
| Truth / State | `BoundaryRequirementSet` | Step 6 独立成节 |
| Truth / State | `BoundaryEstablishmentDecision` | Step 6 独立成节 |
| Truth / State | `IsolationEnvironmentHandle` | Step 6 独立成节 |
| Policy / Invariant | `BoundaryCoherenceGuard` | Step 6 独立成节 |
| Policy / Invariant | `BackendCapabilityGuard` | Step 6 独立成节 |
| Projection / Read model | `BoundaryStatusView` | Step 6 独立成节 |
| Reference / Boundary | `BackendCapabilitySummary` | Step 6 独立成节 |
| Reference / Boundary | `IsolationBackendContractRef` | Step 6 候选池筛选,默认可并入 port 边界说明 |

#### 10.2.5 本部分不承担什么

不拥有 Docker/gVisor/Firecracker/k8s/local_process 的产品生命周期、host / cluster / workspace 正文、seccomp / AppArmor / cap-drop profile 清单、部署拓扑或后端配置 key;不允许弱测试路径、host-run、fallback 或 silent degrade 成为正式 sandbox 成功。

#### 10.2.6 与其他部分的接缝

接收 `Controlled execution intake and identity` 提供的 execution identity 和语境;接收 `Policy execution decision` 或给定 policy summary 中的限制语境;向 `Execution capture and material handoff` 提供已建立的 isolation handle 和 coherent boundary;向 `Failure control and safety closure` 输出 backend failure、resource exceeded、orphan 和 cleanup 相关事实。

#### 10.2.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 C-SBX-2 和 FR-SBX-004~006。 |
| 候选对象是否有功能来源 | pass | boundary、requirement、decision、handle、capability summary 均来自边界建立 capability。 |
| 接缝是否清楚 | pass | 上接 context / policy,下接 capture / failure / derived read。 |
| 禁止事项是否清楚 | pass | 已排除后端产品、profile、host lifecycle 和 fallback 成功。 |
| 是否越界 | pass | 未锁定后端组合、配置、profile、schema 或实现 API。 |

### 10.3 Policy execution decision

#### 10.3.1 本部分职责

在正式 execution context 和 coherent boundary 基础上,消费外部给定的 launch / isolation policy、authorization、approval 或 capability 摘要,形成 sandbox 自己拥有的 policy execution decision。该部分只回答本次受控执行是否可继续、必须拒绝、必须阻断、需要等待或需要 fail-closed,不反向生成任何 policy source truth。

#### 10.3.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| policy 语境承接 | execution context、policy / authorization / approval / capability refs、safe summary | `PolicyApplicabilitySnapshot` | policy 来源只作为摘要和 refs 进入 | Step 6 / Step 7 |
| 策略内执行裁定 | policy snapshot、boundary requirements、high-risk action context | `PolicyExecutionDecision` | accepted / rejected / blocked / pending / unsupported | Step 6 / Step 8 / Step 9 |
| 高风险动作阻断 | filesystem / network / process / resource action summary | `HighRiskActionDecision` | 越权、未授权或不支持时阻断 | Step 6 / Step 10 |
| policy 缺失 / 冲突 / 不支持 fail-closed | missing / stale / conflict / unsupported policy inputs | fail-closed decision | 不 permissive fallback | Step 6 / Step 9 / Step 10 |
| 跨调用方统一策略口径 | tools / runtime / member / runner policy context | same decision semantics | 防止不同调用方形成第二套 policy 语义 | Step 7 / Step 8 |

#### 10.3.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `PolicyExecutionService` | application service | 编排 policy snapshot 承接、裁定、拒绝和高风险动作阻断 | Step 7 / Step 8 |
| `PolicyExecutionDecision` | domain object | 承载 sandbox 对给定 policy 的执行裁定 fact | Step 6 |
| `PolicySummaryPort` | port | 读取外部 policy / authorization / approval / capability 摘要 | Step 7 / 详细设计 |
| `ContextReferenceResolverPorts` | port family | 解析 policy source refs 和适用性摘要来源 | Step 7 / 详细设计 |

#### 10.3.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `PolicyExecutionDecision` | Step 6 独立成节 |
| Truth / State | `HighRiskActionDecision` | Step 6 独立成节 |
| Policy / Invariant | `PolicyApplicabilityGuard` | Step 6 独立成节 |
| Policy / Invariant | `FailClosedPolicyGuard` | Step 6 独立成节 |
| Projection / Read model | `PolicyDecisionSummaryView` | Step 6 独立成节 |
| Reference / Boundary | `PolicyApplicabilitySnapshot` | Step 6 独立成节 |
| Audit / History | policy decision trace | Step 6 候选池筛选,可并入 `SandboxAuditTrace` |

#### 10.3.5 本部分不承担什么

不拥有 policy definition、approval workflow、allowlist truth、capability truth、policy DSL、ToolPolicy 正文、governance decision truth 或 capability registry;不在 policy 缺失、冲突、过期、不支持或授权不明时继续执行;不把 backend capability 不足转写成 policy 允许。

#### 10.3.6 与其他部分的接缝

接收 `Controlled execution intake and identity` 的责任语境和 `Boundary establishment and enforcement` 的边界需求 / 能力判断;向 `Execution capture and material handoff` 提供是否允许受控执行继续的裁定;向 `Failure control and safety closure` 输出 deny、blocked、policy conflict 和 fail-closed 的失败 / control 线索。

#### 10.3.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 C-SBX-3 和 FR-SBX-007~010。 |
| 候选对象是否有功能来源 | pass | decision、snapshot、guard、high-risk action 均来自 policy capability。 |
| 接缝是否清楚 | pass | 上接 context / boundary,下接 capture / failure。 |
| 禁止事项是否清楚 | pass | 已排除 policy source truth、approval truth、allowlist truth 和 permissive fallback。 |
| 是否越界 | pass | 未写 policy DSL、policy source matrix、allowlist 粒度或完整错误码。 |

### 10.4 Execution capture and material handoff

#### 10.4.1 本部分职责

在 execution context、coherent boundary 和 policy execution decision 均成立后,承接受控执行运行、输出捕获、候选材料收口、observability material 形成和显式 handoff。该部分形成 sandbox 自己拥有的 capture fact 和 handoff fact,但不宣布下游 formal artifact truth、runtime result、runner UI state 或 observability store truth。

#### 10.4.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 受控执行承接 | execution identity、isolation handle、policy decision、launch summary | `ControlledExecutionRun` | 真实执行进入已成立 sandbox 边界 | Step 6 / Step 8 / Step 9 |
| 执行输出 capture | stdout / stderr / output refs / completion context | `CaptureFact` | capture success / partial / failed | Step 6 / Step 8 / Step 9 |
| 候选材料安全收口 | output files、candidate material、source context | `CapturedMaterialRef` | material 与 formal artifact truth 分层 | Step 6 / Step 8 |
| observability material 形成 | usage、audit、trace、metric、failure context | `ObservabilityMaterial` | 可交接观测材料,不拥有 store truth | Step 6 / Step 7 |
| material / observability / event handoff | capture fact、material refs、downstream target refs | `HandoffFact`;handoff pending / failed / retryable | 下游未确认不迁移 ownership | Step 6 / Step 7 / Step 8 / Step 9 |
| capture / handoff 读取 | execution identity、handoff refs | `CaptureSummaryView`;`MaterialHandoffStatusView` | 只读读取,不宣布下游 truth | Step 6 / Step 7 |

#### 10.4.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ControlledExecutionCarrierService` | application service | 在已成立边界和 policy 下承接真实执行生命周期 | Step 7 / Step 8 |
| `CaptureHandoffService` | application service | 编排 capture、material 收口、handoff 和失败落点 | Step 7 / Step 8 |
| `CaptureFact` | domain object | 承载输出 / 材料捕获事实 | Step 6 |
| `HandoffFact` | domain object | 承载下游材料 / 观测 / 事件交接事实 | Step 6 |
| `MaterialHandoffPorts` | handoff port family | 将 captured output / candidate material 显式交接给 artifact、runtime、runner 等下游 | Step 7 / 详细设计 |
| `ObservabilityMaterialPort` | handoff port | 交接 audit / trace / metric / usage / failure material | Step 7 / 详细设计 |
| `EventRelayPort` | relay port | 传播已成立 sandbox fact 和 handoff 状态 | Step 7 / 详细设计 |

#### 10.4.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ControlledExecutionRun` | Step 6 独立成节 |
| Truth / State | `CaptureFact` | Step 6 独立成节 |
| Truth / State | `CapturedMaterialRef` | Step 6 独立成节 |
| Truth / State | `ObservabilityMaterial` | Step 6 独立成节 |
| Truth / State | `HandoffFact` | Step 6 独立成节 |
| Policy / Invariant | `CaptureCompletenessGuard` | Step 6 独立成节 |
| Policy / Invariant | `HandoffOwnershipGuard` | Step 6 独立成节 |
| Projection / Read model | `CaptureSummaryView` | Step 6 独立成节 |
| Projection / Read model | `MaterialHandoffStatusView` | Step 6 独立成节 |
| Reference / Boundary | artifact / runtime / runner / observability handoff refs | Step 6 候选池筛选,默认并入 `HandoffFact` 或 `CapturedMaterialRef` |
| Audit / History | `SandboxEventRelayRecord` | Step 6 独立成节 |

#### 10.4.5 本部分不承担什么

不解释工具语义、不推进 runtime agent loop、不拥有 Artifact 正文、baseline、formal evidence、runtime result、runner UI state、observability store、bus truth 或下游 ack 协议全集;不把 candidate material 静默升级为下游正式 truth;不在 capture 失败时伪造完整 capture。

#### 10.4.6 与其他部分的接缝

接收 `Boundary establishment and enforcement` 的 isolation handle 和 `Policy execution decision` 的继续 / 阻断裁定;向 `Failure control and safety closure` 输出 capture failure、handoff failed、resource exceeded 等非 happy path;向 `Local reference, projection and derived support` 输出可读 capture / handoff summary。

#### 10.4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 C-SBX-4 和 FR-SBX-011~014。 |
| 候选对象是否有功能来源 | pass | run、capture、material、observability、handoff 均来自 capture / handoff capability。 |
| 接缝是否清楚 | pass | 上接 boundary / policy,下接 failure / derived / downstream handoff。 |
| 禁止事项是否清楚 | pass | 已排除 artifact truth、runtime result、observability store、tools semantic execution。 |
| 是否越界 | pass | 未写 handoff ack 协议、event payload、存储、outbox schema 或 capture 细节。 |

### 10.5 Failure control and safety closure

#### 10.5.1 本部分职责

把非 happy path 作为 sandbox 核心闭环的一部分,承接 timeout、deny、kill、cancel、backend failure、capture failure、handoff failure、resource exceeded、lease expiry、orphan environment、cleanup guard、reaper、redline containment 和 investigation handoff。该部分保护证据链、宿主边界和安全红线,不把失败交给调用方、runtime recover 或运维脚本私自兜底。

#### 10.5.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 稳定失败分类 | backend failure、timeout、deny、capture failure、handoff failure、resource exceeded | `FailureClassification` | 失败归类可追溯,不得写成 completed success | Step 6 / Step 8 / Step 9 |
| control fact 收束 | kill、cancel、cleanup、replay-like investigation request、duplicate / conflict signal | `ControlFact` | 同一 control 信号只有一种正式含义 | Step 6 / Step 8 / Step 9 |
| lease / orphan 收束 | lease state、backend lifecycle summary、execution identity | `LeaseRecord`;`OrphanRecoveryRecord` | 发现孤儿环境并保守回收 | Step 6 / Step 8 / Step 9 |
| cleanup guard | capture / audit / investigation / handoff state | `CleanupGuard` | 材料未安全交接或调查未放行时阻断 cleanup | Step 6 / Step 8 / Step 10 |
| reaper 后台维护 | lease / orphan / cleanup decision | reaper closure fact | 不托管外运行,不先删证据 | Step 7 / Step 8 |
| redline containment | escape-like、越权访问、安全红线 signal | `RedlineContainment` | containment、留痕、调查交接和保守收束 | Step 6 / Step 8 / Step 9 / Step 10 |
| 安全调查交接 | redline、failure、material refs、investigation refs | investigation handoff fact | 不拥有 investigation lifecycle | Step 7 / Step 8 |

#### 10.5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Sandbox Async Control Intake` | inbound / async intake | 消费 control signal、handoff 状态、安全交接和调查状态 | Step 7 / Step 8 |
| `Sandbox Operations Jobs` | operations | 承接 lease 巡检、orphan detection、cleanup / reaper 和 redline 后续维护 | Step 7 / Step 8 |
| `FailureControlService` | application service | 编排失败分类、control fact 和冲突收束 | Step 7 / Step 8 |
| `CleanupReaperService` | application service | 编排 cleanup guard、lease / orphan 和 reaper closure | Step 7 / Step 8 |
| `RedlineContainmentService` | application service | 编排 redline containment、材料留痕和 investigation handoff | Step 7 / Step 8 |
| `FailureClassification` | domain object | 承载稳定失败分类事实 | Step 6 |
| `ControlFact` | domain object | 承载 kill / cancel / cleanup / replay-like control 的正式事实 | Step 6 |
| `LeaseRecord` | domain object | 承载 lease 状态和过期判断主语 | Step 6 |
| `OrphanRecoveryRecord` | domain object | 承载孤儿环境发现和保守回收主语 | Step 6 |
| `CleanupGuard` | domain object / guard | 判断 cleanup 是否可放行、阻断或 pending | Step 6 |
| `RedlineContainment` | domain object | 承载安全红线 containment 和调查交接状态 | Step 6 |
| `InvestigationHandoffPort` | handoff port | 交接安全调查所需材料和 refs | Step 7 / 详细设计 |

#### 10.5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `FailureClassification` | Step 6 独立成节 |
| Truth / State | `ControlFact` | Step 6 独立成节 |
| Truth / State | `LeaseRecord` | Step 6 独立成节 |
| Truth / State | `OrphanRecoveryRecord` | Step 6 独立成节 |
| Truth / State | `CleanupGuard` | Step 6 独立成节 |
| Truth / State | `RedlineContainment` | Step 6 独立成节 |
| Policy / Invariant | `ControlConflictGuard` | Step 6 独立成节 |
| Policy / Invariant | `CleanupSafetyGuard` | Step 6 独立成节 |
| Policy / Invariant | `RedlineContainmentGuard` | Step 6 独立成节 |
| Projection / Read model | `FailureControlStatusView` | Step 6 独立成节 |
| Projection / Read model | `CleanupReadinessView` | Step 6 独立成节 |
| Projection / Read model | `RedlineContainmentView` | Step 6 独立成节 |
| Reference / Boundary | investigation refs;handoff status refs;backend lifecycle refs | Step 6 候选池筛选,默认并入 guard / containment 对象说明 |
| Audit / History | failure / control / cleanup / redline trace | Step 6 候选池筛选,可并入 `SandboxAuditTrace` |

#### 10.5.5 本部分不承担什么

不推进 runtime recover、不执行业务 replay、不拥有 artifact retention、investigation case lifecycle、operator UI、observability store、后端运维平台或 SRE 私有脚本 truth;不允许 cleanup / reaper 在材料未安全交接、调查未放行或 redline 未收束时先删证据;不把 kill / replay-like control 写成业务重放。

#### 10.5.6 与其他部分的接缝

横切接收 `Controlled execution intake and identity`、`Boundary establishment and enforcement`、`Policy execution decision`、`Execution capture and material handoff` 的失败、拒绝、control 和安全信号;向 `Local reference, projection and derived support` 输出 failure / cleanup / redline read surface;通过 `InvestigationHandoffPort` 与外部安全调查边界协作。

#### 10.5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 C-SBX-5 和 FR-SBX-015~018。 |
| 候选对象是否有功能来源 | pass | failure、control、lease、orphan、cleanup、redline 均来自非 happy path capability。 |
| 接缝是否清楚 | pass | 横切所有核心组成部分,但不反向拥有业务 / runtime / artifact truth。 |
| 禁止事项是否清楚 | pass | 已排除 runtime recover、business replay、artifact retention、investigation lifecycle 和 cleanup 先删证据。 |
| 是否越界 | pass | 未写完整 failure taxonomy、状态矩阵、reaper 部署或调查协议。 |

### 10.6 Local reference, projection and derived support

#### 10.6.1 本部分职责

维护 `L4-sandbox` 所需的外部 refs、safe summary、snapshot、projection、read surface、inspect / preview / trend、backend capability comparison 和对账材料。该部分让读取、排障、容量解释、下游协作和后续对象 / flow / 状态设计有稳定辅助主语,但只能只读派生,不得新建或覆盖 execution isolation truth。

#### 10.6.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 外部引用解析状态维护 | identity / work / runner / tool / runtime / policy / artifact / observability / investigation refs | `ReferenceResolutionState` | stale / unresolved / pending / invalid 可见 | Step 6 / Step 7 / Step 9 |
| sandbox 读取投影 | core truth、handoff state、failure state | `SandboxReadProjection` | query 只读,不改变 truth | Step 6 / Step 7 |
| backend capability / workspace 摘要刷新 | backend source refs、workspace source refs | capability / workspace summary view | 供 boundary 判断读取,不替代 boundary decision | Step 7 / Step 8 |
| inspect / preview / trend 派生维护 | capture / handoff / failure / usage material | `DerivedInspectPreviewTrendView` | failed / rebuilding / stale 可见 | Step 6 / Step 9 |
| backend comparison / capacity trend | backend summary、usage material、boundary outcomes | `BackendCapabilityComparisonView` | 只读比较,不定义正式后端选择 | Step 6 / Step 11 |
| 派生对账与重建 | core truth、projection state、event / material refs | `SandboxReconciliationReport` | 对账结果不反写核心 | Step 6 / Step 8 |

#### 10.6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `SandboxReadService` | application service | 提供状态、capture、handoff、failure、cleanup、redline 的授权读取面 | Step 7 / Step 8 |
| `SandboxDerivedMaintenanceService` | application service | 编排 projection rebuild、summary refresh、inspect / preview / trend 维护 | Step 7 / Step 8 |
| `SandboxProjectionReadModels` | projection / read model family | 承载 sandbox status、boundary、policy、capture、handoff、failure、cleanup 只读视图 | Step 6 / Step 7 |
| `DerivedInspectPreviewTrendReadModels` | projection / derived model family | 承载 inspect、preview、trend、backend comparison、reconciliation 派生材料 | Step 6 / Step 7 |
| `ContextReferenceResolverPorts` | port family | 解析外部 refs / safe summary / snapshot | Step 7 / 详细设计 |
| `BackendCapabilityPort` | port | 刷新 backend capability summary 和 comparison 输入 | Step 7 / 详细设计 |
| `EventRelayPort` | relay port | 消费已成立变化以维护 projection 或对账材料 | Step 7 / 详细设计 |

#### 10.6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceResolutionState` | Step 6 独立成节 |
| Truth / State | `DerivedInspectPreviewTrendState` | Step 6 独立成节 |
| Policy / Invariant | `DerivedReadOnlyGuard` | Step 6 独立成节 |
| Policy / Invariant | `ExternalBodyExclusionGuard` | Step 6 独立成节 |
| Projection / Read model | `SandboxReadProjection` | Step 6 独立成节 |
| Projection / Read model | `DerivedInspectPreviewTrendView` | Step 6 独立成节 |
| Projection / Read model | `BackendCapabilityComparisonView` | Step 6 独立成节 |
| Projection / Read model | `SandboxReconciliationReport` | Step 6 独立成节 |
| Reference / Boundary | external refs;safe summaries;snapshot refs;projection source refs | Step 6 候选池筛选,默认并入 `ReferenceResolutionState` |
| Audit / History | derived refresh / reconciliation trace | Step 6 候选池筛选,可并入 `SandboxAuditTrace` |

#### 10.6.5 本部分不承担什么

不新建、覆盖或修正 execution isolation truth;不让 query、inspect、preview、trend、backend comparison、operator read surface 或 dashboard 反写核心;不保存 identity / work / tool / runtime / policy / artifact / observability / investigation 正文;不让派生失败阻断已成立核心 truth,也不让派生成功成为核心通过前提。

#### 10.6.6 与其他部分的接缝

从所有核心组成部分读取已成立 truth、material 和状态;为 `Boundary establishment and enforcement` 提供 backend capability summary refresh 支撑,但不替代 boundary decision;为 `Execution capture and material handoff`、`Failure control and safety closure` 提供 read projection 和派生解释面;通过 `EventRelayPort` 消费已成立变化维护派生。

#### 10.6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 承接 Step 3 查询 / 外围增强只读约束和 FR-SBX-E02~E06 的非核心口径。 |
| 候选对象是否有功能来源 | pass | reference state、read projection、derived state、comparison view 均来自只读派生 capability。 |
| 接缝是否清楚 | pass | 读取核心 truth 并支撑外部 refs / summary / projection,但不反写。 |
| 禁止事项是否清楚 | pass | 已排除外部正文、隐藏写源、dashboard truth 和核心通过前提。 |
| 是否越界 | pass | 未写 projection schema、dashboard、query API、backend comparison 算法或配置。 |

---

## 11. 总体边界说明

`L4-sandbox` 的主要组成部分必须共同保护一条主线:正式受理和 execution environment identity 先成立,coherent boundary 再成立,给定 policy execution decision 决定是否继续,执行和材料 capture / handoff 在已成立边界内发生,failure / cleanup / redline 对非 happy path 做保守收束,local reference / projection / derived support 只提供读取和解释辅助。

这些组成部分不能被实现分层、运行单元或后端产品替代。`Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Handoff` 只是代码安放层;Docker/gVisor/Firecracker/k8s/local_process 只是候选技术承载;tools、runtime、member-service、artifact、observability、policy sources 和 investigation 都只能通过 refs、summary、material 或 handoff 协作。

---

## 12. Step 6 展开门禁

Step 6 `关键对象轮廓` 启动时必须满足:

- 每个对象都能回指本 Step 的某个 capability 和组成部分。
- 未来可能成为 struct / enum / value object / projection / policy / guard / audit record / history record 的候选对象必须进入 Step 6 候选池筛选说明。
- API、repository、port、trigger、DTO、database table、HTTP body、event payload、backend SDK raw response 默认不得作为 Step 6 领域对象。
- Step 6 不得新增绕过本 Step 候选池的新对象主语;确需新增时必须说明来自哪个组成部分 capability 的遗漏修正。
- Step 6 必须继续保护 truth / snapshot / reference / derived / forbidden body 分层,不得把外部正文或下游 truth 写成对象字段。
- Step 6 必须保持对象字段 / 函数仍为概要骨架粒度,不得进入完整 Rust 定义、schema、DDL、repository、配置或测试。

---

## 13. 跨组成部分闭环审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| C-SBX-1 是否被承接 | pass | `Controlled execution intake and identity` 覆盖受控执行语境、identity、责任链和入口统一。 |
| C-SBX-2 是否被承接 | pass | `Boundary establishment and enforcement` 覆盖 formal isolation、resource / fs / network / process boundary 和 backend capability 可落实性。 |
| C-SBX-3 是否被承接 | pass | `Policy execution decision` 覆盖给定 policy、high-risk action、fail-closed 和跨调用方统一 policy 口径。 |
| C-SBX-4 是否被承接 | pass | `Execution capture and material handoff` 覆盖 capture fact、candidate material、observability material 和 handoff fact。 |
| C-SBX-5 是否被承接 | pass | `Failure control and safety closure` 覆盖 failure、control、lease、orphan、cleanup、reaper、redline 和 investigation handoff。 |
| 外围增强是否越界 | pass | `Local reference, projection and derived support` 只读派生,不成为核心写源或通过前提。 |
| 重复对象是否可控 | pass | shared refs / summary / trace 被归入 reference / audit 支撑,核心 truth object 各有归属。 |
| 职责是否重叠 | pass | boundary、policy、capture、failure 各自有明确输入输出,backend capability 不独立成为业务组成部分。 |
| 候选对象是否遗漏 | pass | 对象候选覆盖 truth / state、policy / invariant、projection / read model、reference / boundary、audit / history 五类维度。 |
| 接缝是否冲突 | pass | handoff、cleanup guard、redline 和 derived read surface 都明确不迁移 ownership、不反写核心。 |
| 后续展开位置是否悬空 | pass | 代码主体和候选对象均指向 Step 6 / 7 / 8 / 9 或详细设计。 |
| 是否提前进入详细设计 | pass | 未写字段、函数、schema、状态矩阵、目录、后端配置或测试。 |

---

## 14. 后续展开一致性检查结论

| 后续 Step | 必须承接本步内容 | 一致性要求 |
|---|---|---|
| Step 6 关键对象轮廓 | §9.2 对象发现维度表和 §10 各部分对象发现线索 | 对象必须回指组成部分 capability;不能隐式发明对象;字段 / 函数保持骨架。 |
| Step 7 API / 接口骨架 | §10 各部分代码主体 / 模块和接缝 | 接口按 Command / Query / Inbound Event / Outbound Event / Operations / external port 分类,不得写 schema。 |
| Step 8 关键处理流 | §9.3 交互总图和各部分 capability | flow 必须穿过受理、boundary、policy、capture / handoff、failure / cleanup / redline 或 derived support,不能把失败伪成功。 |
| Step 9 状态定义与状态流转 | §9.2 的 truth / state 候选和每部分状态影响 | 状态主语必须覆盖 accepted / rejected / pending / established / blocked / capture-failed / handoff-pending / contained 等语义族。 |
| Step 10 异常与边界场景 | §10 非职责和 §13 闭环审计 | 异常必须覆盖引用缺失、backend 不支持、policy 冲突、capture / handoff failure、cleanup 阻断、orphan、redline。 |
| Step 11 配置影响轮廓 | §11 总体边界说明 | 配置只能影响承载、profile、节奏、adapter binding 或派生维护,不得改变 truth owner 或 fail-closed。 |

---

## 15. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §5 “主要组成部分、职责与边界”可承接本文件 §9.1 组成部分总表。
- §5 必须承接本文件 §9.2 对象发现维度表,作为 Step 6 候选池来源。
- §5 必须承接本文件 §9.3 `各部分交互总图`,保持图标题、`text` 代码块和关键说明。
- §5 每个主要组成部分小节可承接本文件 §10 的职责、capability、代码主体、对象发现线索、非职责和接缝,正式正文可压缩停审记录,但不得删除非职责边界。
- §5 末尾应承接 §11 总体边界说明、§12 Step 6 展开门禁和 §14 后续一致性说明。
- 本文件 §5~§8 的 SOP 问题回答、旧材料诊断、改动前后对比和设计取舍保留在 `design-calibration`,不直接全文搬入正式正文。

---

## 16. 待确认事项

### 16.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 `Local reference, projection and derived support` 合并到其他部分 | A. 合并;B. 保持独立 | B | 派生读取和外部 refs 支撑跨越所有主线,独立后更容易防止反写核心 truth。 | 已采用 B |
| `ControlledExecutionRun` 是否作为 Step 6 独立对象 | A. 独立展开;B. 并入 `CaptureFact` | A | 它承接受控执行运行主语,但不等同 runtime ExecutionInstance;需独立说明边界。 | 待 Step 6 筛选确认 |
| `IsolationEnvironmentHandle` 是否作为 Step 6 独立对象 | A. 独立展开;B. 留给 port / 详细设计 | A | 需表达 sandbox 对正式隔离环境 handle 的 truth 边界,但不能写 backend SDK 细节。 | 待 Step 6 筛选确认 |
| audit / trace 候选是否统一为 `SandboxAuditTrace` | A. 统一;B. 每部分单独建 audit 对象 | A | 可减少重复 audit record,同时保留各部分 trace 来源。 | 待 Step 6 筛选确认 |

### 16.2 本 Step 未确认事项

本步不新增阻塞 Step 6 的上游 blocker。backend 组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、security profile、SLO、DB / object store / observability / bus 产品选择仍按 Step 3 / `01` 风险口径保留,不得在 Step 6 伪装成已确认对象字段或状态。

---

## 17. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确本仓由哪些主要组成部分构成 | pass |
| 已明确每个组成部分承担什么和不承担什么 | pass |
| 已为每个组成部分列出功能 / capability 清单 | pass |
| 已为每个组成部分列出代码主体 / 模块和后续展开位置 | pass |
| 已形成对象发现维度表 | pass |
| 已为每个组成部分列出对象发现线索 | pass |
| 已输出 `各部分交互总图` 并提供关键说明 | pass |
| 已完成每个组成部分停审记录 | pass |
| 已完成跨组成部分闭环审计表 | pass |
| 未写对象字段、成员函数、工厂函数、完整接口、处理流、状态矩阵、schema、目录、配置或测试 | pass |
| 未修改正式 `02-概要设计.md` | pass |
| 是否可以进入 Step 6 | 需要用户审查并明确确认后,才能进入 Step 6 `关键对象轮廓`。 |
