# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 把新版 `01-架构设计.md` 已收稳的核心 / 支撑子域、运行承载、依赖角色、数据边界和通信路径转译为概要层代码主体骨架;不写代码目录、完整 trait / struct、schema、数据库表、topic、配置项、测试或实施边界。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 4 | 是。用户在 Step 3 审查点后回复“同意”,允许进入 Step 4。 |
| 项目级台账是否允许进入 Step 4 | 是。`project_execution_ledger.md` 记录 Step 3 已完成并等待用户确认,用户确认后可进入 Step 4。 |
| 文档级 flow 是否允许进入 Step 4 | 是。`02_hld_calibration_flow.md` 记录 Step 4 等待 Step 3 用户确认。 |
| 是否已读取 Step 1 / Step 2 / Step 3 中间产物 | 是。Step 1 提供上游边界,Step 2 提供目标和范围,Step 3 提供后续结构门禁。 |
| 是否已读取概要 SOP Step 4 | 是。Step 4 必须产出架构模块到代码主体映射图、实现分层视图、业务主要组成部分与实现分层关系说明和关键判断。 |
| 是否已读取概要书写规范 §4.4 与 ASCII 图规则 | 是。两张图必须使用 `text` 代码块并各带 2~5 条关键说明。 |
| 是否发现阻塞 Step 4 的上游 blocker | 否。旧 README / 旧 `02` 的旧对象、旧后端和旧目录仍为 historical material;`04/07` 缺失仍为下游缺口,不阻塞当前 Step。 |

---

## 2. 本步目标

本步把 `L4-sandbox` 的架构主线从“核心 / 支撑子域、运行承载和依赖角色”转译成后续详细设计可继续展开的代码主体骨架。

本步要先稳定两条轴:

- 业务主要组成部分候选:说明本仓在概要层由哪些可评审的业务结构主语构成,为 Step 5 逐个展开职责与边界做输入。
- 实现分层:说明这些业务主语在代码中会落到 Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Handoff 等层,为 Step 6~9 的对象、接口、flow 和状态提供安放位置。

