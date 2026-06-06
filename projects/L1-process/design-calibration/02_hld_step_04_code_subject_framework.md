# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

把架构设计中已经收稳的 Process truth、内部语义上下文、运行承载、依赖方向和同步 / 异步 / 后台分工,转译为后续详细设计可以继续展开的代码主体骨架。重点是确认哪些名称是 `L1-process` 的业务主要组成部分,哪些只是 Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Outbox 等实现分层。

本步不定义代码目录、crate、文件路径、完整 trait、完整 struct、API schema、数据库表、topic、配置项或部署结构。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游边界和旧文档不可继承口径 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供代码主体骨架层的设计深度 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 Process truth、依赖裁剪、数据归属、通信分层和配置不可越界约束 |
| `01-架构设计.md` §6 | 已完成 | 提供 Runtime Process Shape、Process Profile、Process Execution、Gate Coordination、Checkpoint & Recovery、Consumption、Maintenance、Traceability 和 External Context Mirrors |
| `01-架构设计.md` §7 | 已完成 | 提供同步入口、异步消费、后台处理、state store 和 infra boundary 运行承载角色 |
| `01-架构设计.md` §8 | 已完成 | 提供核心语义、编排 / 承接、外部接缝、技术承载和查询 / 投影 / 维护派生面的依赖方向 |
| `01-架构设计.md` §9 / §10 / §11 | 已完成 | 提供数据所有权、一致性、通信方式和关键技术机制 |

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块,分别应落到哪些代码主体骨架上?

架构层的语义上下文不直接等同代码目录,而应先映射为代码主体骨架:

- `Runtime Process Shape` 落到 process shape synchronization service、runtime shape domain object、method definition snapshot / ref、shape index repository 和 definition source port。
- `Process Profile` 落到 profile adoption service、ProcessProfile domain object、profile tailoring policy、profile repository 和 profile change outbox。
- `Process Execution` 落到 instance command service、ProcessInstance、Activity、Token / Gateway、execution policy、instance repository 和 process fact outbox。
- `Gate Coordination` 落到 waiting gate service、WaitingGate、PauseContext、gate resume policy、governance decision resolver port 和 waiting / resume trace record。
- `Checkpoint & Recovery` 落到 checkpoint service、ProcessCheckpoint、RecoveryAttempt、recovery continuity policy、checkpoint repository 和 recovery maintenance job。
- `Process Consumption` 落到 authorized process query service、process read model、timeline / progress summary projection 和 read visibility guard。
- `Process Traceability` 落到 process trace service、ProcessTraceRecord、ProcessAuditTrail、observability / archive handoff port 和 trace evidence outbox。
- `Maintenance & Reconciliation` 落到 projection rebuild service、external snapshot refresh service、process reconciliation job、derived state repository 和 reconciliation evidence。
- `External Context Mirrors` 落到 method / work / identity / governance / artifact / runtime / conversation / observability / archive reference stores、snapshot adapters 和 stale / unresolved / invalid marker。
- `运行承载角色` 落到 sync intake、async consumer、background jobs、state store adapter、event / infra boundary adapter 等实现分层,它们不是业务主要组成部分。

### 3.2 哪些主体属于 Inbound / Operations,哪些属于 Application Services?

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Inbound | command intake、query intake、event / callback intake、SDK-facing process entry | 只负责把同步请求、查询请求、异步事件或外部反馈转成 application input,不做业务判定 |
| Operations | projection rebuild job、snapshot refresh job、reconciliation job、recovery maintenance job、trace / archive handoff job | 只负责受控维护、重建、对账、恢复辅助或交接触发,不得生成新业务事实 |
| Application Services | shape sync service、profile adoption service、instance command service、activity progression service、waiting gate service、checkpoint / recovery service、authorized query service、trace service、derived maintenance service | 负责事务编排、幂等、domain 调用、repository / port 调用、outbox 形成和失败状态落点 |

Inbound 和 Operations 是进入系统的承载形态;Application Services 是用例编排主体。它们都不是业务主要组成部分名称。

