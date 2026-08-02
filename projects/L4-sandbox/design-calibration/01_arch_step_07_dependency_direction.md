# Step 7. 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 7 | pass。用户已确认 Step 6 `容器 / 部署架构`,可进入 Step 7。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_01_requirement_baseline.md`、`01_arch_step_02_goals_constraints.md`、`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md`、`01_arch_step_05_bounded_context_subdomains.md` 和 `01_arch_step_06_container_deployment.md`。 |
| 是否已读取架构 SOP Step 7 与书写规范 §4.8 | pass。已读取依赖方向图、层间约束表、依赖倒置、跨仓依赖裁剪、禁止依赖和依赖边界审计要求。 |
| 是否已读取全局依赖裁剪规则 | pass。已读取 `standards/document/全局项目依赖关系与裁剪规则.md`,确认只有编译期依赖可进入 package dependency,运行期和事件协作不得写成源码依赖。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的使用方与依赖、核心能力、规则、数据归属、接口依赖、NFR、验收和风险章节。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_07_dependency_direction.md` 和 `projects/L1-governance/design-calibration/01_arch_step_07_dependency_direction.md` 的责任层、裁剪表、禁止依赖和停审组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_07_dependency_direction.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

明确 `L4-sandbox` 内部有哪些正式架构责任层 / 依赖角色,这些角色之间允许怎样依赖,哪些外部能力必须通过正式边界进入,哪些跨仓关系必须从全局依赖基线中裁剪,以及哪些依赖不得在后续概要 / 详细 / 实施阶段被误写成源码依赖。

本步只讨论依赖方向和层间规则,不重写限界上下文、容器部署、接口协议、数据库细节、代码目录、handler / service / repository 调用链、事件字段、部署产品、配置 key、后端参数或技术选型。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 承接 sandbox 做 / 不做、易混淆职责和边界红线,判断哪些依赖必须保护 execution isolation truth。 |
| `01_arch_step_04_system_context.md` | 已完成并经用户确认 | 承接正式上下文对象、输入 / 输出面、依赖失效降级口径和抽象 isolation backend 边界。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成并经用户确认 | 承接核心子域、支撑子域、本地索引 / 投影 / 引用和统一语言,但不把子域对象直接画成依赖层。 |
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 承接同步入口、异步控制消费、受控执行承接、后台维护、truth / material 状态承载、isolation backend 和外部交接边界,但不把运行单元直接画成依赖层。 |
| `projects/L4-sandbox/00-需求文档.md` §6 / §11 / §12 | 当前正式需求基线 | 提供需求层依赖裁剪、数据归属和接口边界,校验 `L0-core` 唯一编译期依赖与运行期 / 事件协作关系。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 提供全局依赖类型、单仓裁剪表、分类表、禁止依赖表和依赖裁剪图格式。 |
| 上游参考 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work` | 已按 sandbox / policy / artifact / observability / execution truth 主题检索 | 校验 tools semantic execution、runtime agent loop、member lifecycle orchestration、identity / work truth 不归 sandbox。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧 SDK、Docker/gVisor/Firecracker/runc、capability-hub、目录结构、事件和性能假设是否污染依赖方向。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §7 | historical material | 诊断旧 `api -> application -> domain -> infra`、`SandboxBackend`、`PolicyViewProvider`、`AuditPublisher`、Docker/gVisor/local_process、capability-hub 和 observability 是否污染依赖方向。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 3~6、正式 00、SOP Step 7、书写规范 §4.8 和全局依赖裁剪规则 | done | 本文件 §1、§3 |
| 回答内部层次、允许依赖、禁止依赖、外部接入、跨仓裁剪、依赖类型和倒置边界问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 和上游参考中的依赖污染点 | done | 本文件 §6 |
| 选择按架构责任层 / 依赖角色建模,不按代码分层、运行单元或后端产品建模 | done | 本文件 §8 |
| 输出依赖方向图、层间约束表、依赖倒置结论、架构单元规则、三张跨仓裁剪表和裁剪图 | done | 本文件 §9 |
| 完成依赖方向停审和跨依赖边界审计 | done | 本文件 §9.9、§9.10 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 7 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 本仓内部层次如何划分?

本章中的“层次”不是源码目录、crate、模块、服务进程、运行容器、adapter、repository、handler、worker 或后端产品,而是架构责任层 / 依赖角色。`L4-sandbox` 收敛为五类依赖角色:

- `Sandbox 核心语义角色`:承载受控执行语境、execution environment identity、coherent boundary、给定 policy 执行裁定、capture / handoff、failure classification、cleanup guard、lease / orphan、reaper 和 redline containment 的核心语义判断。
- `Sandbox 编排 / 承接角色`:承接同步入口、异步控制、执行请求、控制意图、后台维护触发和材料交接触发,并把外部输入转换为核心语义可接受的 ref、summary、policy input、boundary decision、capture decision 或 control fact。
- `外部能力接缝角色`:承接 identity、work、tools、runtime、member-service、runner、policy sources、artifact、observability、`L0-bus` 和 isolation backend 等外部能力边界。
- `本地影子 / 派生辅助角色`:承接身份 / 工作引用、调用方入口引用、policy / authorization 摘要、backend capability 摘要、handoff 引用、观测 / 事件投影、inspect / preview / trend 等只读或派生材料。
- `技术承载角色`:承载 truth / material 状态、isolation backend 对接、事件协作、材料交接、后台维护支撑和运行支撑,但不拥有 sandbox 语义定义权。

### 5.2 允许哪些依赖方向?

允许的依赖方向是外层依赖内层、接缝依赖正式边界、派生依赖核心 truth、技术承载服从核心定义的承载契约。`Sandbox 核心语义角色` 只能依赖 `L0-core` 级共享契约和本仓内部 execution isolation 规则,不能依赖调用方业务 truth、policy definition truth、artifact truth、observability store、event topic、数据库产品、后端产品或 UI / SDK 私有状态。

