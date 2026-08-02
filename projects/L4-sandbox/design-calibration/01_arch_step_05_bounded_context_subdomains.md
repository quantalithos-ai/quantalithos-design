# Step 5. 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 回填章节: `01-架构设计.md` §6 限界上下文与子域划分
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 5 | pass。用户已确认 Step 4 `系统边界与上下文`,可进入 Step 5。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_01_requirement_baseline.md`、`01_arch_step_02_goals_constraints.md`、`01_arch_step_03_responsibility_boundary.md` 和 `01_arch_step_04_system_context.md`。 |
| 是否已读取架构 SOP Step 5 与书写规范 §4.6 | pass。已读取核心子域、支撑子域、本地索引 / 投影 / 引用、上下文关系图、逐上下文停审和跨上下文审计要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的核心能力、功能需求、业务规则、数据归属、接口依赖、NFR、验收和风险章节。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_05_bounded_context_subdomains.md` 和 `projects/L1-governance/design-calibration/01_arch_step_05_bounded_context_subdomains.md` 的组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_05_bounded_context_subdomains.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

说明 `L4-sandbox` 内部语义结构如何划分:哪些是核心子域,哪些是围绕核心隔离事实存在的支撑子域,哪些只是为稳定消费外部上下文而保留的本地索引 / 投影 / 引用。本步只讨论内部语义结构和统一语言,不写对象字段、数据库表、代码目录、函数接口、容器部署、技术选型、事件名、协议 schema、运行顺序或实现组件。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 承接 sandbox 做 / 不做、易混淆职责、边界红线和不拥有相邻仓 truth 的口径。 |
| `01_arch_step_04_system_context.md` | 已完成并经用户确认 | 承接正式上下文对象、输入 / 输出面、抽象 isolation backend、material / observability consumer 和依赖失效降级口径。 |
| `projects/L4-sandbox/00-需求文档.md` §7 / §9 / §10 / §11 / §12 / §14 / §15 | 当前正式需求基线 | 承接 `C-SBX-1~5`、`FR-SBX-001~018`、`BR-SBX-001~033`、数据归属、接口依赖、验收否决和风险。 |
| `00_req_step_07_core_capability_loop.md` | 已完成 | 提供五个核心能力闭环节点,用于判断核心子域是否完整。 |
| `00_req_step_09_functional_requirements.md` | 已完成 | 提供核心功能需求分组,用于防止子域遗漏受理、隔离、policy、capture、failure / cleanup 主线。 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提供 truth / snapshot / ref / forbidden body 边界,用于区分核心子域、支撑子域和本地影子结构。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §5 | historical material | 诊断旧 Execution / Isolation Backend / Policy Gate / Audit 和 Sandbox API / Backends / Limits / Audit 是否污染 Step 5。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧 Docker/gVisor、默认无出网、Policy allowlist、audit event 和目录结构是否被误写成子域。 |
| `L1-artifact` / `L1-governance` Step 5 示例 | 已参考 | 只参考“核心语义子域 + 支撑上下文 + 本地影子层 + 停审”的粒度。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 1~4、正式 00、SOP Step 5 和书写规范 §4.6 | done | 本文件 §1、§3 |
| 回答本仓内部子域、核心子域、支撑子域、本地影子结构、上下文映射和不能混合的问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中子域和上下文污染点 | done | 本文件 §6 |
| 选择按 `C-SBX-1~5` 核心闭环划分核心子域,并把后端、policy 来源、下游消费和外围增强放入支撑 / 本地影子层 | done | 本文件 §8 |
| 输出子域 / 上下文划分表、上下文关系图、本地影子边界、统一语言、停审记录和跨上下文审计 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 5 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 本仓内部有哪些子域或本地上下文?

`L4-sandbox` 的内部语义结构围绕“受控执行隔离事实”展开,分为三层:

| 层级 | 上下文 |
|---|---|
| 核心子域 | `正式受控执行语境核心`;`隔离环境边界核心`;`策略执行裁定核心`;`输出捕获与材料交接核心`;`失败控制与安全收束核心` |
| 支撑子域 | `调用方接入语义上下文`;`后端能力可落实性上下文`;`policy 来源承接上下文`;`下游材料消费协调上下文`;`后台维护与调查协作上下文`;`外围增强与能力比较上下文` |
| 本地索引 / 投影 / 引用 | `身份与工作语境引用`;`调用方请求与运行入口引用`;`policy / authorization 摘要引用`;`backend capability 与 workspace 引用`;`capture / handoff 下游引用`;`安全交接与调查状态摘要`;`观测 / 事件协作投影`;`inspect / preview / trend 派生材料` |

