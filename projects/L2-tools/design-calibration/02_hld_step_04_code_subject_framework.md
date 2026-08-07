# L2-tools 02 概要 Step 4: 代码主体框架映射

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 将当前正式 01 的 `A1~A5/S1~S3/P1~P6`、`R1~R3/T1/T2/D1` 与 Step 3 门禁转译为代码主体骨架；不锁目录、语言、数据库、协议或完整类型。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 代码主体框架映射 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 1~3 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 4；概要书写规范 §4 / §4.4 与 ASCII 图规则 |
| 已读取正式输入 | yes: 01 §6~§10 的架构单元、运行承载、依赖、数据与交互 |
| 已读取参考粒度 | yes: Governance、Artifact、Capability Hub 的 Step 4 |
| 旧材料处理 | 旧 02/03 的 registry / policy / executor / MCP / 固定目录仅作差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 4 完成后进入 Step 5。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 架构主语接收 | done | `A/S/P`、`R/T/D` 到主体职责线索 | pass |
| 主体族复杂度判断 | done | 六个业务主体族候选 | pass |
| 架构到代码主体：先思考再写入 | done | 映射图与映射表 | pass |
| 实现分层：先思考再写入 | done | 分层图与层职责表 | pass |
| 业务主体 / 实现层辨析 | done | 关系说明与关键判断 | pass |
| 外部 port / blocked seam 审计 | done | Port 状态表 | pass |
| 历史差异审计 | done | 旧主体污染表 | pass |
| 自检与停审 | done | Step 4 门禁 | pass |

## 2. 本步输入

| 输入 | 关键结论 | 对代码主体的影响 |
|---|---|---|
| `A1/S1` | Current definition 与 evolution history 分权，但正式变化经同一 A1 不变量收口。 | 需要合同写服务、合同聚合、revision / evolution fact 与只读历史主体；不能由 diff / Job 改写。 |
| `A2/P2` | L2 拥有 body-free Binding，Hub 拥有 capability truth。 | 需要 Binding service / domain、Hub controlled-source port 与 ref assessment；禁止本地 registry。 |
| `A3/P5` | Canonical invocation、admission、no-execution；caller / work / trace 只保留允许 ref。 | 需要 invocation intake / service / aggregate / admission fact 与 context refs。 |
| `A4/P3/P4` | Execution requirement、authorization 消费判断、条件 handoff；decision / execution truth 外置。 | 需要 precondition service、source assessment、handoff domain 与 blocked external ports。 |
| `A5/P4/P6` | Normalized outcome、Tool-domain audit、safe eligibility / local attempt / gap；外部状态不反写。 | 需要 normalization、outcome、audit、safe handoff、submission attempt 等主体。 |
| `S2/S3/P1~P6` | 引用检测 / 对账 / 追溯、受控读取、派生、rebuild 只读。 | 需要 reference integrity / read model service、Job、projection / report 与 ref stores。 |
| `R1/R2/R3` | 同步正式承接、异步协作承接、后台维护 / 派生逻辑分离。 | Inbound / Consumer / Operations 分层，不能把 Consumer / Job 变成正式业务写源。 |
| `T1/T2/D1` | 合同 / Binding truth、Invocation / Outcome truth、external ref / derived 分承载。 | Persistence port 必须至少按 owner / write direction 逻辑分离，不等于必须三个数据库。 |

## 3. SOP 问题回答

### 3.1 架构模块分别落到哪些代码主体骨架