### 3.3 哪些主体属于 Domain Model,哪些属于 Ports / Persistence / Projection / Outbox?

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Domain Model | `RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessTraceRecord`、`DerivedProcessViewState` | 表达本仓业务规则、状态、不变量和禁止事项 |
| Domain Policy / Guard | `ShapeDefinitionPolicy`、`ProfileTailoringPolicy`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`WaitingGatePolicy`、`RecoveryContinuityPolicy`、`ReadVisibilityPolicy`、`DerivedProcessViewPolicy` | 判断定义来源、裁剪采用、实例推进、反馈承接、路径选择、等待恢复、恢复连续和派生读取是否允许 |
| Ports | method definition port、work context port、identity actor port、governance decision port、artifact evidence port、runtime feedback port、conversation context port、bus event port、observability handoff port、archive handoff port | 表达外部协作能力,不把外部仓正文拉进 Process truth |
| Persistence | shape index repository、profile repository、instance repository、activity / token repository、waiting gate repository、checkpoint repository、trace repository | 保存本仓正式 truth 和追溯记录 |
| Projection | process read model projection、timeline projection、progress summary projection、external context snapshot projection、reconciliation projection、derived view status | 保存派生只读结构,可延迟、可重建、不得反写 |
| Outbox | shape changed outbox、profile changed outbox、instance changed outbox、activity changed outbox、waiting gate changed outbox、checkpoint / recovery outbox、trace / archive handoff outbox | 记录已成立事实传播和交接意图,传播失败不取消 truth |

### 3.4 哪些名称必须在概要设计层先点名,否则详细设计会重新发明主语?

必须先点名的代码主体名称包括:

- 业务主要组成部分:Process truth core、runtime shape management、profile adoption management、process execution management、gate coordination、checkpoint and recovery、process timing and rhythm、process consumption and traceability、derived maintenance and reconciliation、external context mirror support。
- Application services:ProcessShapeSyncService、ProcessProfileCommandService、ProcessInstanceCommandService、ActivityProgressionService、WaitingGateCoordinationService、ProcessRecoveryService、AuthorizedProcessQueryService、ProcessTraceService、ProcessDerivedMaintenanceService。
- Domain objects / policies:RuntimeProcessShape、ProcessProfile、ProcessInstance、Activity、Token、Gateway、WaitingGate、PauseContext、ProcessCheckpoint、RecoveryAttempt、ProcessTraceRecord、ShapeDefinitionPolicy、ProfileTailoringPolicy、InstanceProgressionPolicy、GatewayRoutingPolicy、WaitingGatePolicy、RecoveryContinuityPolicy、DerivedProcessViewPolicy。
- Ports / stores:ProcessShapeRepository、ProcessProfileRepository、ProcessInstanceRepository、ActivityRepository、WaitingGateRepository、ProcessCheckpointRepository、ProcessTraceRepository、ProcessProjectionRepository、ExternalContextSnapshotRepository、ProcessOutboxRepository、MethodDefinitionPort、WorkContextPort、IdentityActorPort、GovernanceDecisionPort、ArtifactEvidencePort、RuntimeFeedbackPort、ConversationContextPort、BusEventPort、ObservabilityHandoffPort、ArchiveHandoffPort。
- Operations jobs:ProcessProjectionRebuildJob、ExternalContextSnapshotRefreshJob、ProcessReconciliationJob、RecoveryMaintenanceJob、ProcessTraceHandoffJob、ArchiveHandoffJob。

这些名称先作为骨架主语出现,完整字段、函数签名、DTO、错误码、事务边界和测试切口留到详细设计。

### 3.5 哪些内容已经是代码目录、文件路径或框架实现,不应在本步展开?

本步不展开具体目录和文件路径、HTTP / gRPC / message consumer / job runner 框架、完整 Rust struct / enum / trait、repository 函数签名、事务句柄、数据库表、索引、迁移脚本、CloudEvent / JSON / proto schema、错误码、幂等键格式、缓存、搜索、队列、数据库、BPMN engine、对象存储、调度产品或部署拓扑。

---

## 4. 架构模块到代码主体映射图