### 5.2 哪些是核心子域?

核心子域必须直接承载 `C-SBX-1~5` 的 execution isolation truth 主线。缺少任一项,本仓都会退化成普通命令执行器、后端适配层、policy 网关、日志发射器或运维清理脚本。

| 核心子域 | 判断 |
|---|---|
| `正式受控执行语境核心` | 承载受控执行请求正式受理、拒绝归责、execution environment identity 和责任链绑定语义,对应 `C-SBX-1`。 |
| `隔离环境边界核心` | 承载正式隔离环境建立、边界限制施加、限制可落实性和拒绝建立语义,对应 `C-SBX-2`。 |
| `策略执行裁定核心` | 承载给定 launch / isolation policy 下的接受、拒绝、越权阻断、缺失冲突和 fail-closed 语义,对应 `C-SBX-3`。 |
| `输出捕获与材料交接核心` | 承载执行输出、候选材料、usage / audit / observability material、capture-failure 和显式 handoff 语义,对应 `C-SBX-4`。 |
| `失败控制与安全收束核心` | 承载 timeout、deny、kill、cancel、backend failure、lease / orphan、cleanup guard、reaper 和 redline containment 语义,对应 `C-SBX-5`。 |

`isolation backend`、`Sandbox API`、`Policy Gate`、`Audit` 和 `Backends` 不作为核心子域名。它们要么是运行承载 / 技术候选,要么是接口 / 实现组织,要么是本仓核心语义的一部分表达,不能替代本仓的语义核心。

### 5.3 哪些是支撑子域?

支撑子域围绕五个核心子域存在,帮助核心 truth 与调用方、承载、policy 来源、下游消费、维护调查和外围增强发生稳定关系,但不独立拥有中心 truth。

| 支撑子域 | 判断 |
|---|---|
| `调用方接入语义上下文` | 支撑 tools、runtime、member-service、runner 等调用方进入同一套 sandbox 语义,但不拥有调用方业务、工具或运行 truth。 |
| `后端能力可落实性上下文` | 支撑隔离边界核心判断 backend 能力、workspace 来源和边界限制能否真实落实,但不拥有 Docker/gVisor/Firecracker/k8s 等后端产品 truth。 |
| `policy 来源承接上下文` | 支撑策略执行裁定核心消费外部 policy / authorization 摘要和来源引用,但不拥有 policy definition、approval、allowlist、capability 或 DSL truth。 |
| `下游材料消费协调上下文` | 支撑输出、候选材料和观测材料向 artifact、runtime、runner、observability 和 bus 显式交接,但不拥有下游正式 truth。 |
| `后台维护与调查协作上下文` | 支撑 lease 巡检、orphan 发现、cleanup guard、redline 调查交接和安全保守回收,但不拥有调查生命周期、artifact retention 或 operator UI truth。 |
| `外围增强与能力比较上下文` | 支撑风险分层承载、inspect / replay、输出预览、后端能力比较、多宿主调度和趋势分析,但不得成为核心闭环成立前置或反写核心 truth。 |

### 5.4 哪些只是外部上下文的本地索引 / 投影 / 引用?

以下结构只能作为本地影子层存在,服务判断、追溯、交接、降级和查询,不能变成核心子域或外部 truth 的替代品。

| 本地影子结构 | 边界 |
|---|---|
| `身份与工作语境引用` | 只保存 actor / member / project / work / context refs 或 safe summary,不拥有 identity / work 正文或生命周期。 |
| `调用方请求与运行入口引用` | 只保存 tools / runtime / member-service / runner 入口来源、request refs 和调用方摘要,不拥有 ToolInvocation、ExecutionInstance、SandboxBinding 或 RunnerRun truth。 |
| `policy / authorization 摘要引用` | 只保存给定 launch / isolation policy、authorization、approval 或 capability 来源的 ref / summary,不拥有 policy 定义或审批正文。 |
| `backend capability 与 workspace 引用` | 只保存承载能力摘要、carrier refs 和 workspace source refs,不拥有 host、cluster、workspace 正文或后端产品生命周期。 |
| `capture / handoff 下游引用` | 只保存 artifact、runtime、runner、observability 等 handoff refs 和交接状态,不拥有下游 formal truth。 |
| `安全交接与调查状态摘要` | 只保存 cleanup / reaper 判断所需的调查开放状态、安全交接状态或保留要求摘要,不拥有调查 case lifecycle。 |
| `观测 / 事件协作投影` | 只提供 audit、trace、metric、event collaboration 的可消费投影或回指,不拥有 observability store 或 bus truth。 |
| `inspect / preview / trend 派生材料` | 只从核心 truth 和材料交接派生调查、预览、报告和趋势解释,不得成为正式写源或验收证据伪来源。 |