`Sandbox 编排 / 承接角色` 可以依赖核心语义角色、外部接缝、技术承载契约和派生规则,但必须先把外部输入收束成核心允许的引用、摘要、裁定、材料或控制事实。`本地影子 / 派生辅助角色` 只能依赖核心 truth、授权范围、交接边界和派生规则,不能反向写核心。`技术承载角色` 只能服务正式承载契约,不能决定 policy、boundary、capture、cleanup 或 redline 的业务含义。

### 5.3 禁止哪些反向依赖?

禁止 tools、runtime、member-service、runner、artifact、observability、identity、work、governance / capability、isolation backend、SDK、console、archive、事件总线或技术设施反向定义 sandbox execution isolation truth。也禁止把运行期依赖、事件协作依赖、材料交接依赖、观测依赖或基础设施依赖写成 `L4-sandbox` 的源码 / package 依赖。

典型禁止反向依赖包括:

- `ToolInvocationResult`、`ToolPolicy`、`ToolAuditEntry` 不能定义 sandbox capture 或 policy execution truth。
- `ExecutionInstance`、runtime recover、step progression 不能定义 sandbox failure / cleanup truth。
- `SandboxBinding`、MemberExecutionHost 和 host lifecycle 不能定义 sandbox execution environment identity。
- Artifact baseline / evidence / retention 不能定义 sandbox captured output 或 cleanup guard。
- Observability audit store、metric、trace、alert 不能替代 sandbox truth / material 状态承载。
- Docker/gVisor/Firecracker/k8s/local_process 等后端产品不能反向决定 coherent boundary 的语义。

### 5.4 外部系统通过哪些正式边界接入?

外部能力必须通过 `外部能力接缝角色` 进入,再由 `Sandbox 编排 / 承接角色` 转换为核心可接受的输入。identity / work 只能作为 actor / member / project / work / context refs 或 safe summary 进入。tools、runtime、member-service、runner 只能作为受控执行请求方、执行消费方或反馈消费方进入。policy 来源只能作为给定 launch / isolation policy、authorization、approval 或 capability 摘要进入。artifact、observability、runtime、runner 和 bus 只能通过 handoff、material、event collaboration 或 failure / cleanup 交接边界消费。

isolation backend 通过技术承载边界进入,只提供进程、文件系统、网络、资源和生命周期控制的承载能力。它不能直接写核心语义,也不能因为某后端不支持必需限制而允许 sandbox silent degrade。

### 5.5 本仓在全局依赖基线中涉及哪些跨仓依赖边?

本仓直接涉及:

- `L0-core`:唯一编译期依赖,提供共享 ID、typed refs、actor / context、trace、error、metadata 和跨仓契约基础。
- `L0-bus`:事件协作主干,用于 sandbox status、failure、control、cleanup、redline 和材料交接协作。
- `L1-identity` / `L1-work`:运行期语境来源,提供 actor / member / project / work / context refs。
- `L1-governance` / `L3-capability-hub` / `L2-tools`:运行期 policy / authorization / capability / ToolPolicy 来源或协作边界,但不迁移 policy truth。
- 容器 / k8s / isolation backend:运行期基础设施依赖。
- `L2-tools` / `L2-runtime` / `L2-member-service` / `L5-runner`:受控执行能力消费者和协作方。
- `L1-artifact`:captured output、candidate material、handoff refs 和后续正式制品消费边界。
- `L4-observability`:audit / trace / metric / failure / cleanup / redline material 消费边界。
- `L0-sdk` / L5 产品入口:可作为后续访问包装或产品入口,但不进入本仓核心依赖主链,也不得反向定义核心语义。

### 5.6 哪些依赖边进入本仓架构主链,哪些被裁剪出去?

进入主链的依赖边是会影响 execution environment identity、coherent boundary、resource / filesystem / network / process limits、给定 policy 执行、capture / handoff、failure classification、cleanup / lease / reaper、redline containment 和 observability hooks 的关系。

被裁剪出去的是 SDK 实现外形、具体 API / RPC 协议、Docker/gVisor/Firecracker/k8s/local_process 产品组合、数据库 / 对象存储 / OTel / secrets / external GRC 产品、operator console、runner UI、artifact retention、runtime recover、工具语义执行、member host lifecycle 和容器镜像构建。它们可以在后续 Step 9 / Step 10 / 04 / 07 或相邻仓文档中重审,但不能在 Step 7 中进入依赖主链。

### 5.7 进入主链的跨仓依赖分别是什么类型?