| 架构输入 | 业务主体族候选 | Application 主体 | Domain / Fact 主体 | Port / Persistence / Derived 主体 |
|---|---|---|---|---|
| `A1/S1/T1` | 工具合同身份、定义与演进 | `ToolContractService`;`ToolContractEvolutionService` | `ToolContract`;`ToolContractRevision`;`ToolContractEvolutionFact`;`ToolCompatibilityImpact` | `ToolContractStore`;`ContractChangePublisherPort`;合同读取 view |
| `A2/P2/T1` | Capability Binding 与受控来源 | `CapabilityBindingService`;`BindingAssessmentService` | `CapabilityBinding`;`CapabilityBindingAssessment`;`HubCapabilityRef` | `CapabilityBindingStore`;`HubControlledSourcePort`;Binding status view |
| `A3/P5/T2` | 规范调用与受理 | `ToolInvocationService`;`InvocationAdmissionService` | `ToolInvocation`;`InvocationAdmission`;`InvocationContextRefs` | `ToolInvocationStore`;`CallerContextPort`;invocation query view |
| `A4/P3/P4/T2/D1` | 执行前置与条件交接 | `ExecutionPreconditionService`;`ExecutionHandoffService` | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`ExecutionHandoff`;`ExecutionHandoffAttempt` | `AuthorizationResultSourcePort`;`SandboxExecutionPort`;`ExecutionPreconditionStore` |
| `A5/P4/P5/P6/T2/D1` | Outcome、审计与安全交接 | `OutcomeNormalizationService`;`ToolAuditService`;`SafeHandoffService` | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`ToolAuditEntry`;`SafeHandoffMaterial`;`ExternalSubmissionAttempt` | `OutcomeAuditStore`;`ExecutionSourcePort`;`EventCollaborationPort`;handoff status refs |
| `S2/S3/P1~P6/D1` | 引用完整性、受控读取与派生 | `ReferenceIntegrityService`;`ToolReadModelService`;`ToolDiagnosticService` | `ReferenceValidityAssessment`;`ConsistencyGap`;`DerivedMaterialState` | `ReferenceShadowStore`;`ContractSearchProjection`;`ToolDiagnosticSummary`;reconciliation / rebuild jobs |

这些名称是 Step 5/6 的候选池输入，不在本 Step 宣称其完整字段、方法、状态或物理存储已定。

### 3.2 哪些主体属于各实现层

- `Inbound / Operations`: Command / Query intake、external fact consumer、maintenance / reconciliation / rebuild trigger。
- `Application Services`: 围绕六个业务主体族编排用例、调用 domain 行为、协调 ports；不持有跨调用业务状态。
- `Domain Model`: Tool contract、Binding、Invocation、precondition、handoff、outcome、audit 与本地 assessment / gap 等正式语义。
- `Ports`: Core authority、Hub controlled source、authorization result source、Sandbox handoff / execution source、caller refs、event collaboration 等倒置边界。
- `Persistence`: T1/T2 正式 truth 与 D1 shadow / derived 的逻辑 store ports；技术载体不决定 domain 状态。
- `Projection / Material`: Search / diff / diagnostic / consistency report / safe consumer view；只读、可 stale、可 rebuild。

### 3.3 哪些名称必须在概要层先点名

必须点名的不是所有未来类型，而是会决定 03 是否能继续落码的主体类别：六个业务主体族、其核心 application services、核心 domain / fact 候选、truth / ref / derived stores、正式外部 ports、event collaboration port 和维护 jobs。若不先点名，详细设计会重新发明 local registry、authorization provider、executor 或观察输出路径。

### 3.4 哪些内容已越入代码目录或完整实现

以下内容不进入 Step 4：crate / package 名、`src/` 路径、文件名、语言关键字、完整 trait / struct、constructor 参数、数据库 / table、broker / topic、HTTP / RPC path、serialization、DI framework、process count、deployment unit、configuration key。主体名表达责任，不宣称已有实现。

## 4. 架构模块到代码主体映射

### 4.1 架构模块到代码主体映射图