### 5.5 它们之间的上下文映射关系是什么?

`正式受控执行语境核心` 是一次 sandbox truth 成立的入口,它提供执行环境身份、责任链和受理 / 拒绝归责语义。`隔离环境边界核心` 依附于该语境建立正式承载边界,并把 resource / filesystem / network / process 限制作为 coherent boundary 表达。`策略执行裁定核心` 在语境和边界均成立的前提下消费给定 policy,决定继续、拒绝、阻断或 fail closed。`输出捕获与材料交接核心` 在已成立的语境、边界和策略内收束输出、候选材料和观测材料。`失败控制与安全收束核心` 横切所有核心子域,使 deny、timeout、kill、capture failure、cleanup、lease、orphan、reaper 和 redline 不落入调用方私有兜底。

支撑子域围绕核心子域工作:调用方接入语义上下文确保多个调用方不会形成第二套入口;后端能力可落实性上下文保护隔离边界不被后端产品反写;policy 来源承接上下文保护策略定义来源;下游材料消费协调上下文保护 capture / handoff 与下游 truth 分层;后台维护与调查协作上下文保护 cleanup 前材料和安全交接;外围增强与能力比较上下文只读取或派生解释,不改写核心闭环。本地影子层只提供 refs、summaries、projections 和 handoff pointers,不能反向定义核心子域。

### 5.6 为什么这些部分不能混成一个上下文?

这些部分不能混成一个上下文,因为它们的 truth owner、生命周期、失败语义和反写风险不同:

| 不能混合的部分 | 原因 |
|---|---|
| 受控执行语境与 identity / work truth | sandbox 拥有执行环境身份和责任链绑定事实,不拥有 actor、member、project、work 正文或生命周期。 |
| 受控执行语境与调用方请求 truth | 调用方可以发起执行,但 ToolInvocation、ExecutionInstance、SandboxBinding、RunnerRun 不属于 sandbox truth。 |
| 隔离环境边界与 backend 产品 | sandbox 拥有边界建立和限制有效事实,不拥有 Docker/gVisor/Firecracker/k8s/host/cluster 产品 truth。 |
| 隔离边界与 policy 裁定 | 边界描述能否隔离,policy 裁定描述是否允许继续;混合后会把承载能力或网络 gate 当成 policy truth。 |
| 策略执行裁定与 policy definition / approval | sandbox 只执行给定策略并 fail closed,不能生成 allowlist、approval、capability 或 policy DSL truth。 |
| 输出捕获与 Artifact / observability truth | sandbox 拥有 capture、candidate material、observability material 和 handoff fact,不宣布 formal artifact、baseline、evidence 或 observability store truth。 |
| 失败控制与 runtime recover / business failure | sandbox 拥有隔离层失败分类和 control fact,不拥有 runtime recovery、业务重试或工作流推进 truth。 |
| cleanup / reaper 与 artifact retention / investigation lifecycle | sandbox 负责隔离层保守回收和 cleanup guard,长期保留、调查 case 和制品 retention 由下游 truth owner 承接。 |
| 派生预览 / trend 与核心 truth | inspect、preview、trend、report 可滞后、重建或失败,不能创建、覆盖、关闭或证明核心 sandbox truth。 |

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 仓使命 | 写“至少 Docker + gVisor 两种隔离后端”。 | 把后端产品组合误写成核心语义结构。 | 不把 Docker/gVisor/Firecracker 单列为子域;只保留 `后端能力可落实性上下文`。 |
| 核心职责 | 写默认无出网、白名单必须 Policy 授权、审计事件。 | 主题相关,但 allowlist / network gate / audit event 不是限界上下文名。 | policy、capture、observability 和 redline 按核心 / 支撑语义重分层。 |
| 关键依赖 | 写 capability-hub、SDK 和后端产品。 | 会把 policy 来源、SDK 或 backend 误升为内部上下文。 | 只作为本地引用或支撑语义,不进入上下文关系图。 |
| 目录结构 | 写 `backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 目录和模块不是子域。 | 不继承。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| §5.1 子域分类 | 写 Execution、Isolation Backend、Policy Gate、Audit。 | `Isolation Backend` 是承载候选,`Policy Gate` 是实现/策略混合,`Audit` 过窄,整体遗漏 execution identity、capture / handoff、failure / cleanup / redline。 | 改为五个核心语义子域,逐项承接 `C-SBX-1~5`。 |
| §5.2 限界上下文划分 | 写 Sandbox API、Backends、Limits、Audit 和核心对象。 | 这是接口 / adapter / 模块 / 对象清单,不是限界上下文。 | 不继承;后续 Step 6 / 02 / 03 再讨论承载、对象和接口。 |
| §5.3 上下文映射关系 | 直接写 capability-hub、runtime / runner、observability。 | Step 5 关系图不应重画外部系统上下文。 | 外部对象只在本地引用边界和系统上下文中出现,不进入内部关系图。 |
| §5.4 统一语言词汇表 | 写 SandboxExecution、LimitSet、Allowlist、EscapeDetected。 | 退化为对象名 / 事件名 / 字段含义,且 allowlist 可能吞并 policy truth。 | 统一语言改写为架构语义边界词汇,不写对象字段或事件名。 |
| §6 容器图 | 提前写 sandbox-api、orchestrator、limits / policy gate、backend adapter、audit emitter。 | 容器 / 部署和实现组件越过 Step 5。 | 不继承,后续 Step 6 独立重建。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心子域 | Execution / Isolation Backend / Policy Gate / Audit。 | 正式受控执行语境、隔离环境边界、策略执行裁定、输出捕获与材料交接、失败控制与安全收束。 | 对齐 `C-SBX-1~5`,避免后端、接口和事件名污染子域。 |
| 支撑上下文 | 旧文档基本写成 Sandbox API / Backends / Limits / Audit。 | 调用方接入、后端能力可落实性、policy 来源承接、下游材料消费协调、后台维护调查、外围增强。 | 表达围绕核心 truth 的正式支撑结构。 |
| 本地影子层 | 旧文档未集中区分 ref、summary、projection、handoff。 | 单列身份工作、调用方入口、policy、backend、handoff、安全调查、观测事件和派生材料。 | 防止外部 truth 或派生材料反写核心。 |
| 统一语言 | SandboxExecution / LimitSet / Allowlist / EscapeDetected。 | 受控执行语境、执行环境身份、coherent boundary、policy 裁定、capture / handoff、cleanup guard、redline containment 等语义词汇。 | 避免退化为对象清单、字段或事件名。 |
| 外部对象 | capability-hub、runtime / runner、observability 写入上下文映射。 | 外部对象只以引用、摘要、材料交接或系统上下文出现。 | Step 5 只表达本仓内部语义结构。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 Execution / Isolation Backend / Policy Gate / Audit 四分法 | 接近旧文档,表短。 | 后端、policy 来源、audit event 与实现组件混层,遗漏 execution identity、capture / handoff、failure / cleanup / redline。 | 不采用。 |
| 方案 B: 按 `C-SBX-1~5` 建五个核心语义子域 + 支撑上下文 + 本地影子层 | 可追溯到新版需求,能覆盖核心闭环和 truth 边界。 | 表更长,后续概要需要继续细化对象。 | 采用。 |
| 方案 C: 单一 `execution isolation truth` 核心子域 | 最简洁,避免过早划分。 | 无法区分受理、隔离、policy、capture 和 failure / cleanup 的不同生命周期与风险。 | 不采用为主结构。 |
| 方案 D: 把 Sandbox API、Backends、Limits、Audit 作为正式上下文 | 与旧实现组织贴近。 | 这是接口、adapter、模块和审计能力混合,不符合 Step 5 粒度。 | 不采用。 |
| 方案 E: 把 Docker/gVisor/Firecracker、network gate、audit emitter 提升为支撑子域 | 看起来更可落地。 | 会提前锁定 Step 6 / Step 10 / 04 的承载、技术和配置结论。 | 不采用,只保留抽象后端能力和观测材料语义。 |

### 8.1 待确认问题的方案选择

#### 是否把 `Isolation Backend` 作为核心子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 将 `Isolation Backend` 与 Execution 并列为核心子域。 | 会把 Docker/gVisor/Firecracker 等承载产品误读为 sandbox 语义核心。 |
| 方案 B | 核心子域写 `隔离环境边界核心`,后端进入支撑上下文。 | 保留边界 truth,避免后端产品反写语义结构。 |

推荐方案 B。

#### 是否把 `Policy Gate` 作为支撑子域名?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 使用 `Policy Gate` 或 `Allowlist`。 | 会把策略执行、网络 gate、allowlist 来源和实现机制混成一个上下文。 |
| 方案 B | 核心子域写 `策略执行裁定核心`,支撑子域写 `policy 来源承接上下文`。 | 区分 sandbox 的执行裁定和外部 policy truth 来源。 |

推荐方案 B。

#### 是否把 inspect / replay / preview / trend 单列核心或支撑?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 单列为核心子域。 | 会把外围增强提升为核心闭环前置。 |
| 方案 B | 放入 `外围增强与能力比较上下文` 和派生材料层。 | 保留演进空间,但不得反写核心 truth 或阻塞核心闭环。 |

推荐方案 B。

---

## 9. 结构化中间产物

### 9.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 正式受控执行语境核心 | 核心子域 | 承载受控执行正式受理、拒绝归责、执行环境身份和责任链绑定语义。 | 是 sandbox truth 入口,隔离边界、policy、capture 和 failure 都围绕它成立。 |
| 隔离环境边界核心 | 核心子域 | 承载隔离环境建立、资源 / 文件系统 / 网络 / 进程边界和限制可落实性语义。 | 依附于正式受控执行语境,为 policy 执行和输出捕获提供正式承载边界。 |
| 策略执行裁定核心 | 核心子域 | 承载给定 launch / isolation policy 下的接受、拒绝、阻断、缺失冲突和 fail-closed 语义。 | 消费执行语境和隔离边界,不拥有外部 policy definition 或 approval truth。 |
| 输出捕获与材料交接核心 | 核心子域 | 承载执行输出、候选材料、观测材料、capture-failure 和显式 handoff 语义。 | 依附于受控执行、隔离边界和 policy 裁定,并向下游消费协调上下文提供材料。 |
| 失败控制与安全收束核心 | 核心子域 | 承载失败分类、控制动作、lease / orphan、cleanup guard、reaper 和 redline containment 语义。 | 横切所有核心子域,防止非 happy path 由调用方或运维路径私自兜底。 |
| 调用方接入语义上下文 | 支撑子域 | 承载多类调用方进入同一套 sandbox 语义的适配与归并语义。 | 围绕正式受控执行语境核心存在,不拥有调用方请求或业务 truth。 |
| 后端能力可落实性上下文 | 支撑子域 | 承载承载能力摘要、workspace 来源和边界限制能否落实的判断语义。 | 支撑隔离环境边界核心,不拥有后端产品、host、cluster 或 workspace 正文 truth。 |
| policy 来源承接上下文 | 支撑子域 | 承载外部 policy / authorization 摘要进入策略执行裁定的承接语义。 | 支撑策略执行裁定核心,不生成 allowlist、approval、capability 或 policy DSL truth。 |
| 下游材料消费协调上下文 | 支撑子域 | 承载结果、候选材料和观测材料向下游显式交接且不迁移 ownership 的语义。 | 支撑输出捕获与材料交接核心,不拥有 artifact、runtime、runner 或 observability truth。 |
| 后台维护与调查协作上下文 | 支撑子域 | 承载 lease 巡检、orphan 发现、cleanup guard、redline 调查和安全交接协作语义。 | 支撑失败控制与安全收束核心,不拥有调查生命周期、artifact retention 或 operator UI truth。 |
| 外围增强与能力比较上下文 | 支撑子域 | 承载风险分层承载、inspect / replay、输出预览、后端能力比较、多宿主调度和趋势分析语义。 | 只能读取或派生核心 truth,不得成为核心闭环前置或正式写源。 |
| 身份与工作语境引用 | 本地索引 / 投影 / 引用 | 为执行环境身份、责任链和上下文归责提供 actor / member / work refs 或摘要。 | 服务正式受控执行语境核心,不拥有 identity / work 正文 truth。 |
| 调用方请求与运行入口引用 | 本地索引 / 投影 / 引用 | 为 tools、runtime、member-service、runner 等入口提供来源 ref / summary。 | 服务调用方接入语义上下文,不拥有 ToolInvocation、ExecutionInstance、SandboxBinding 或 RunnerRun。 |
| policy / authorization 摘要引用 | 本地索引 / 投影 / 引用 | 为给定 policy、authorization、approval 或 capability 来源提供 ref / summary。 | 服务 policy 来源承接上下文和策略执行裁定核心,不拥有策略定义正文。 |
| backend capability 与 workspace 引用 | 本地索引 / 投影 / 引用 | 为承载能力、carrier 和 workspace source 提供引用或安全摘要。 | 服务后端能力可落实性上下文,不拥有后端、宿主、集群或 workspace 生命周期。 |
| capture / handoff 下游引用 | 本地索引 / 投影 / 引用 | 为结果、候选材料、观测材料交接提供下游 refs 和交接状态。 | 服务下游材料消费协调上下文,不拥有 formal artifact、runtime result、runner state 或 observability store。 |
| 安全交接与调查状态摘要 | 本地索引 / 投影 / 引用 | 为 cleanup / reaper 判断提供调查开放状态、安全交接和材料保留摘要。 | 服务后台维护与调查协作上下文,不拥有 investigation case 或 retention truth。 |
| 观测 / 事件协作投影 | 本地索引 / 投影 / 引用 | 为 audit、trace、metric 和事件协作提供可消费投影或回指。 | 服务材料交接和维护调查,不拥有 observability store 或 bus truth。 |
| inspect / preview / trend 派生材料 | 本地索引 / 投影 / 引用 | 为外围调查、输出预览、能力比较、报告和趋势解释提供可重建材料。 | 服务外围增强与能力比较上下文,不得成为核心 truth 或验收签署来源。 |

### 9.2 上下文关系图

```text
+---------------------------+
| 正式受控执行语境核心        |
+-------------+-------------+
              |
              v