`L0-core` 是唯一编译期依赖。`L0-bus` 是事件协作依赖。`L1-identity`、`L1-work`、`L1-governance`、`L3-capability-hub`、`L2-tools` 的 policy / capability / tool policy 输入、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact`、`L4-observability` 和 isolation backend 均只能按运行期依赖、事件协作、材料交接或基础设施依赖表达,不得进入 Cargo / package dependency。

### 5.8 哪些依赖必须倒置,不能直接侵入核心语义层?

identity / work 语境、policy / authorization 来源、tools / runtime / member-service / runner 调用方、artifact / observability 下游消费、事件协作、isolation backend、存储、材料承载、投影、inspect / preview / trend 和后台维护触发都必须倒置到正式接缝或技术承载角色。核心语义只声明自己需要的引用、摘要、裁定、边界、状态、材料和控制事实,外部适配和技术实现服从这些核心规则。

### 5.9 哪些规则若不先写清,后续实现最容易失控?

最容易失控的规则是:只有 `L0-core` 可作为编译期依赖;运行期和事件协作不得写成 package dependency;调用方不能形成第二套 sandbox 语义;policy 来源不能进入本仓 truth;capture material 不能静默升级为 artifact truth;observability / bus 不能替代 truth store;isolation backend 不能反向定义边界语义;本地投影、inspect、preview、trend 和维护查询不能反写核心 truth。

### 5.10 每个架构单元允许依赖谁、禁止依赖谁、通过什么边界接入?

本步按五类依赖角色逐一收束依赖规则。详细表见 §9.4。总体原则是 `Sandbox 核心语义角色` 不直接接入外部,只接收编排承接后形成的正式输入;`Sandbox 编排 / 承接角色` 负责把外部能力和运行承载转换为核心可接受的语义;`外部能力接缝角色` 只能做边界转换;`本地影子 / 派生辅助角色` 只能读取 / 派生;`技术承载角色` 只承载正式契约。

### 5.11 所有依赖规则完成后是否存在反向依赖、运行期通信误写 package dependency 或跨仓依赖裁剪不一致?

当前审计未发现 unresolved 反向依赖或依赖类型冲突。历史材料中的 `quantalithos-sdk`、capability-hub、Docker/gVisor/local_process、observability event adapter、`SandboxBackend`、`PolicyViewProvider`、`AuditPublisher` 和 `api -> application -> domain -> infra` 均已降级为 historical material 或后续技术 / 详细设计候选,不得作为 Step 7 正式依赖结论继承。

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 旧材料位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 关键依赖 | 写 `quantalithos-core` / `quantalithos-sdk`、Docker / containerd / gVisor / Firecracker / runc。 | 把 SDK、后端产品和运行期基础设施混入依赖事实;与 `L0-core` 唯一编译期依赖冲突。 | 仅保留 `L0-core` 编译期依赖;SDK 和具体后端产品不进入本步主链。 |
| 核心职责 | 写危险工具走 sandbox、Runner 复用 sandbox、审计事件。 | 方向相关,但可能把调用方和事件名写成核心依赖。 | 只保留调用方运行期消费和事件协作边界,不继承事件名。 |
| 目录结构 | 写 `api/`、`backends/`、`limits/`、`audit/`、`rpc/`。 | 代码目录不是架构责任层。 | 不进入依赖方向图和层间约束表。 |
| 维护纪律 / README 清单 | 写 SB 条目和具体后端组合。 | 旧约束未经当前 full-restart 重审。 | 只作为历史线索,具体产品与指标后移。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 旧架构内容 | 问题 | 本步处理 |
|---|---|---|
| `api -> application -> domain -> infra(Docker/gVisor/local adapters / bus / policy lookup)` | 这是代码分层与实现调用图,不是架构责任层 / 依赖角色。 | 改为核心语义、编排承接、外部接缝、本地影子 / 派生辅助和技术承载。 |
| `domain(SandboxExecution / LimitSet / PolicyView)` | 把对象清单和旧对象名写成依赖层。 | 核心语义只表达受控执行隔离事实和依赖保护,不写对象字段或聚合。 |
| `SandboxBackend`、`PolicyViewProvider`、`AuditPublisher` | 实现接口点提前进入架构依赖 Step。 | 本步只保留依赖倒置结论,具体 port / adapter 后移 `02/03`。 |
| Docker / gVisor / local_process 作为 infra 节点 | 提前固化技术产品,且 local_process 容易违反宿主直跑红线。 | 改为抽象 isolation backend 技术承载边界;具体产品后移 Step 10 / 04 / 07。 |
| capability-hub allowlist / observability event adapter | 固定 policy 来源和观测 sink,容易把外部 truth 反写 sandbox。 | 改为 policy sources 和 material / observability handoff 接缝,不得反写核心。 |
| 依赖健康度用传入 / 传出耦合和抽象度 | 指标化但缺依赖裁剪表,无法约束实现依赖。 | 按全局依赖裁剪规则输出三张表和裁剪图。 |

### 6.3 上游参考边界诊断

| 上游参考 | 当前线索 | 本步处理 |
|---|---|---|
| `L2-tools` | tools 文档强调 ToolDefinition、ToolPolicy、ToolInvocationResult 和 ToolAuditEntry 是 tools truth,restricted / governed tool 需 sandbox 约束。 | sandbox 只提供隔离边界、capture / failure 材料和给定 policy 执行结果,不拥有工具语义或工具结果 truth。 |
| `L2-runtime` | runtime 文档强调 ExecutionInstance、CurrentStep、recover 和结果回流是 runtime truth,tools / member-service / sandbox 是执行能力层。 | sandbox 只提供隔离层事实和材料,不推进 runtime agent loop、step progression 或 recover。 |
| `L2-member-service` | member-service 文档强调 MemberExecutionHost、SandboxBinding、host lifecycle 和 callback material 是 member-service truth。 | sandbox 可提供隔离环境和绑定 / 执行反馈材料,但不拥有 SandboxBinding 装配结果或 host lifecycle。 |
| `L1-identity` / `L1-work` | actor / member / project / work 正文由对应 L1 真相域拥有。 | sandbox 只消费 refs / safe summary,不得保存正文或生成 identity / work truth。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 层次主语 | API / application / domain / infra;SandboxBackend;PolicyViewProvider;AuditPublisher。 | Sandbox 核心语义、编排承接、外部能力接缝、本地影子 / 派生辅助、技术承载。 | 本章表达依赖保护关系,不是代码组织或接口清单。 |
| 编译期依赖 | 旧 README / 旧 `01` 暗示 SDK、capability-hub、后端 adapter 等可直接关联。 | 只有 `L0-core` 是编译期依赖。 | 对齐全局依赖裁剪规则和正式需求 §6。 |
| 运行期依赖 | capability-hub、Docker/gVisor、observability 被画成 infra 节点。 | policy sources、isolation backend、observability handoff 均为运行期 / 事件 / 材料接缝。 | 防止运行期关系写入 package dependency。 |
| 核心保护 | `PolicyView`、allowlist、audit event、backend flags 可能进入核心。 | 核心只接收已收束 ref、summary、policy input、boundary decision、capture/control fact。 | 防止 policy truth、观测 truth 和后端产品反向定义 sandbox。 |
| 派生面 | 旧材料缺少本地影子 / 派生辅助层,或把 observability 当输出 sink。 | 本地引用、投影、handoff、inspect / preview / trend 只能读核心和交接材料。 | 防止读侧、调查、预览和趋势分析成为隐藏写源。 |
| 下游消费 | runtime / runner / tools 可看作同一 API 调用方。 | tools、runtime、member-service、runner 各为运行期消费者 / 协作方,但共享统一 sandbox 语义。 | 保留统一边界,不要求同一协议外形。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用 `api -> application -> domain -> infra` | 对实现者熟悉,与旧 `01` 接近。 | 这是代码分层和调用关系,会提前进入 `02/03`,且不能表达跨仓依赖裁剪。 | 不采用。 |
| 方案 B: 按核心语义、编排承接、外部接缝、本地影子 / 派生辅助、技术承载建依赖角色 | 能承接 Step 5 / 6,保护 sandbox truth,并可直接导向跨仓裁剪。 | 后续概要设计仍需映射到具体组成部分。 | 采用。 |
| 方案 C: 把所有上下游仓都画成直接依赖 | 看似完整。 | 会把运行期、事件协作和材料交接误写成源码依赖。 | 不采用。 |
| 方案 D: 只保留 `L0-core` 和 isolation backend | 图最短。 | 会遗漏 policy 来源、调用方、artifact / observability handoff、cleanup / redline 协作和事件协作风险。 | 不采用。 |
| 方案 E: 把 Docker/gVisor/Firecracker/k8s/local_process、OTel、DB、secrets、GRC 产品纳入当前依赖主链 | 贴近实现想象。 | 提前锁定技术选型和配置,且可能让后端产品反向定义安全边界。 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 `L0-sdk` 写成本仓直接依赖 | A. 写成编译期或运行期主依赖;B. 仅作为后续访问包装 / 下游产品入口;C. 完全不提 | B | `L4-sandbox` 当前唯一编译期依赖是 `L0-core`;SDK 不应反向定义核心。 | 本步采用 B。 |
| 是否固定 capability-hub 为唯一 policy 来源 | A. 固定;B. 写成 `L1-governance` / `L3-capability-hub` / `L2-tools` 等 policy sources 接缝;C. 由实现决定 | B | sandbox 只执行给定 policy,不拥有 policy definition 或 approval truth。 | 本步采用 B。 |
| 是否把具体 isolation backend 写入依赖图 | A. 写 Docker/gVisor/Firecracker/k8s/local_process;B. 只写抽象 isolation backend 技术承载边界;C. 暂不表达后端 | B | 真实隔离承载必须存在,但产品组合属于后续技术选型 / 配置 / 实施。 | 本步采用 B。 |
| 是否允许派生投影 / inspect / preview 反写核心 | A. 允许;B. 禁止,只能读取核心 truth 和材料交接 | B | 防止调查、预览或趋势分析成为第二写源。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.1 依赖方向图

```text
+====================================================================+
|                      L4-sandbox 依赖边界                           |
|                                                                    |
|   +---------------------------+       +--------------------------+ |
|   | 外部能力接缝角色          |       | 技术承载角色             | |
|   | context / policy / handoff|       | state / backend / event  | |
|   +-------------+-------------+       +-------------+------------+ |
|                 | 边界接入                          | 允许依赖    |
|                 v                                   v             |
|        +--------+-----------------------------------+------+      |
|        | Sandbox 编排 / 承接角色                           |      |
|        | intake / control / execute / cleanup / handoff    |      |
|        +----------------------+----------------------------+      |
|                               | 允许依赖                          |
|                               v                                   |
|        +----------------------+----------------------------+      |
|        | Sandbox 核心语义角色                               |      |
|        | identity / boundary / policy / capture / redline   |      |
|        +----------------------+----------------------------+      |
|                               ^                                   |
|                               | 允许依赖                          |
|        +----------------------+----------------------------+      |
|        | 本地影子 / 派生辅助角色                            |      |
|        | refs / summaries / projections / inspect material  |      |
|        +---------------------------------------------------+      |
|                                                                    |
+====================================================================+
```

图示说明:

- 箭头只表示允许依赖或边界接入,不表示运行调用顺序、协议时序、事件传播顺序或代码调用链。
- `Sandbox 核心语义角色` 是被保护的中心,外部来源、调用方、下游消费、技术承载和派生辅助都不能反向定义它。
- `本地影子 / 派生辅助角色` 可以依赖核心 truth、授权范围和材料交接,但不得形成第二份 sandbox truth。
- `技术承载角色` 只服从正式承载契约,不决定 execution identity、coherent boundary、policy、capture、cleanup 或 redline 语义。

### 9.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| `Sandbox 核心语义角色` | `L0-core` 共享契约;本仓内部 execution isolation 规则 | tools / runtime / member-service / runner 业务 truth;identity / work 正文;policy definition / approval / allowlist truth;artifact truth;observability store;event topic;database 产品;isolation backend 产品;UI / SDK 私有状态 | 保护受控执行语境、execution environment identity、coherent boundary、policy 执行裁定、capture / handoff、failure、cleanup 和 redline truth。 |
| `Sandbox 编排 / 承接角色` | 核心语义角色;正式外部接缝;正式承载契约;派生规则 | 绕过核心直接写状态承载;把外部正文原文写成本仓 truth;把派生材料反推核心;把调用方结果或观测日志当 sandbox truth | 承接入口、控制、执行、清理和交接,但必须把外部能力转换为核心允许的引用、摘要、裁定、材料或控制事实。 |
| `外部能力接缝角色` | 编排 / 承接角色;正式运行期边界;事件协作边界;材料交接边界 | 直接改变核心语义;直接依赖核心存储私有结构;把相邻仓私有实现写成本仓依赖;把运行期依赖写成源码依赖 | identity、work、tools、runtime、member-service、runner、policy sources、artifact、observability、bus 和 backend 只能通过接缝进入或消费。 |
| `本地影子 / 派生辅助角色` | 核心 truth;授权范围;正式派生规则;handoff / observability / event 交接边界 | 新建 / 覆盖 execution isolation truth;生成正式 policy、artifact、runtime、member 或 work truth;绕过 cleanup guard 输出;把 inspect / preview / trend 反写核心 | refs、summaries、projections、handoff pointers、inspect / preview / trend 都是辅助或派生,可滞后、可重建、可失败。 |
| `技术承载角色` | 核心定义的正式状态、材料、控制事实和承载契约 | 决定业务状态、policy 语义、边界含义、失败分类、材料归属、cleanup / retention 规则或 redline 处置含义 | 状态承载、isolation backend 对接、事件协作、材料交接、存储、任务调度和运行支撑只能服务架构规则。 |

### 9.3 依赖倒置结论

| 需要倒置的依赖 | 倒置方式 | 保护目标 |
|---|---|---|
| `L1-identity` actor / member anchor | 核心只接收 actor / member refs、身份锚点和 safe summary;解析与刷新经外部接缝进入 | 防止身份生命周期、role truth 或 actor 正文进入 sandbox truth |
| `L1-work` project / work / context refs | 核心只接收 project / work / context refs 和责任语境摘要 | 防止 Project、WorkItem、ImplementationPlan 或工作事实进入 sandbox |
| `L2-tools` 工具语义 / ToolPolicy / ToolInvocationResult | tools 通过受控执行请求或 policy summary 接缝进入;结果只作为下游消费或材料交接 | 防止工具语义、工具结果和工具审计替代 sandbox capture / policy truth |
| `L2-runtime` ExecutionInstance / recover | runtime 通过调度 / 消费边界进入,只能消费 sandbox feedback 与材料 | 防止 ExecutionInstance、agent loop、step progression 或 recover 定义 sandbox failure / cleanup |
| `L2-member-service` host / SandboxBinding | member-service 通过 binding / execute feedback 接缝协作 | 防止 MemberExecutionHost、SandboxBinding 装配结果或 host lifecycle 定义 sandbox truth |
| `L5-runner` RunnerRun / UI / preview | runner 通过正式受控执行边界消费,output preview 只作为下游消费 | 防止产品入口和 UI 状态形成第二套 sandbox 语义 |
| `L1-governance` / `L3-capability-hub` / `L2-tools` policy sources | 核心只接收给定 launch / isolation policy、authorization、approval 或 capability summary | 防止 policy definition、approval、allowlist、capability 或 policy DSL 迁移到 sandbox |
| `L1-artifact` artifact / evidence / retention | artifact 只消费 captured output、candidate material 和 handoff refs | 防止 Artifact baseline、evidence 或 retention truth 反写 sandbox capture / cleanup |
| `L4-observability` audit / trace / metrics | observability 只消费 usage、audit、trace、metric、failure、cleanup 和 redline material | 防止 observability store、metric、trace 或 alert 替代 truth / material 状态承载 |
| `L0-bus` event collaboration | 事件协作通过正式发布 / 消费边界承接 | 防止 event topic、outbox、relay 或 consumer state 定义核心语义 |
| isolation backend / storage / runtime infrastructure | 作为技术承载和基础设施依赖,服从核心边界与 fail-closed 规则 | 防止 Docker/gVisor/Firecracker/k8s/local_process、DB、object store、secrets、GRC 产品定义 sandbox 语义 |

### 9.4 按架构单元组织的依赖规则表

| 架构单元 | 允许依赖谁 | 禁止依赖谁 | 外部接入方式 | 停审结果 |
|---|---|---|---|---|
| `Sandbox 核心语义角色` | `L0-core` 共享契约;本仓内部 execution isolation 规则 | 任意相邻仓源码;运行期对象;事件主题;数据库 / 对象存储 / OTel / SDK;Docker/gVisor/k8s/local_process;artifact / observability / policy truth | 不直接接入外部;由编排 / 承接角色提供已收束输入 | pass |
| `Sandbox 编排 / 承接角色` | 核心语义角色;外部能力接缝;技术承载契约;派生规则 | 绕过核心写 truth store;从派生材料反推核心;把外部正文原文变成 truth;把运行期依赖写成源码依赖 | 同步入口、异步控制、受控执行、后台维护和材料交接均经正式边界 | pass |
| `外部能力接缝角色` | 编排 / 承接角色;正式运行期 / 事件 / 材料协作边界 | 核心存储私有结构;核心状态私有规则;相邻仓私有实现;协议 / SDK 私有状态 | ref / summary / policy input / signal / handoff / infrastructure binding | pass |
| `本地影子 / 派生辅助角色` | 核心 truth;授权范围;正式派生规则;handoff / event / observability 交接边界 | 新建 / 覆盖 / 关闭 sandbox truth;生成外部 truth;反写 policy、artifact、runtime、work 或 identity truth | refs、summaries、projections、handoff pointers、inspect / preview / trend material | pass |
| `技术承载角色` | 正式承载契约;核心定义的状态、材料、控制事实和派生规则 | 业务状态定义权;policy 语义;failure / cleanup 分类;artifact retention;observability store truth;backend 产品生命周期 | state store、isolation backend、event collaboration、material store、cleanup scheduler 作为后续技术候选 | pass |

### 9.5 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L4-sandbox` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享 ID、typed refs、actor / context、trace、error、metadata 和安全材料是 sandbox 跨仓表达前置。 |
| `L0-bus` | `L4-sandbox` 按需发布 sandbox 事件;全局事件协作主干 | 协作方 | 事件协作 | 是 | sandbox 状态、失败、控制、cleanup、redline 和材料交接需要协作,但 bus 不承载 sandbox truth。 |
| `L1-identity` | identity 提供 actor / member anchor;不反向依赖 L2+ | 依赖方 | 运行期 | 是 | 执行环境身份和责任链需要身份锚点,identity truth 不归 sandbox。 |
| `L1-work` | work 提供 project / work / context refs;work 发布工作事件 | 依赖方 | 运行期 | 是 | 受控执行需要工作语境引用,Project / WorkItem / ImplementationPlan 正文不归 sandbox。 |
| `L1-governance` | governance 发布 Gate / Policy 事件并提供治理边界 | 依赖方 / 协作方 | 运行期 / 事件协作 | 是 | 高风险执行需要 authorization / approval / policy 前提,治理决策 truth 不归 sandbox。 |
| `L3-capability-hub` | capability-hub 管能力注册与治理 | 依赖方 / 协作方 | 运行期 / 事件协作 | 是 | capability / provider 能力摘要可作为 policy 或承载前提,能力注册 truth 不归 sandbox。 |
| `L2-tools` | tools 消费 sandbox 执行能力;tools 拥有工具定义、策略和结果 | 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | governed / restricted tool 需要隔离执行与边界反馈,但 ToolPolicy、ToolInvocationResult 和 ToolAuditEntry 不归 sandbox。 |
| `L2-runtime` | runtime 消费 tools / sandbox / member-service 执行能力 | 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | runtime 调度 sandbox 并消费反馈材料,ExecutionInstance / recover truth 不归 sandbox。 |
| `L2-member-service` | member-service 消费 L4 sandbox 和容器运行时 | 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | 成员宿主受限动作需要 sandbox bind / execute 材料,SandboxBinding 装配 truth 不归 sandbox。 |
| `L5-runner` | runner 通过正式边界消费 `L4-sandbox` | 被依赖方 | 运行期 | 是 | Runner 应用或 AI 产物运行需要统一 sandbox 语义,RunnerRun / UI truth 不归 sandbox。 |
| `L1-artifact` | artifact 按需消费 sandbox captured output / candidate material | 被依赖方 / 协作方 | 运行期 / 事件协作 / 材料交接 | 是 | captured output、candidate material 和 handoff refs 需要进入制品消费边界,formal artifact truth 不归 sandbox。 |
| `L4-observability` | observability 消费 tap / audit material | 被依赖方 / 协作方 | 事件协作 / 材料交接 | 是 | audit / trace / metric / failure / cleanup / redline material 需要可观测消费,observability store 不反写真相。 |
| 容器 / k8s / isolation backend | `L4-sandbox` 运行期依赖容器 / k8s / isolation backend | 依赖方 | 运行期 / 基础设施依赖 | 是 | 真实进程、文件系统、网络、资源和生命周期控制需要外部承载,但后端产品不拥有 sandbox truth。 |
| `L0-sdk` | SDK 运行期封装 L1 / L2 / L3 / L4 API | 被依赖方 / 访问包装 | 运行期 | 否 | SDK 可作为后续访问包装,但不进入核心依赖主链,更不能成为编译期依赖结论。 |
| `L5-console` / `L5-chat` / `L5-sync` / 其他 L5 产品 | L5 经 SDK / API 消费 L1~L4 能力 | 被依赖方 | 运行期 | 否 | 当前 sandbox 主链只展开 `L5-runner`;其他产品入口通过 SDK 或正式边界消费,不逐个纳入。 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力 | 协作线索 | 运行期 / 事件协作 | 否 | sandbox 当前只形成材料和清理交接;归档包、retention 和恢复不进入 Step 7 主链。 |
| `L2-member-images` | member-images 构建资产 | 协作线索 | 运行期 | 否 | 镜像构建和供应链资产不是 sandbox execution isolation truth。 |
| Docker / gVisor / Firecracker / containerd / runc / Kubernetes 产品 | 旧文档实现候选或基础设施候选 | 非正式跨仓项目 | 运行期 / 基础设施依赖 | 否 | 后续技术选型、配置或实施候选;本步只表达抽象 isolation backend。 |
| PostgreSQL / object store / OTel / secrets / external GRC / operator console | 旧文档或未来实现候选 | 非正式跨仓项目 | 运行期 | 否 | 属于技术选型、配置、观测、治理或产品体验候选,不进入跨仓依赖主链。 |