```text
L2-tools
│
├─ 1. 工具合同身份、定义与演进
│  ├─ ToolContractService / ToolContractEvolutionService
│  ├─ ToolContract / ToolContractRevision
│  ├─ ToolContractEvolutionFact / ToolCompatibilityImpact
│  └─ ToolContractStore / ContractChangePublisherPort
│
├─ 2. Capability Binding 与受控来源
│  ├─ CapabilityBindingService / BindingAssessmentService
│  ├─ CapabilityBinding / CapabilityBindingAssessment
│  ├─ HubCapabilityRef
│  └─ CapabilityBindingStore / HubControlledSourcePort
│
├─ 3. 规范调用与受理
│  ├─ ToolInvocationService / InvocationAdmissionService
│  ├─ ToolInvocation / InvocationAdmission
│  ├─ InvocationContextRefs
│  └─ ToolInvocationStore / CallerContextPort
│
├─ 4. 执行前置与条件交接
│  ├─ ExecutionPreconditionService / ExecutionHandoffService
│  ├─ ExecutionRequirement / AuthorizationConsumptionAssessment
│  ├─ ExecutionHandoff / ExecutionHandoffAttempt
│  └─ AuthorizationResultSourcePort / SandboxExecutionPort
│
├─ 5. Outcome、审计与安全交接
│  ├─ OutcomeNormalizationService / ToolAuditService / SafeHandoffService
│  ├─ ExecutionSourceAssessment / ToolInvocationOutcome
│  ├─ ToolAuditEntry / SafeHandoffMaterial / ExternalSubmissionAttempt
│  └─ OutcomeAuditStore / ExecutionSourcePort / EventCollaborationPort
│
└─ 6. 引用完整性、受控读取与派生
   ├─ ReferenceIntegrityService / ToolReadModelService / ToolDiagnosticService
   ├─ ReferenceValidityAssessment / ConsistencyGap / DerivedMaterialState
   ├─ ContractSearchProjection / ToolDiagnosticSummary
   └─ ReferenceShadowStore / ReconciliationJob / ProjectionRebuildJob
```

关键说明：

- 图中的六组是业务代码主体族候选，Step 5 才正式确认主要组成部分、职责与接缝。
- `Service / Fact / Ref / Store / Port / Projection / Job` 是概要层代码主体类别，不是文件、crate 或完整类型定义。
- 外部 authorization、Sandbox、Hub、Bus、Observability、Runtime 与 SDK 不成为内部主体；它们只通过允许 port / ref / material 边界出现。
- `AuthorizationResultSourcePort`、`SandboxExecutionPort`、`EventCollaborationPort` 含 blocked seam，不表示 provider、mapping、route 或 delivery 已存在。
- 图不表达每次 invocation 固定经过六组，也不表达事务、函数链或物理存储。

### 4.2 架构单元覆盖表

| 架构单元 | 代码主体承接 | 覆盖状态 | 防越界说明 |
|---|---|---|---|
| `A1/S1` | 主体族 1 | covered | Current definition 与演进 history 分层，正式变化重入合同边界。 |
| `A2/P2` | 主体族 2 | covered | Binding 是 relation，Hub source 是 port / ref，不建 registry。 |
| `A3/P5` | 主体族 3 | covered | Caller refs 不含 Runtime plan / raw request。 |
| `A4/P3/P4` | 主体族 4 | covered / blocked ports | 不生成 authorization decision，不拥有 Sandbox lifecycle。 |
| `A5/P4/P6` | 主体族 5 | covered / blocked ports | Source、outcome、audit、submission status 分权。 |
| `S2/S3/P1~P6` | 主体族 6 | covered | 只读 / 派生 / 检测不改写核心或外部 truth。 |
| `R1/R2/R3` | Inbound / Consumer / Operations + Application 分层 | covered | 逻辑角色可同部署，但写边界不能合并。 |
| `T1/T2/D1` | Truth stores / reference shadow / projections | covered | 逻辑分层不等于三个物理数据库。 |

## 5. 实现分层

### 5.1 实现分层视图

```text
外部调用 / 外部事实材料 / 运维任务
                  │
                  ▼
+-----------------------------------------------------------+
| Inbound / Operations                                      |
| Command Intake | Query Intake | Fact Consumer | Job Trigger|
+----------------------------+------------------------------+
                             │ only formal use-case entry
                             ▼
+-----------------------------------------------------------+
| Application Services                                      |
| Contract | Binding | Invocation | Precondition/Handoff     |
| Outcome/Audit/Safe Handoff | Reference/Read Model          |
+----------------------------+------------------------------+
                             │ invoke domain behavior
                             ▼
+-----------------------------------------------------------+
| Domain Model                                              |
| Contract/Revision | Binding/Assessment | Invocation        |
| Requirement/Handoff | Outcome/Audit | Gap/Derived State    |
+---------------------+----------------+----------------------+
                      │                │
             persist truth            │ consume / publish via ports
                      ▼                ▼
+---------------------------+  +------------------------------+
| Persistence / Projection  |  | Ports / External Adapters    |
| T1/T2 truth stores        |  | Core | Hub | Auth(blocked)    |
| D1 refs / derived views   |  | Sandbox(blocked) | Bus/Obs   |
+---------------------------+  +------------------------------+
```