+---------------------------+   +---------------------------+
| 隔离环境边界核心            |-->| 策略执行裁定核心            |
+-------------+-------------+   +-------------+-------------+
              |                               |
              +---------------+---------------+
                              |
                              v
+---------------------------+   +---------------------------+
| 输出捕获与材料交接核心      |-->| 失败控制与安全收束核心      |
+-------------+-------------+   +-------------+-------------+
              |                               |
              +---------------+---------------+
                              |
                              v
+-----------------------------------------------------------+
|                         支撑子域层                         |
+-------------+-------------+-------------+-----------------+
| 调用方接入   | 后端能力落实 | policy 承接 | 材料消费 / 维护调查 |
| 外围增强与能力比较                                         |
+-------------+-------------+-------------+-----------------+
                              |
                              v
+-----------------------------------------------------------+
|                  本地索引 / 投影 / 引用层                  |
| 身份工作引用 | 调用方入口引用 | policy 摘要 | backend/workspace 引用 |
| handoff 引用 | 安全调查摘要   | 观测事件投影 | inspect/preview/trend |
+-----------------------------------------------------------+
```

该图只表达 `L4-sandbox` 内部语义结构,不表达外部仓、角色、接口、事件、数据库、容器、代码模块、技术产品或运行顺序。

图示说明:

- 五个核心子域共同构成 execution isolation truth 主线,分别承载受理语境、隔离边界、policy 裁定、capture / handoff 和 failure / cleanup / redline。
- 支撑子域围绕核心 truth 工作,用于连接调用方、后端能力、policy 来源、下游消费、维护调查和外围增强,不能独立生成第二份 sandbox truth。
- 本地索引 / 投影 / 引用层只提供 refs、summaries、projections 和派生材料,不得反向定义核心子域。
- 外围增强、inspect、preview、trend 和后端比较可以滞后或不实现,但不能改变核心闭环的成立条件。

### 9.3 本地索引 / 投影 / 引用边界结论

| 本地结构 | 允许做什么 | 禁止做什么 |
|---|---|---|
| 身份与工作语境引用 | 保存 actor / member / project / work / context 的 typed refs、来源摘要和责任链摘要。 | 不保存 actor、member、project、work 或身份 / 工作生命周期正文。 |
| 调用方请求与运行入口引用 | 保存 tools、runtime、member-service、runner 的入口来源、request refs 和调用方摘要。 | 不创建 ToolInvocationResult、ExecutionInstance、SandboxBinding 装配结果、RunnerRun 或调用方业务 truth。 |
| policy / authorization 摘要引用 | 保存给定 policy、authorization、approval、capability 来源和适用性摘要。 | 不保存 policy DSL、allowlist truth、approval workflow、capability truth 或 tool policy 定义正文。 |
| backend capability 与 workspace 引用 | 保存承载能力摘要、carrier refs、workspace source refs 和限制落实判断所需摘要。 | 不拥有 Docker/gVisor/Firecracker/k8s/host/cluster/workspace 正文或运行生命周期。 |
| capture / handoff 下游引用 | 保存 artifact、runtime、runner、observability 等消费方的 handoff refs、pending / failed 状态和来源回指。 | 不宣布 formal artifact、baseline、evidence、runtime result、runner UI state 或 observability store truth。 |
| 安全交接与调查状态摘要 | 保存 cleanup guard 所需的调查开放、材料保留、安全交接和 redline 状态摘要。 | 不拥有正式 investigation case、artifact retention、operator console、replay UI 或治理裁决 truth。 |
| 观测 / 事件协作投影 | 形成可交接 audit、trace、metric、usage、failure、cleanup 和 redline material 投影。 | 不把事件流、日志、metric、trace store 或 alert stream 当作 sandbox truth 存储。 |
| inspect / preview / trend 派生材料 | 支撑外围调查、预览、趋势、能力比较和容量解释。 | 不作为正式受理、policy、capture、cleanup、redline 或验收签署的写源。 |

### 9.4 统一语言词汇结论

| 术语 | 定义 | 所属上下文 |
|---|---|---|
| 受控执行语境 | 一次真实执行进入 sandbox 前必须具备的正式受理、来源、责任链和最小拒绝前提。 | 正式受控执行语境核心 |
| execution environment identity | sandbox 内部用于归责、追溯和拒绝的一次执行环境身份,不等于 identity 的成员身份 truth。 | 正式受控执行语境核心 |
| coherent boundary | 资源、文件系统、网络、进程、工作区和挂载限制作为一组共同成立的隔离边界。 | 隔离环境边界核心 |
| 限制可落实性 | backend 能否实际落实必需边界限制的正式判断语义,不等于 backend 产品能力 truth。 | 后端能力可落实性上下文 |
| 策略执行裁定 | sandbox 对给定 launch / isolation policy 的接受、拒绝、阻断、缺失、冲突或不支持结论。 | 策略执行裁定核心 |
| fail-closed | policy、授权、后端能力或安全红线不完备时保守拒绝或显式失败的语义。 | 策略执行裁定核心 |
| capture fact | 输出、候选材料、usage / audit / observability material 被 sandbox 正式捕获或捕获失败的事实。 | 输出捕获与材料交接核心 |
| handoff fact | sandbox 将结果、候选材料或观测材料显式交接给下游消费方的事实,不迁移 ownership。 | 输出捕获与材料交接核心 |
| failure classification | timeout、deny、backend failure、capture failure、资源超限等非 happy path 的稳定归类语义。 | 失败控制与安全收束核心 |
| cleanup guard | cleanup / reaper 前必须确认关键材料、调查和安全交接不会被破坏的保护语义。 | 失败控制与安全收束核心 |
| redline containment | escape-like、越权访问或安全红线事件被保守阻断、留痕并交接调查的语义。 | 失败控制与安全收束核心 |
| 本地索引 / 投影 / 引用 | 为判断、追溯、交接、降级或派生消费保留的 ref、summary、projection 或 material,不得成为外部 truth。 | 本地索引 / 投影 / 引用层 |

### 9.5 单上下文停审记录

| 上下文 | 分类是否正确 | 职责是否清楚 | 与系统上下文是否一致 | 是否误写实现结构 |
|---|---|---|---|---|
| 正式受控执行语境核心 | pass | pass | pass | pass |
| 隔离环境边界核心 | pass | pass | pass | pass |
| 策略执行裁定核心 | pass | pass | pass | pass |
| 输出捕获与材料交接核心 | pass | pass | pass | pass |
| 失败控制与安全收束核心 | pass | pass | pass | pass |
| 调用方接入语义上下文 | pass | pass | pass | pass |
| 后端能力可落实性上下文 | pass | pass | pass | pass |
| policy 来源承接上下文 | pass | pass | pass | pass |
| 下游材料消费协调上下文 | pass | pass | pass | pass |
| 后台维护与调查协作上下文 | pass | pass | pass | pass |
| 外围增强与能力比较上下文 | pass | pass | pass | pass |
| 本地索引 / 投影 / 引用层 | pass | pass | pass | pass |

### 9.6 跨上下文语义边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在职责重叠 | pass | failure / cleanup 横切核心闭环,但只收束非 happy path,不替代受理、隔离、policy 或 capture truth。 |
| 是否存在核心子域误归类 | pass | backend 产品、Policy Gate、Audit、Sandbox API、Backends、Limits、inspect / preview / trend 未提升为核心子域。 |
| 是否存在本地投影误作真相 | pass | 调用方 refs、policy 摘要、backend capability、handoff refs、观测事件投影和派生材料均已明确不得反写真相。 |
| 是否存在统一语言冲突 | pass | 受控执行语境、coherent boundary、policy 裁定、capture / handoff、failure classification、cleanup guard、redline containment 均有唯一主所属上下文。 |
| 是否存在外部上下文误入内部图 | pass | identity、work、tools、runtime、member-service、runner、artifact、observability、policy 来源和 backend 只在本地引用或支撑边界中出现。 |
| 是否存在实现结构混入 | pass | 未写 handler、repository、DTO、API path、event payload、database、container、adapter、worker 或代码目录。 |
| 是否保留待确认项 | pass | 后端组合、policy 来源矩阵、handoff ack、事件 payload、inspect / replay 范围和外围增强节奏均后移。 |

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 6. 限界上下文与子域划分

> 校准来源:
> - `design-calibration/01_arch_step_05_bounded_context_subdomains.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“跨上下文语义边界审计表”小节,了解本章如何从职责边界和系统上下文收敛出内部语义结构。