### 9.6 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、typed refs、actor / context、trace、error、metadata、安全材料和跨仓契约基础 | `03-详细设计.md`;`07-实施计划.md` |
| 事件协作依赖 | `L0-bus` | 发布 / 消费 sandbox status、failure、control、cleanup、redline、handoff 和观测协作信号 | `01` Step 9;`03-详细设计.md`;`05-测试方案.md` |
| 运行期依赖 | `L1-identity`;`L1-work` | 读取 actor / member / project / work / context refs 或 safe summary | `01` Step 8 / Step 9;`03-详细设计.md` |
| 运行期 / 事件协作依赖 | `L1-governance`;`L3-capability-hub`;`L2-tools` policy sources | 接收给定 launch / isolation policy、authorization、approval、capability 或 ToolPolicy 摘要 | `01` Step 9;`03-详细设计.md`;`04-配置设计.md` |
| 运行期 / 基础设施依赖 | 容器 / k8s / isolation backend | 建立真实隔离执行环境,落实 resource / filesystem / network / process boundary 和生命周期控制 | `01` Step 10;`04-配置设计.md`;`07-实施计划.md` |
| 运行期 / 事件协作依赖 | `L2-tools`;`L2-runtime`;`L2-member-service`;`L5-runner` | 提供统一 sandbox 执行能力、边界反馈、失败 / cleanup 材料和材料交接 | `01` Step 9;`02-概要设计.md`;`03-详细设计.md` |
| 运行期 / 事件协作 / 材料交接依赖 | `L1-artifact` | 交接 captured output、candidate material、handoff refs 和 capture-failure 材料 | `01` Step 8 / Step 9;`03-详细设计.md` |
| 事件协作 / 材料交接依赖 | `L4-observability` | 交接 usage、audit、trace、metric、failure、cleanup、redline material | `01` Step 9 / Step 12;`05-测试方案.md` |
| 运行期访问包装 | `L0-sdk`;L5 产品入口 | 后续可能作为访问和产品消费边界,不得反向定义核心 | `01` Step 9;`02-概要设计.md` 按需裁剪 |