```text
+==================================================================+
|                  L1-process code subject map                     |
+==================================================================+
|                                                                  |
|  Architecture context                       Code subjects        |
|                                                                  |
|  Process truth core                   -> domain truth objects     |
|     shape / profile / instance           truth repositories       |
|     activity / gate / recovery           trace and outbox         |
|                                                                  |
|  Runtime Process Shape                -> shape sync service       |
|     method definition source             runtime shape object     |
|                                          shape index store        |
|                                                                  |
|  Process Profile                      -> profile command svc      |
|     project adoption / tailoring         tailoring policy         |
|                                          profile repository       |
|                                                                  |
|  Process Execution                    -> instance command svc     |
|     instance / activity / token          progression policy       |
|     gateway position                    instance repository       |
|                                                                  |
|  Gate Coordination                    -> waiting gate svc         |
|     wait intent / pause context          resume policy            |
|                                          governance resolver      |
|                                                                  |
|  Checkpoint and Recovery              -> recovery service         |
|     checkpoint / recovery fact           continuity policy        |
|                                          checkpoint repository    |
|                                                                  |
|  Consumption and Traceability         -> query / trace svc        |
|     read model / timeline / audit        read projections         |
|                                          handoff ports            |
|                                                                  |
|  Maintenance and Reconciliation       -> maintenance jobs         |
|     rebuild / refresh / reconcile        derived state stores     |
|                                          evidence records         |
|                                                                  |
|  External Context Mirrors             -> snapshot adapters        |
|     method / work / identity /           reference stores         |
|     governance / artifact / runtime      stale marker states      |
|                                                                  |
+==================================================================+
```

关键说明:

- 左侧是架构层已收稳的语义上下文,右侧是概要设计需要先点名的代码主体骨架。
- 该图不表达源码目录、crate、文件路径、接口协议、数据库表、topic 或运行时调用顺序。
- `method-library`、`work`、`identity`、`governance`、`artifact`、`runtime`、`conversation`、`workspace`、`observability`、`archive` 只能通过 reference、snapshot、event、port 或 handoff 边界出现,不能成为本仓内部代码主体 owner。
- 本地 snapshot / projection / reference support 是辅助主体,只能服务运行判断、降级解释、稳定消费、追溯和派生,不得保存外部正文。

---

## 5. 实现分层视图

```text
+==================================================================+
|                       L1-process layer view                      |
+==================================================================+
|                                                                  |
|  Inbound / Operations                                            |
|  command intake / query intake / event intake / callback intake /|
|  rebuild jobs / refresh jobs / reconciliation jobs / recovery    |
|                              |                                   |
|                              v                                   |
|  Application Services                                             |
|  shape sync / profile adoption / instance progression / activity |
|  feedback / waiting gate / recovery / authorized query / trace   |
|                              |                                   |
|                              v                                   |
|  Domain Model and Policies                                        |
|  RuntimeProcessShape / ProcessProfile / ProcessInstance /        |
|  Activity / Token / Gateway / WaitingGate / ProcessCheckpoint /  |
|  RecoveryAttempt / ProcessTraceRecord / continuity policies      |
|                              |                                   |
|                 +------------+-------------+                     |
|                 |                          |                     |
|                 v                          v                     |
|  Ports and External Seams             Persistence / Projection    |
|  method / work / identity /           truth repos / trace store   |
|  governance / artifact / runtime /    read model / timeline       |
|  conversation / bus / handoff         snapshots / reconciliation  |
|                              |                                   |
|                              v                                   |
|  Outbox and Handoff                                              |
|  shape changed / profile changed / instance changed / activity   |
|  changed / waiting gate changed / recovery / trace handoff       |
|                                                                  |
+==================================================================+
```

关键说明:

- 该图表达实现分层和依赖方向,不表达业务模块拆分、部署拓扑、具体框架或目录结构。
- Inbound / Operations 只负责进入和触发;Application Services 负责用例编排;Domain Model and Policies 负责业务不变量。
- Ports and External Seams 只能表达外部能力边界;Persistence / Projection 分别承载 truth 和派生只读结构。
- Outbox and Handoff 表达已成立 Process 事实传播和追溯 / 归档交接,不能反向决定 Process truth。