本步不把实现分层当业务模块,也不把运行承载单元、后端产品、旧对象词或源码目录提前固定成正式组成部分。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供新版 `00/01` 承接边界、旧材料隔离口径和本文必须回答的问题。 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供本轮 `02` 要收稳的代码主体、主要组成部分、对象、接口、flow、状态和深度边界。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 execution isolation truth、coherent boundary、policy fail-closed、capture / handoff、cleanup / redline、依赖裁剪和配置不可越界约束。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、FR / BR / AC / VF、数据归属、接口依赖和一票否决红线。 |
| `projects/L4-sandbox/01-架构设计.md` §6~10 | 当前正式架构基线 | 提供核心 / 支撑子域、运行承载、依赖角色、数据所有权、一致性策略和关键交互方式。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 4 | 约束问题回答、输出格式和不得进入实现细节。 |
| `standards/document/概要设计书写规范.md` | 已读取 §4.4 / §5.3.4 | 约束正式 §4 的两张图、说明表和关键判断写法。 |
| `projects/L1-artifact/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 参考双轴映射和图后关键说明的粒度。 |
| `projects/L1-governance/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 参考业务主要组成部分与实现分层区分方式。 |
| 旧 `projects/L4-sandbox/README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于识别旧 `SandboxExecution`、`SandboxService`、Docker/gVisor、旧事件、旧目录和旧指标回流风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`02` flow、Step 1~3、概要 SOP Step 4 和书写规范 §4.4。 | done | 确认当前只允许创建 Step 4 中间产物,正式 `02` 不修改。 |
| 2 | 回读 `01-架构设计.md` 中核心 / 支撑子域、运行承载、依赖方向、数据边界和通信方式。 | done | 提取可映射为代码主体骨架的稳定架构主语。 |
| 3 | 对照 L1 样例判断粒度。 | done | 采用“业务主要组成部分候选 + 实现分层”双轴映射,不写目录路径。 |
| 4 | 诊断旧 README / 旧 `02` 中旧对象、旧服务、旧后端和旧目录污染。 | done | 确认旧材料不直接进入代码主体命名。 |
| 5 | 回答 Step 4 五个 SOP 问题。 | done | 明确 Inbound、Application、Domain、Ports / Projection / Handoff 的主体。 |
| 6 | 输出映射表、两张 ASCII 图、关系说明表和关键判断。 | done | 满足正式 §4 回填输入要求。 |
| 7 | 更新 `02_hld_calibration_flow.md` 和项目台账,并停在用户审查点。 | done | 不创建 Step 5 文件,不修改正式 `02-概要设计.md`。 |

---

## 5. SOP 问题回答

### 5.1 架构层已经收稳的模块,分别应落到哪些代码主体骨架上?

当前架构层主语不能直接变成源码目录或后端产品,应先映射为代码主体骨架:

- `正式受控执行语境核心`
  - 落到 `Sandbox Sync Entry`、`ControlledExecutionIntakeService`、`ExecutionEnvironmentService`、`ControlledExecutionContext`、`ExecutionEnvironmentIdentity`。
  - 这些主体承接受理、拒绝归责、执行环境身份和责任链绑定,不拥有 identity / work / runtime / tools 正文。

- `隔离环境边界核心`
  - 落到 `BoundaryEstablishmentService`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`BackendCapabilityPort`、`IsolationBackendPort`。
  - 这些主体承接 resource / filesystem / network / process / workspace / mount 限制整体成立判断,不把 Docker / gVisor / Firecracker / k8s 或 local_process 固定为业务边界。

- `策略执行裁定核心`
  - 落到 `PolicyExecutionService`、`PolicyExecutionDecision`、`PolicySummaryPort`。
  - 这些主体只消费给定 launch / isolation policy、authorization 或 capability 摘要,形成执行裁定;不拥有 allowlist、approval、policy definition、capability 或 policy DSL truth。

- `输出捕获与材料交接核心`
  - 落到 `ControlledExecutionCarrierService`、`CaptureHandoffService`、`CaptureFact`、`HandoffFact`、`MaterialHandoffPorts`、`ObservabilityMaterialPort`。
  - 这些主体只承接真实执行承载、capture fact、candidate material、observability material 和 handoff fact,不宣布 Artifact、baseline、evidence、runtime result、runner UI state 或 observability store truth。

- `失败控制与安全收束核心`
  - 落到 `FailureControlService`、`CleanupReaperService`、`RedlineContainmentService`、`FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`。
  - 这些主体让 timeout、deny、kill、capture failure、lease expiry、orphan、cleanup guard、reaper 和 redline containment 成为核心结构,不交给调用方私有补偿。

- `调用方接入、下游协作、本地索引 / 投影 / 引用和外围增强`
  - 落到 `Sandbox Async Control Intake`、`Sandbox Operations Jobs`、`SandboxReadService`、`SandboxDerivedMaintenanceService`、`ContextReferenceResolverPorts`、`EventRelayPort`、`InvestigationHandoffPort`、`SandboxProjectionReadModels`、`DerivedInspectPreviewTrendReadModels`。
  - 这些主体承接 refs、safe summary、snapshot、handoff 状态、观测投影、inspect / preview / trend 派生材料,不得新建核心 truth。

### 5.2 哪些主体属于 Inbound / Operations,哪些属于 Application Services?

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Inbound | `Sandbox Sync Entry`;`Sandbox Async Control Intake` | 承接受控执行请求、状态读取、控制意图、handoff / 安全交接 / 调查状态输入,只把外部输入转为 application input。 |
| Operations | `Sandbox Operations Jobs` | 承接 lease 巡检、orphan detection、cleanup / reaper、redline 后续收束、backend capability 摘要刷新和派生维护触发。 |
| Application Services | `ControlledExecutionIntakeService`;`ExecutionEnvironmentService`;`BoundaryEstablishmentService`;`PolicyExecutionService`;`ControlledExecutionCarrierService`;`CaptureHandoffService`;`FailureControlService`;`CleanupReaperService`;`RedlineContainmentService`;`SandboxReadService`;`SandboxDerivedMaintenanceService` | 编排受理、identity、边界、policy、执行承载、capture、handoff、failure、cleanup、redline、读取和派生维护,但不直接替代 domain model 成为规则 owner。 |

Inbound / Operations 描述请求、事件和维护触发如何进入系统;Application Services 描述用例如何编排。二者都不是最终业务主要组成部分的全部含义。

### 5.3 哪些主体属于 Domain Model,哪些属于 Ports / Persistence / Projection / Handoff?

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Domain Model | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`PolicyExecutionDecision`;`CaptureFact`;`HandoffFact`;`FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | 表达 sandbox 内部 truth、决策、事实、状态主语和一票否决语义。 |
| Ports | `ContextReferenceResolverPorts`;`BackendCapabilityPort`;`IsolationBackendPort`;`PolicySummaryPort`;`MaterialHandoffPorts`;`ObservabilityMaterialPort`;`EventRelayPort`;`InvestigationHandoffPort` | 表达外部能力、摘要、引用、交接和基础设施边界,不得把外部仓或后端产品私有模型写成本仓依赖。 |
| Persistence | `SandboxTruthPersistencePorts` | 承接 execution isolation truth、capture / handoff、failure / control、cleanup / redline 等正式状态持久化边界;不定义数据库产品和表结构。 |
| Projection / Read Models | `SandboxProjectionReadModels`;`DerivedInspectPreviewTrendReadModels` | 承接只读状态读取、观测 / 事件协作投影、inspect、preview、trend、能力比较和对账视图;不得反写核心 truth。 |
| Handoff / Relay | `MaterialHandoffPorts`;`ObservabilityMaterialPort`;`EventRelayPort`;`InvestigationHandoffPort` | 表达材料、观测、事件和安全调查交接事实;传播失败只能影响 pending / failed / retryable / containment,不能取消已成立 truth。 |