### 9.7 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L4-sandbox -> L2-tools` 源码 / package dependency | 工具语义、ToolPolicy、ToolInvocationResult 和 ToolAuditEntry 不归 sandbox;运行期消费不能写成源码依赖。 | tools 通过正式受控执行请求、policy summary、handoff material 和事件协作边界协作。 |
| `L4-sandbox -> L2-runtime` 源码 / package dependency | runtime ExecutionInstance、agent loop、recover 和 result backflow truth 不归 sandbox。 | runtime 作为调用方 / 消费方,通过运行期边界消费 sandbox feedback 与材料。 |
| `L4-sandbox -> L2-member-service` 源码 / package dependency | member host lifecycle、SandboxBinding 装配 truth 和 callback material 不归 sandbox。 | member-service 通过 bind / execute / feedback 接缝消费 sandbox 能力。 |
| `L4-sandbox -> L1-identity` / `L1-work` 正文或源码依赖 | 身份和工作正文 truth 不归 sandbox,直接依赖会造成 truth 混层。 | 只保存 typed refs、safe summary 和缺失 / stale 语义。 |
| `L4-sandbox -> L1-governance` / `L3-capability-hub` policy truth 依赖 | policy definition、approval、capability 和 allowlist truth 不归 sandbox。 | 只接收给定 policy / authorization / capability summary,缺失时 fail closed。 |
| `L4-sandbox -> L1-artifact` truth store 依赖 | artifact 正文、baseline、evidence 和 retention truth 不归 sandbox。 | 通过 captured output、candidate material、handoff refs 和 pending / failed 交接协作。 |
| `L4-sandbox -> L4-observability` store 依赖 | observability store、metric、trace 和 alert stream 不能替代 sandbox truth。 | 通过 material handoff 和 event collaboration 交接观测材料。 |
| `Sandbox 核心语义角色 -> isolation backend 产品 API` | 后端产品能力不能定义 coherent boundary 或 policy / cleanup 语义。 | 核心只定义边界和 fail-closed 规则,技术承载角色适配后端。 |
| `Sandbox 核心语义角色 -> L0-bus / event topic` | event topic / outbox 机制不能定义核心状态和失败语义。 | 编排 / 承接角色根据核心 truth 生成事件协作材料。 |
| `本地影子 / 派生辅助角色 -> Sandbox 核心语义角色` 写依赖 | inspect / preview / trend / projection 反写会形成第二 truth。 | 派生辅助只能读取核心 truth 与材料交接,通过正式命令 / 控制边界变更。 |
| `技术承载角色 -> Sandbox 核心语义角色` 反向定义 | 存储、缓存、后端、调度或配置不应决定业务不变量。 | 技术承载服从核心定义的状态、材料、控制和承载契约。 |