---

## 6. 业务主要组成部分与实现分层关系说明

### 6.1 业务主要组成部分

| 业务主要组成部分 | 从架构承接 | 后续 Step 5 展开方向 |
|---|---|---|
| Process truth core | 独立 Process truth、数据归属和一致性主线 | 定义本仓拥有的 shape、profile、instance、activity、gate、checkpoint、recovery、trace 和 outbox 核心边界 |
| Runtime shape management | Runtime Process Shape / method definition source | 定义方法来源如何被转成可执行过程形态和本地 runtime index |
| Profile adoption management | Process Profile | 定义项目采用、裁剪、切换和 profile 语境边界 |
| Process execution management | Process Execution | 定义 ProcessInstance、Activity、Token / Gateway 的运行事实推进边界 |
| Gate coordination | Gate Coordination | 定义 waiting gate、pause context、等待原因和正式恢复依据边界 |
| Checkpoint and recovery | Checkpoint & Recovery | 定义 Instance 级 checkpoint、恢复连续性和 recovery 不分叉边界 |
| Process timing and rhythm | process timing / stage / rhythm fact | 定义过程节奏、阶段和 timebox 语境,但不接管 Work Iteration truth |
| Process consumption and traceability | Process Consumption / Process Traceability | 定义授权查询、timeline、summary、审计复盘和 trace / archive 交接 |
| Derived maintenance and reconciliation | Maintenance & Reconciliation | 定义 projection rebuild、snapshot refresh、reconciliation 和派生失败可见性 |
| External context mirror support | External Context Mirrors | 定义外部引用、摘要、快照、stale / unresolved / invalid marker 的承载边界 |

### 6.2 实现分层不是业务主要组成部分

| 实现分层 | 作用 | 为什么不能当业务主要组成部分 |
|---|---|---|
| Inbound adapters | 接收 command、query、event、callback 或 job trigger | 它描述进入方式,不描述业务职责 |
| Operations jobs | 执行投影重建、快照刷新、对账、恢复辅助、追溯交接等维护任务 | 它描述运行触发形态,不拥有新的业务事实 |
| Application services | 编排用例、事务、幂等、domain 调用和 port 调用 | 它横跨多个业务组成部分,不是业务分解维度 |
| Domain model | 承载对象、状态、不变量和 policy | 它是实现层承载,具体对象归属于不同业务组成部分 |
| Ports / adapters | 表达外部能力接缝和技术适配 | 它们不能反向定义 Process truth |
| Persistence / projection / outbox | 持久化 truth、派生视图和传播意图 | 它们是技术承载和一致性边界,不是业务模块名称 |

### 6.3 关键判断

- 业务主要组成部分回答“本仓有哪些可被设计和评审的业务主体”。
- 实现分层回答“每个业务主体在代码中通过什么层次被承载”。
- 同一个业务主要组成部分会跨越多个实现分层,例如 `Process execution management` 同时需要 inbound、application service、domain object、truth repository 和 outbox。
- 同一个实现分层会服务多个业务主要组成部分,例如 Application Services 同时承接 shape、profile、instance、activity、gate、recovery、query、trace 和 derived maintenance。
- 后续 Step 5 必须按业务主要组成部分展开,不能按 Inbound / Application / Domain / Ports 这些实现分层展开。

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 将 Template / Profile / ProcessInstance / Activity / waiting_gate / checkpoint 逐词解释作为第一层结构 | 旧对象线索直接充当主要结构,缺少代码主体框架 | 改为先从架构上下文映射出业务主要组成部分和实现分层 |
| 旧图和旧叙事把 work、governance、runtime、artifact、conversation、workspace 等线索混入 Process 解释 | 容易把外部上下文对象误认为本仓内部代码主体 | Step 4 明确外部对象只能通过 port、event、snapshot、reference 或 handoff 出现 |
| 旧文档直接谈 PostgreSQL、BPMN、checkpoint 性能数字等实现候选 | 技术产品和性能数字前置,可能反向塑造核心主体 | Step 4 仅点名 repository / projection / outbox / job 等代码主体骨架,不锁技术产品 |
| 缺少 Application / Domain / Port / Projection / Outbox 的承载关系 | 详细设计会重新发明 service、object、port、store 和 outbox 主语 | 本步先点名关键代码主体骨架 |