### 5.4 哪些名称必须在概要设计层先点名,否则详细设计会重新发明主语?

本步先固定以下概要层代码主体名称,供后续 Step 5~9 和 `03-详细设计.md` 继续展开:

- Inbound / Operations: `Sandbox Sync Entry`、`Sandbox Async Control Intake`、`Sandbox Operations Jobs`。
- Application Services: `ControlledExecutionIntakeService`、`ExecutionEnvironmentService`、`BoundaryEstablishmentService`、`PolicyExecutionService`、`ControlledExecutionCarrierService`、`CaptureHandoffService`、`FailureControlService`、`CleanupReaperService`、`RedlineContainmentService`、`SandboxReadService`、`SandboxDerivedMaintenanceService`。
- Domain Model: `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`PolicyExecutionDecision`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`。
- Ports / Persistence / Projection / Handoff: `SandboxTruthPersistencePorts`、`ContextReferenceResolverPorts`、`BackendCapabilityPort`、`IsolationBackendPort`、`PolicySummaryPort`、`MaterialHandoffPorts`、`ObservabilityMaterialPort`、`EventRelayPort`、`InvestigationHandoffPort`、`SandboxProjectionReadModels`、`DerivedInspectPreviewTrendReadModels`。

这些名称是概要层骨架主语,不是完整接口签名、struct 定义、仓储方法、event schema 或目录布局。

### 5.5 哪些内容已经是代码目录、文件路径或框架实现,不应在本步展开?

本步不展开:

- crate / module / file tree、`src/`、handler、adapter、repository、job runner、DI 或框架选择。
- 完整 Rust trait / struct / enum / value object 定义。
- HTTP / RPC / SDK 方法、API path、DTO、CloudEvent、topic、outbox payload 或错误码。
- 数据库表、索引、事务、object store layout、cache、message bus 产品或 observability store 产品。
- Docker / gVisor / Firecracker / k8s / local_process 组合、seccomp / AppArmor / cap-drop profile、网络 allowlist 和部署拓扑。
- 测试矩阵、验收 evidence、run_id、commit boundary、implementation ledger 或 planned boundary skeleton。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `SandboxExecution` / `SandboxSession` / `SandboxCommand` / `SandboxPolicy` / `SandboxOutput` | 名称看似可落码,但未经新版 execution isolation truth、数据归属和 Step 5 capability 筛选,会提前固定旧对象模型。 | 不直接继承;当前改用受控执行语境、execution environment identity、coherent boundary、policy decision、capture / handoff 和 failure / cleanup / redline 主语。 |
| 旧 README 中 `SandboxService`、Docker/gVisor、旧目录和旧事件 | 会把后端产品、trait 名、目录和事件协议误写为概要代码主体。 | 全部保留为 historical material;当前只点名抽象 port、service 和 domain 主语。 |
| 直接按运行承载单元组织代码主体 | `同步入口`、`受控执行承接`、`后台维护清理` 是运行角色,若直接当业务组成部分会吞掉 truth / boundary / policy / capture 等业务主语。 | 运行角色只进入 Inbound / Operations 或 application 编排,Step 5 仍按业务主要组成部分候选展开。 |
| 直接按 `api / application / domain / infra` 写正式结构 | 技术层次清晰但业务边界丢失,详细设计仍会重问 sandbox 到底负责哪些事实。 | 当前采用业务主语候选 + 实现分层双轴,并明确二者不能混用。 |
| 把 backend capability 写成业务边界 | 后端产品能力会反向定义 sandbox truth 和 fail-closed 语义。 | `BackendCapabilityPort` 只提供摘要和可落实性判断输入,不定义业务边界。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 架构到代码转译 | 读者需要从 `01` 的核心 / 支撑子域、运行承载和依赖图自行推断代码主体。 | 明确给出架构模块到代码主体骨架的映射表和映射图。 |
| 业务主语与实现分层 | 旧材料容易把旧对象、服务、目录或后端直接当第一层结构。 | 明确业务主要组成部分候选回答“系统由什么构成”,实现分层回答“代码主体如何安放”。 |
| 非 happy path | 旧材料容易把 cleanup、reaper、redline 当运维补偿。 | 将 `FailureControlService`、`CleanupReaperService`、`RedlineContainmentService` 及对应 domain 主语纳入主体骨架。 |
| 外部协作 | 旧上下文容易把 tools、runtime、member-service、artifact、observability 或 policy 来源混进 sandbox。 | 所有外部协作只通过 refs、summary、port、projection、handoff 或 relay 主体出现。 |
| 详细设计准备度 | `03` 可能重新发明入口、service、domain、port 和 read model 主语。 | 先固定详细设计必须承接的代码主体骨架,但不越界写完整契约。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧对象词作为代码主体 | 迁移成本低,名称直观。 | 旧对象未经新版架构边界校准,且混入 runtime / tools / policy / artifact 风险。 | 不采用。 |
| 方案 B: 直接按 `Inbound / Application / Domain / Ports` 写全章 | 实现分层清楚。 | 会把技术层名误当业务结构,Step 5 缺少业务主要组成部分候选。 | 不采用。 |
| 方案 C: 直接按 Docker/gVisor/backend 类型拆主体 | 容易连接旧 README 和实现想象。 | backend capability 会反向定义业务边界,且产品选择尚未闭口。 | 不采用。 |
| 方案 D: 采用“业务主要组成部分候选 + 实现分层”双轴映射 | 既保护架构业务主语,又给详细设计安放代码主体。 | 需要 Step 5 继续逐组件收敛职责和边界。 | 采用。 |
| 方案 E: 把 failure / cleanup / redline 留到异常章节再说 | Step 4 看起来更简短。 | 非 happy path 是 sandbox 核心结构,如果 Step 4 不给代码主体,后续会被调用方或运维兜底吞掉。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 架构模块到代码主体映射表