### 9.8 依赖裁剪图: L4-sandbox

```text
+------------------+
|     L0-core     |
+--------+---------+
         |
         | [compile]
         v
+==============================================================+
|                         L4-sandbox                           |
| controlled execution isolation truth                         |
+==+===============+================+======================+===+
   ^               ^                ^                      |
   | [runtime]     | [runtime]      | [runtime]            | [event]
   |               |                |                      v
identity / work    policy sources   isolation backend      L0-bus
refs               governance /     container / k8s        sandbox events
                   capability /
                   tools policy

+==============================================================+
|                         L4-sandbox                           |
+==+===============+================+======================+===+
   | [runtime]     | [runtime]      | [runtime/event]      | [event]
   v               v                v                      v
L2-tools       L2-runtime       L1-artifact             L4-observability
L2-member      L5-runner        captured material       audit / trace /
service                        handoff refs            metric material
```

图示说明:

- 本图只展示 `L4-sandbox` 相关依赖边,不展示全 27 仓。
- `[compile]` 仅出现在 `L0-core -> L4-sandbox`;其他运行期、事件协作和材料交接关系不得写成 package dependency。
- identity / work、policy sources 和 isolation backend 是输入 / 基础设施侧依赖,不能反向拥有 sandbox truth。
- tools、runtime、member-service、runner、artifact 和 observability 是消费 / 协作侧关系,不能形成第二套 sandbox 语义。