关键说明：

- 箭头表达允许的调用 / 依赖方向，不表达具体函数、transport、事务或部署拓扑。
- Inbound / Consumer / Job 只能进入 Application Service；外部材料不得直接写 Domain 或 store。
- Domain Model 决定正式语义，Persistence / Projection 和 adapters 不能通过技术状态反向定义 truth。
- T1/T2/D1 只表示逻辑 owner / write direction；允许物理共用承载，但不得混淆状态与失败语义。
- Blocked ports 只暴露缺口和保守失败，不承诺具体 provider / endpoint / schema 已存在。

### 5.2 实现分层职责表

| 实现层 | 安放的代码主体 | 允许职责 | 禁止职责 |
|---|---|---|---|
| Inbound / Operations | Command / Query intake、Consumer、Job trigger | 解析正式输入骨架、建立 metadata / source context、调用 application service。 | 补造 domain 语义、绕过受理 / 前置、直接写 store。 |
| Application Services | 六主体族服务 | 编排单一用例、协调 domain 与 ports、划分本地提交前后。 | 保存跨调用状态、生成外部 truth、吞并 Runtime orchestration。 |
| Domain Model | Contract、Binding、Invocation、Requirement、Handoff、Outcome、Audit、Assessment、Gap | 保护不变量、状态迁移、正式判断和本地事实。 | 依赖 sibling model、transport payload、数据库 / broker 状态。 |
| Ports | Core / Hub / Auth / Sandbox / Caller / Bus / Obs boundary | 用 L2 语义描述需要什么 / 交接什么，隔离外部模型。 | 把 adapter 成功当 domain 成功，或将未闭口 port 写成 ready。 |
| Persistence | T1/T2 truth 与 D1 ref / derived store ports | 持久化已由 domain 成立的事实，按 owner 分离读写。 | 用 row / cache / queue 状态决定 domain 状态。 |
| Projection / Material | Search、diff、diagnostic、consistency report、safe consumer material | 只读派生、stale / rebuild / unavailable 显式。 | 创建 / 修正合同、Binding、Invocation、Outcome 或 external truth。 |

## 6. 业务主体与实现分层关系

| 项 | 说明 |
|---|---|
| 业务主要组成部分候选 | 六个主体族回答“L2-tools 在工具合同语义上做什么”，其名称应贯穿 Step 5~12。 |
| 实现分层 | Inbound、Application、Domain、Ports、Persistence、Projection 回答“这些业务主体的代码如何安放和限制依赖”。 |
| 横向关系 | 每个业务组成部分可以跨多个实现层，例如 Binding 同时拥有 intake、service、domain、Hub port、store 和 status view。 |
| 非一一对应 | `A1~P6` 是架构语义单元，六主体族是概要业务结构，实现层是代码组织视角；三者不得互相直接替代。 |
| 外部接缝 | Hub / Auth / Sandbox / Runtime / Bus / Observability / SDK 是 ports 的协作对象，不是 L2 内部业务组成部分。 |
| 技术承载 | Database、queue、cache、search、scheduler 或 framework 即便后续采用，也只能实现 Persistence / Adapter / Projection，不成为业务主体。 |

### 6.1 关键判断

1. 六个主体族是 Step 5 的正式组成部分候选，但必须经过 capability、对象线索、非职责与接缝逐项验证后才能定稿。
2. `ToolContractService` 等是 application 主体，不是外部 API；正式 API 名称只能在 Step 7 从对象能力推导。
3. `ToolContractStore`、`OutcomeAuditStore` 和 `ReferenceShadowStore` 是逻辑 persistence ports，不等于 repository 完整 trait、表或独立数据库。
4. `EventCollaborationPort` 只表达 post-truth 交接需要，不等于 Bus topic、Observability route 或 delivered / observed 状态。
5. `ExecutionHandoffService` 不执行工具；`OutcomeNormalizationService` 不拥有 capture；`ToolReadModelService` 不创建 truth。
6. 旧 `ToolRegistry`、`ToolPolicy / Scope`、`ToolExecutor`、`McpClient`、`BuiltinInventory` 和 `ToolHealthService` 不进入现行主体框架。