| 架构模块 / 运行角色 | 业务主要组成部分候选 | 代码主体骨架 | 所在实现分层 | 当前边界说明 |
|---|---|---|---|---|
| 正式受控执行语境核心 | Controlled execution intake and identity | `Sandbox Sync Entry`;`ControlledExecutionIntakeService`;`ExecutionEnvironmentService`;`ControlledExecutionContext`;`ExecutionEnvironmentIdentity` | Inbound;Application Services;Domain Model | 承接受理、拒绝归责、责任链和执行环境身份,不保存 identity / work / runtime / tools 正文。 |
| 调用方接入语义上下文 | Controlled execution intake and identity | `ContextReferenceResolverPorts`;`SandboxReadService` | Ports;Application Services | 只解析 refs、safe summary、source context 和读取语境,不拥有调用方 truth。 |
| 隔离环境边界核心 | Boundary establishment and enforcement | `BoundaryEstablishmentService`;`CoherentBoundary`;`BoundaryEstablishmentDecision`;`BackendCapabilityPort`;`IsolationBackendPort` | Application Services;Domain Model;Ports | resource / filesystem / network / process / workspace / mount 必须作为 coherent boundary 整体成立。 |
| 后端能力可落实性上下文 | Boundary establishment and enforcement | `BackendCapabilityPort`;`IsolationBackendPort`;`SandboxDerivedMaintenanceService` | Ports;Application Services | 后端 capability 摘要只服务可落实性判断,不定义 sandbox truth。 |
| 策略执行裁定核心 | Policy execution decision | `PolicyExecutionService`;`PolicyExecutionDecision`;`PolicySummaryPort` | Application Services;Domain Model;Ports | 只执行给定 launch / isolation policy 和 authorization 摘要,policy 缺失 / 冲突 / 不支持时 fail-closed。 |
| policy 来源承接上下文 | Policy execution decision | `PolicySummaryPort`;`ContextReferenceResolverPorts` | Ports | 只承接 policy / approval / capability 摘要和 refs,不生成 policy source truth。 |
| 输出捕获与材料交接核心 | Execution capture and material handoff | `ControlledExecutionCarrierService`;`CaptureHandoffService`;`CaptureFact`;`HandoffFact`;`MaterialHandoffPorts`;`ObservabilityMaterialPort` | Application Services;Domain Model;Ports / Handoff | capture fact、candidate material、observability material、handoff fact 分层,不迁移下游 ownership。 |
| 下游材料消费协调上下文 | Execution capture and material handoff | `MaterialHandoffPorts`;`EventRelayPort`;`SandboxProjectionReadModels` | Ports / Handoff;Projection | 下游 ack / failed / pending 只能影响 handoff、cleanup guard 或 containment。 |
| 失败控制与安全收束核心 | Failure control and safety closure | `FailureControlService`;`CleanupReaperService`;`RedlineContainmentService`;`FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment` | Application Services;Domain Model | 非 happy path 是核心结构,cleanup 和 redline 不由调用方私有兜底。 |
| 后台维护与调查协作上下文 | Failure control and safety closure | `Sandbox Async Control Intake`;`Sandbox Operations Jobs`;`InvestigationHandoffPort`;`EventRelayPort` | Inbound / Operations;Ports | 只承接控制、调查、安全交接和维护触发,不拥有 investigation lifecycle 或 operator UI。 |
| 本地索引 / 投影 / 引用层 | Local reference, projection and derived support | `SandboxReadService`;`SandboxDerivedMaintenanceService`;`SandboxProjectionReadModels`;`DerivedInspectPreviewTrendReadModels`;`ContextReferenceResolverPorts` | Application Services;Projection;Ports | 只读派生、引用和辅助解释不得反写核心 truth。 |
| 外围增强与能力比较上下文 | Local reference, projection and derived support | `DerivedInspectPreviewTrendReadModels`;`SandboxDerivedMaintenanceService`;`BackendCapabilityPort` | Projection;Application Services;Ports | inspect / preview / trend / backend comparison 是外围派生,不得成为核心通过前提。 |

### 9.2 架构模块到代码主体映射图

#### 架构模块到代码主体映射图

```text
L4-sandbox
│
├─ 1. Controlled execution intake and identity
│  ├─ Sandbox Sync Entry
│  ├─ ControlledExecutionIntakeService
│  ├─ ExecutionEnvironmentService
│  └─ ControlledExecutionContext / ExecutionEnvironmentIdentity
│
├─ 2. Boundary establishment and enforcement
│  ├─ BoundaryEstablishmentService
│  ├─ CoherentBoundary / BoundaryEstablishmentDecision
│  ├─ BackendCapabilityPort
│  └─ IsolationBackendPort
│
├─ 3. Policy execution decision
│  ├─ PolicyExecutionService
│  ├─ PolicyExecutionDecision
│  └─ PolicySummaryPort
│
├─ 4. Execution capture and material handoff
│  ├─ ControlledExecutionCarrierService
│  ├─ CaptureHandoffService
│  ├─ CaptureFact / HandoffFact
│  ├─ MaterialHandoffPorts
│  └─ ObservabilityMaterialPort
│
├─ 5. Failure control and safety closure
│  ├─ FailureControlService
│  ├─ CleanupReaperService
│  ├─ RedlineContainmentService
│  └─ FailureClassification / ControlFact / LeaseRecord / CleanupGuard
│
└─ 6. Local reference, projection and derived support
   ├─ Sandbox Async Control Intake
   ├─ Sandbox Operations Jobs
   ├─ SandboxReadService / SandboxDerivedMaintenanceService
   ├─ ContextReferenceResolverPorts / EventRelayPort / InvestigationHandoffPort
   └─ SandboxProjectionReadModels / DerivedInspectPreviewTrendReadModels
```