---

## 8. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 第一层结构 | Template / Profile / Instance / Activity 教学线索 | 新版 Process truth core 下的业务主要组成部分 |
| 实现层表达 | 未清楚区分业务模块和实现分层 | 明确 Inbound、Operations、Application、Domain、Ports、Persistence、Projection、Outbox 是实现分层 |
| 外部关系 | 外部仓容易进入内部结构图 | 外部仓只能通过接缝、引用、快照、事件或交接出现 |
| 下游承接 | 详细设计需要自行补服务、对象、port、store 主语 | Step 4 先提供可继续展开的代码主体骨架 |
| 越界防护 | 依赖旧非目标提醒 | 用 Step 3 约束门禁检查每个代码主体 |

---

## 9. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 Inbound / Application / Domain / Ports 直接作为主要章节 | 容易对接代码分层 | 会把实现分层误当业务模块,不符合概要设计“主要组成部分”要求 | 不采用 |
| 方案 B: 先列业务主要组成部分,再说明它们落到哪些实现分层 | 既能表达业务结构,又能承接详细设计代码主体 | 需要多一层映射说明 | 采用 |
| 方案 C: 直接设计 crate / module / 文件路径 | 对实现最直接 | 过早进入详细设计和实施计划,也容易受仓库结构变化影响 | 不采用 |
| 方案 D: 沿用旧 Template / Profile / Instance 教学主线 | 迁移成本低 | 无法覆盖 runtime shape、gate、checkpoint、timing、traceability、maintenance 和 external mirror 的完整骨架 | 不采用 |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §4 “代码主体框架总览”引用本文件 §4 的架构模块到代码主体映射图,生成正式文档时从该节摘录。
- §4 同时引用本文件 §5 的实现分层视图。
- §4 需要引用本文件 §6.1 的业务主要组成部分表和 §6.2 的实现分层说明。
- §5 “主要组成部分、职责与边界”必须按 §6.1 的业务主要组成部分展开,不能按实现分层展开。
- 不在本 Step 重复粘贴正式全文,后续 Step 14 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 5 是否按实现分层展开 | A. 按 Inbound / Application / Domain / Ports 展开;B. 按业务主要组成部分展开,实现分层作为每部分内部承载说明 | B | 主要组成部分必须按业务主体展开,每个部分再说明对象、接口和流程更清晰 | 已确认采用 B |
| 是否在 Step 4 定代码目录 / crate | A. 是;B. 否,只点名代码主体骨架 | B | SOP 明确本步不写具体代码目录和文件路径 | 已确认采用 B |
| `External context mirror support` 是否是业务主要组成部分 | A. 完全独立业务能力;B. 作为支撑主要部分进入 Step 5,但不拥有外部正文;C. 并入 derived maintenance 不单列 | B | 它跨越 method、work、identity、governance、artifact、runtime、conversation、observability、archive 等引用和降级解释,需要边界说明,但必须受数据归属约束 | 推荐采用 B |
| `Process timing and rhythm` 是否单列 | A. 单列;B. 并入 Process execution;C. 并入 Work Iteration | A | 它是正式 Process 事实,但最容易和 Work Iteration 混写,需要在 Step 5 独立说明边界 | 推荐采用 A |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的待确认事项。`External context mirror support` 和 `Process timing and rhythm` 在 Step 5 中按推荐方案展开,若后续发现边界重复,再在 Step 5 的设计取舍中收敛。

---

## 12. 进入下一步条件

- 已明确架构模块如何映射为代码主体骨架。
- 已明确业务主要组成部分与实现分层的关系。
- 已产出架构模块到代码主体映射图和实现分层视图。
- 未提前下沉到代码目录、文件路径、完整 trait / struct 定义、数据库表、topic 或部署结构。
- 可以进入 Step 5“主要组成部分、职责与边界”。