## 7. External Port 状态

| Port 候选 | 外部 owner | 当前状态 | 代码主体允许表达 | 禁止表达 |
|---|---|---|---|---|
| Core shared contract authority | Core | authority candidate | Compile boundary 与共享类别缺口。 | Tools-specific package / type 已存在。 |
| Hub controlled source | Capability Hub | current logical runtime seam | Capability ref / safe summary 读取与 source assessment。 | Hub registry model / body 本地复制。 |
| Authorization result source | owner pending | blocked | Required source、unverifiable / missing / stale / conflict。 | Provider、decision schema、allow / deny 生成。 |
| Sandbox handoff / execution source | Sandbox | logical seam; mapping / receipt blocked | Handoff requirement、local attempt、source ref、mapping gap。 | Accepted、run、capture body、receipt、cleanup 已成立。 |
| Caller context | 各正式 owner | current logical seam | Actor / work / trace typed refs 与允许摘要。 | Plan、loop、checkpoint、raw request body。 |
| Event collaboration | Bus current; Obs logical pending | partial / blocked route | Safe material candidate、local attempt、external status ref。 | Topic / route、delivered / observed / readiness。 |
| SDK consumer | SDK | future / excluded | 服务端合同兼容边界。 | Client、wrapper、coverage、联调 ready。 |

## 8. 旧材料差异审计

| 旧主体 | 当前结论 | 原因 |
|---|---|---|
| Tool Registry / inventory / builtin catalog | 不进入 | 不是现行需求 / 架构 truth，且会复制 Hub / product inventory。 |
| ToolPolicy / ToolScope / governed classifier | 不作为决策主体 | 工具风险 / requirement 可在合同中表达，effective authorization 外置。 |
| ToolExecutor / host callback / MCP Client | 不进入核心主体 | 执行与 client / adapter implementation 不归本仓；只保留 ports。 |
| ToolHealth / Availability | 不进入 | 无现行 FR / DR / owner 来源；如需新增必须回退上游。 |
| Metrics / trace emitter 作为 audit 主体 | 不进入核心 | Tool-domain audit 与 observation 分权；只保留 safe material / port。 |
| Retry coordinator / recovery manager | 不进入 | Runtime recovery / Bus delivery recovery / Sandbox recovery 各归 owner。 |
| 固定 service / repo / event / schema / directory | 不继承 | 未从当前 00/01 推导，且越入 03。 |

## 9. 回填草稿

Step 14 装配正式 §4 时使用本 Step 的 §4.1 映射图、§5.1 分层图、§6 关系表与 §6.1 关键判断。正式正文可以精简主体叶节点，但不得删掉六主体族、blocked port 说明、T1/T2/D1 逻辑分层或业务 / 实现层辨析。

## 10. 待确认事项

| 待确认项 | 采用结论 | 状态 |
|---|---|---|
| 六主体族是否在 Step 4 直接定稿 | 作为候选；Step 5 逐部分验证后定稿。 | confirmed |
| `Service / Store / Port` 是否等于实现类型 | 不是，只是概要代码主体类别。 | confirmed |
| Blocked port 是否因未 ready 而删除 | 不删除；保留需求位置、缺口与保守失败，但不补协议。 | confirmed |
| 是否恢复旧 registry / policy / executor 主体 | 不恢复。 | confirmed |

## 11. 进入下一步条件

- [x] 两张必画 ASCII 图齐备，并有关键说明。
- [x] `A1~A5/S1~S3/P1~P6`、`R1~R3/T1/T2/D1` 全部有承接。
- [x] 六业务主体族与实现分层明确区分。
- [x] External ports 的 current / blocked / future 状态诚实。
- [x] 未写目录、完整 trait / struct、schema、数据库、协议或部署。
- [x] 可以进入 Step 5“主要组成部分、职责与边界”。