关键说明：
- 这张图表达架构模块如何落到概要层代码主体骨架,不表达源码目录、crate、文件路径、完整接口或部署拓扑。
- `Controlled execution intake and identity` 到 `Failure control and safety closure` 是 Step 5 的业务主要组成部分候选,后续仍需逐项收职责、capability 和边界。
- `Sandbox Async Control Intake`、`Sandbox Operations Jobs` 和各类 ports / read models 是实现安放主语,不能反向拥有 runtime、artifact、observability、policy source 或 backend product truth。
- `ControlledExecutionCarrierService` 只表示在已成立边界和给定 policy 下承接真实执行的 sandbox 代码主体,不包含 tools semantic execution 或 runtime agent loop。

### 9.3 实现分层视图

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维维护触发
        │
        ▼
┌──────────────────────────────────────────┐
│ Inbound / Operations                     │
│ Sandbox Sync Entry                       │
│ Sandbox Async Control Intake             │
│ Sandbox Operations Jobs                  │
└───────────────────┬──────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ Application Services                     │
│ ControlledExecutionIntakeService         │
│ ExecutionEnvironmentService              │
│ BoundaryEstablishmentService             │
│ PolicyExecutionService                   │
│ ControlledExecutionCarrierService        │
│ CaptureHandoffService                    │
│ FailureControlService                    │
│ CleanupReaperService                     │
│ RedlineContainmentService                │
│ SandboxReadService                       │
│ SandboxDerivedMaintenanceService         │
└───────────────────┬──────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ Domain Model                             │
│ ControlledExecutionContext               │
│ ExecutionEnvironmentIdentity             │
│ CoherentBoundary                         │
│ BoundaryEstablishmentDecision            │
│ PolicyExecutionDecision                  │
│ CaptureFact / HandoffFact                │
│ FailureClassification / ControlFact      │
│ LeaseRecord / OrphanRecoveryRecord       │
│ CleanupGuard / RedlineContainment        │
└───────────────────┬──────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ Ports / Persistence / Projection/Handoff │
│ SandboxTruthPersistencePorts             │
│ ContextReferenceResolverPorts            │
│ BackendCapabilityPort / IsolationBackend │
│ PolicySummaryPort                        │
│ MaterialHandoffPorts                     │
│ ObservabilityMaterialPort                │
│ EventRelayPort / InvestigationHandoff    │
│ SandboxProjectionReadModels              │
│ DerivedInspectPreviewTrendReadModels     │
└──────────────────────────────────────────┘
```

关键说明：
- 这张图说明外部调用、事件和维护触发如何进入实现分层,不表达业务主要组成部分的最终职责总表。
- Inbound / Operations 只负责进入和触发;Application Services 负责编排;Domain Model 承载 sandbox truth、决策和事实主语;Ports / Projection / Handoff 承接外部接缝、持久化和只读派生。
- 同一个业务主要组成部分会跨越多层,例如 `Failure control and safety closure` 会同时需要入口、service、domain fact、truth persistence、event relay 和 investigation handoff。
- 同一个实现分层会服务多个业务主要组成部分,例如 `Application Services` 同时服务 intake、boundary、policy、capture、failure、cleanup、redline、read 和 derived maintenance。

### 9.4 业务主要组成部分与实现分层关系说明表

| 项 | 说明 |
|---|---|
| 业务主要组成部分候选 | 从架构核心 / 支撑子域承接而来的业务结构主语,回答 `L4-sandbox` 在概要层由哪些可评审的部分构成。当前候选为 controlled execution intake and identity、boundary establishment and enforcement、policy execution decision、execution capture and material handoff、failure control and safety closure、local reference / projection / derived support。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Handoff 等代码安放层,回答入口、编排、规则主语、外部接缝、持久化和派生如何组织。 |
| 二者关系 | 业务主要组成部分说明“做什么”和“拥有哪些边界”;实现分层说明“代码主体放在哪一层”。一个业务组成部分通常跨多层,一个实现分层也服务多个业务组成部分。 |
| 后续 Step 5 口径 | Step 5 必须按业务主要组成部分候选逐个收职责、capability、边界和对象发现线索,不能按 Inbound / Application / Domain / Ports 等实现分层写职责。 |
| 误用后果 | 若把实现分层当业务组成部分,会丢失 execution isolation truth 主语;若把运行承载或后端产品当业务组成部分,会让 backend、runtime、tools 或运维路径反向定义 sandbox。 |

### 9.5 关键判断

| 判断 | 当前结论 | 后续影响 |
|---|---|---|
| 哪些名称是业务主要组成部分候选 | `Controlled execution intake and identity`;`Boundary establishment and enforcement`;`Policy execution decision`;`Execution capture and material handoff`;`Failure control and safety closure`;`Local reference, projection and derived support`。 | Step 5 按这些候选逐个停审,必要时可合并或改名,但必须保持 C-SBX-1~5 和 Step 3 约束闭合。 |
| 哪些名称只是实现分层 | `Inbound / Operations`;`Application Services`;`Domain Model`;`Ports / Persistence / Projection / Handoff`。 | 后续不能把它们作为业务职责总表,只能用于安放代码主体。 |
| 哪些名称只是运行入口或维护触发 | `Sandbox Sync Entry`;`Sandbox Async Control Intake`;`Sandbox Operations Jobs`。 | 它们可作为入口、consumer 或 job 骨架,但不是完整业务主要组成部分。 |
| 哪些名称只是外部接缝 | `ContextReferenceResolverPorts`;`BackendCapabilityPort`;`IsolationBackendPort`;`PolicySummaryPort`;`MaterialHandoffPorts`;`ObservabilityMaterialPort`;`EventRelayPort`;`InvestigationHandoffPort`。 | 它们不得把相邻仓正文、后端产品私有模型、event topic 或 store schema 带入 sandbox。 |
| 为什么二者不能混用 | 业务主要组成部分保护 truth owner、职责边界和能力闭环;实现分层保护代码安放和依赖方向。混用会导致 service / repo / adapter 变成业务边界,或者业务 fact 被技术承载反向定义。 | Step 6~9 判断对象、接口、flow 和状态时必须先回到业务组成部分,再落到实现分层。 |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §4 “代码主体框架总览”可以承接本文件 §9.1 的映射表,正式文档可适度合并列宽,但不得删除 Step 5 所需的业务主要组成部分候选。
- §4 必须承接本文件 §9.2 和 §9.3 两张图,图标题、`text` 代码块和关键说明需要保持完整。
- §4 的“业务主要组成部分与实现分层关系说明”可承接本文件 §9.4,说明业务主语与实现分层不能混用。
- §4 的“关键判断”可承接本文件 §9.5,后续 Step 5~9 继续引用这些判断做门禁。
- 本文件 §5~§8 的问题回答、诊断、对比和取舍保留在 `design-calibration`,不直接全文搬入正式正文。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 5 是否直接沿用本步六个业务主要组成部分候选 | A. 直接沿用;B. 以本步候选为输入,在 Step 5 逐个收职责后允许小幅改名 / 合并 | B | Step 4 只做代码主体框架映射,Step 5 才正式收主要组成部分、职责与边界。 | 待 Step 5 确认 |
| `ControlledExecutionCarrierService` 是否会被误读为 runtime agent loop | A. 保留但加边界说明;B. 改名为 backend adapter | A | sandbox 确实需要受控执行承接主体,但它只在已成立边界和给定 policy 下承接执行,不拥有 runtime loop 或 tools semantic execution。 | 已在本步加边界说明 |
| backend capability 是否成为单独业务组成部分 | A. 是;B. 否,作为 boundary establishment 的支撑接缝 | B | backend capability 只服务限制可落实性判断,不能反向定义业务边界。 | 已采用 B |
| inspect / preview / trend 是否进入核心代码主体图 | A. 进入核心;B. 作为 local derived support | B | 外围增强只能只读派生,不得成为核心 truth 写源。 | 已采用 B |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的上游 blocker。后端组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、security profile、SLO 和产品级存储 / 观测 / 消息选择仍按 Step 3 口径保留为后续待确认,不得在 Step 5 伪装成已确认概要事实。

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确架构模块如何映射为代码主体骨架 | pass |
| 已输出 `架构模块到代码主体映射图` | pass |
| 已输出 `实现分层视图` | pass |
| 两张图均使用 `text` 代码块并提供 2~5 条关键说明 | pass |
| 已区分业务主要组成部分候选与实现分层 | pass |
| 未写代码目录、文件路径、完整 trait / struct、schema、数据库表、topic 或部署结构 | pass |
| 未把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy source truth 或 backend product truth 混入 sandbox | pass |
| 未修改正式 `02-概要设计.md` | pass |
| 是否可以进入 Step 5 | 需要用户审查并明确确认后,才能进入 Step 5 `主要组成部分、职责与边界`。 |