### 9.9 依赖方向停审记录

| 架构单元 | 层级是否清楚 | 禁止依赖是否明确 | 运行期 / 事件协作是否未误写 package dependency | 是否误用 adapter / repository 名词 | 停审结论 |
|---|---|---|---|---|---|
| `Sandbox 核心语义角色` | pass | pass | pass | pass | pass |
| `Sandbox 编排 / 承接角色` | pass | pass | pass | pass | pass |
| `外部能力接缝角色` | pass | pass | pass | pass | pass |
| `本地影子 / 派生辅助角色` | pass | pass | pass | pass | pass |
| `技术承载角色` | pass | pass | pass | pass | pass |
| 跨仓依赖裁剪 | pass | pass | pass | pass | pass |

### 9.10 跨依赖边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在反向依赖 | pass | 外部来源、调用方、下游消费、事件协作、后端产品和技术承载均不得反向定义核心语义。 |
| 是否存在运行期通信误写 package dependency | pass | 只有 `L0-core` 是编译期依赖;`L0-bus`、identity / work、policy sources、calling consumers、artifact、observability 和 backend 均非 package dependency。 |
| 是否存在跨仓依赖裁剪不一致 | pass | 裁剪表与全局规则中 `L4-sandbox` 的 `L0-core` 编译期、isolation backend 运行期和 sandbox events 事件协作一致,并补充需求确认的上下游协作边界。 |
| 是否存在 dependency graph 画成代码调用链 | pass | 依赖方向图只使用架构责任层 / 依赖角色,未写 API、application、domain、infra、handler、repository、adapter 或 module。 |
| 是否存在运行单元混入依赖层 | pass | Step 6 的同步入口、异步消费、执行承接、后台维护等已转译为编排 / 承接和技术承载角色,未直接画成依赖图节点。 |
| 是否存在后端产品反向定义边界 | pass | Docker/gVisor/Firecracker/k8s/local_process 均未进入正式依赖主链。 |
| 是否存在 policy truth 被 sandbox 吞并 | pass | policy definition / approval / allowlist / capability truth 只作为外部来源摘要进入,缺失时 fail closed。 |
| 是否存在 artifact / observability truth 混入 | pass | artifact 和 observability 只消费材料或事件协作,不得替代 truth / material 状态承载。 |
| 是否存在后续概要设计承接风险 | pass | 已明确后续 `02/03` 可映射为组成部分和 port,但不得继承旧接口名为架构事实。 |

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` §8 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 8. 依赖方向与层间约束

> 校准来源:
> - `design-calibration/01_arch_step_07_dependency_direction.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“依赖方向停审记录”和“跨依赖边界审计表”小节,了解本章如何从职责边界、系统上下文、限界上下文和容器 / 部署架构收敛出依赖保护规则。