### 6.1 子域 / 上下文划分表

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §9.1。

### 6.2 上下文关系图

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §9.2。

### 6.3 本地索引 / 投影 / 引用边界结论

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §9.3。

### 6.4 统一语言词汇结论

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §9.4。
```

---

## 11. 待确认事项

本步不新增阻塞 Step 6 的待确认事项。下列事项继续挂入后续 Step,不得在限界上下文与子域划分中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-SBX-ARCH5-001 | 具体 isolation backend 组合、允许环境边界、后端 capability 摘要来源和 test-only 路径处理 | 后续 Step 6 / Step 10 / 04 / 07 收敛;当前只设 `后端能力可落实性上下文`。 |
| Q-SBX-ARCH5-002 | policy / authorization 来源在 tools、runtime、member-service、runner 场景下的接缝矩阵 | 后续 Step 9 / 03 收敛;当前只设 `policy 来源承接上下文`。 |
| Q-SBX-ARCH5-003 | capture / handoff ack、pending、failed、retry 和 cleanup guard 的通信形态 | 后续 Step 9 / 03 / 04 收敛;当前只固定材料交接语义。 |
| Q-SBX-ARCH5-004 | `L0-bus` 事件种类、payload、topic、发布时机和观测投影承载 | 后续 Step 9 / 03 / 04 收敛;当前只保留观测 / 事件协作投影边界。 |
| Q-SBX-ARCH5-005 | inspect / replay / operator control、输出预览、趋势和多宿主调度是否进入当前实施主线 | 后续 Step 13 / Step 14 / 07 收敛;当前仍为外围增强。 |

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答 Step 5 SOP 问题 | pass | 见 §5.1~§5.6。 |
| 是否明确本仓内部语义结构层次 | pass | §9.1 已区分核心子域、支撑子域和本地影子层。 |
| 是否区分核心子域、支撑子域和本地索引 / 投影 / 引用 | pass | 五个核心子域、六个支撑子域和八类本地影子结构已分层。 |
| 是否通过关系图解释这些部分如何共同构成整体 | pass | §9.2 已给出上下文关系图和图后说明。 |
| 每个上下文是否完成停审 | pass | §9.5 已逐项通过分类、职责、系统上下文一致性和实现混入检查。 |
| 跨上下文语义边界审计是否存在 unresolved 冲突 | pass | §9.6 未发现职责重叠、误归类、投影反写真相或术语冲突。 |
| 是否把对象清单、代码模块或数据实现写成子域结构 | pass | 未写字段、表、repository、handler、adapter、API、event、数据库或部署。 |
| 是否发现阻塞 Step 6 的上游 blocker | pass | 未发现阻塞 Step 6 的上游 blocker;`04` / `07` 缺失仍为 downstream blocker。 |
| 是否允许进入 Step 6 | pass_wait_review | 本步完成后等待用户审查;用户确认后才能启动 Step 6 `容器 / 部署架构`。 |

本步完成后,`01-架构设计.md` 仍不得改写。下一步若用户确认,应读取本文件、`01_architecture_calibration_flow.md`、正式 `00-需求文档.md`、架构 SOP Step 6、架构书写规范 §4.7,再创建 `01_arch_step_06_container_deployment.md`。