`L4-sandbox` 的依赖方向按架构责任层 / 依赖角色划分,不是按源码目录、运行单元、接口协议或后端产品划分。正式依赖角色包括 `Sandbox 核心语义角色`、`Sandbox 编排 / 承接角色`、`外部能力接缝角色`、`本地影子 / 派生辅助角色` 和 `技术承载角色`。

依赖方向遵循外层依赖内层、接缝依赖正式边界、派生依赖核心 truth、技术承载服从正式承载契约。`Sandbox 核心语义角色` 只依赖 `L0-core` 共享契约和本仓内部 execution isolation 规则,不得直接依赖调用方业务 truth、policy definition、artifact truth、observability store、event topic、数据库产品、isolation backend 产品或 UI / SDK 私有状态。

跨仓依赖裁剪结论为:`L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作依赖;identity / work、policy sources、isolation backend、tools、runtime、member-service、runner、artifact 和 observability 均按运行期、事件协作、材料交接或基础设施依赖处理,不得写成 package dependency。

### 8.1 依赖方向图

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §9.1。

### 8.2 层间约束表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §9.2。

### 8.3 跨仓依赖裁剪

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §9.5~§9.8。
```

---

## 11. 待确认事项

本步不新增阻塞 Step 8 的上游 blocker。下列事项继续挂入后续 Step,不得在依赖方向章节提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-SBX-ARCH7-001 | `L1-governance`、`L3-capability-hub`、`L2-tools` 等 policy sources 在不同调用方场景下的具体接缝矩阵 | 后续 Step 9 / `03-详细设计.md` 收敛;当前只固定依赖倒置和 fail-closed。 |
| Q-SBX-ARCH7-002 | isolation backend 产品组合、capability summary schema、test-only 后端和配置开关 | 后续 Step 10 / 04 / 07 收敛;当前只固定抽象技术承载边界。 |
| Q-SBX-ARCH7-003 | `L0-bus` 事件种类、topic、payload、outbox、consumer group 和传播时机 | 后续 Step 9 / `03-详细设计.md` / 04 收敛;当前只固定事件协作依赖类型。 |
| Q-SBX-ARCH7-004 | captured output / candidate material / observability material 的 handoff ack、pending、failed 和 retry 细则 | 后续 Step 8 / Step 9 / `03-详细设计.md` 收敛;当前只固定 artifact / observability 不反写真相。 |
| Q-SBX-ARCH7-005 | SDK、console、archive、sync 等外围消费是否进入当前实施主线 | 后续 Step 13 / Step 14 / 07 收敛;当前从 Step 7 主链裁剪。 |

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答 Step 7 SOP 问题 | pass | 见 §5.1~§5.11。 |
| 是否明确内部架构责任层 / 依赖角色 | pass | §5.1 和 §9.1 已定义五类正式依赖角色。 |
| 是否明确允许与禁止依赖方向 | pass | §9.2、§9.4 和 §9.7 已收敛允许依赖与禁止依赖。 |
| 是否明确依赖倒置边界 | pass | §9.3 已逐项说明外部来源、调用方、下游、事件和技术承载的倒置方式。 |
| 是否完成本仓依赖裁剪表、分类表和禁止依赖表 | pass | §9.5~§9.7 已完成。 |
| 是否完成依赖裁剪图且标注 `[compile]` / `[runtime]` / `[event]` | pass | §9.8 已完成。 |
| 是否按架构单元完成停审 | pass | §9.9 已逐项通过。 |
| 跨依赖边界审计是否存在 unresolved 冲突 | pass | §9.10 未发现反向依赖、依赖类型误判或旧实现名污染。 |
| 是否避免写入接口协议、数据库、DTO、事件 payload、代码目录和技术产品 | pass | 本步只保留架构依赖方向和跨仓裁剪。 |
| 是否发现阻塞 Step 8 的上游 blocker | pass | 未发现阻塞 Step 8 的上游 blocker;`04` / `07` 缺失仍为 downstream blocker。 |
| 是否允许进入 Step 8 | pass_wait_review | 本步完成后等待用户审查;用户确认后才能启动 Step 8 `数据所有权与一致性策略`。 |

进入下一步条件:

```text
已明确 L4-sandbox 的依赖角色、允许依赖、禁止依赖、依赖倒置和跨仓依赖裁剪。
已明确只有 L0-core 是编译期依赖;L0-bus、identity / work、policy sources、isolation backend、tools、runtime、member-service、runner、artifact 和 observability 均不得写成 package dependency。
已明确旧 SDK、Docker/gVisor/local_process、capability-hub allowlist、observability event adapter 和 api/application/domain/infra 图只作 historical material。
正式 `01-架构设计.md` 仍不得修改;用户确认 Step 7 后,才允许启动 Step 8 `数据所有权与一致性策略`。
```
