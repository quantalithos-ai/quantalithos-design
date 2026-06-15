# L3-method-library 01 架构 Step 1: 确认需求基线

> 状态: completed
> 创建日期: 2026-06-14
> 本轮口径: 基于新版 `00-需求文档.md` 重新推导架构,旧 L3-method-library 架构材料只作差异审计。
> 回填位置: `01-架构设计.md` 的上游承接前提、架构目标与约束、需求追溯矩阵。

---

## 0. Step 内计划

| 模块 | 状态 | 产物 | 完成门禁 |
|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | 已读取本 Step 必读输入。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | 已先建骨架,未直接写最终结论。 |
| 需求基线筛选思考 | done | 问题回答 / 诊断 / 取舍 | 已判断哪些需求结论影响架构边界、数据、依赖、通信。 |
| 需求基线筛选写入 | done | 架构需求基线清单 | 基线可回指 00 需求和 00 校准产物。 |
| 架构硬约束思考 | done | 问题回答 / 诊断 / 取舍 | 已区分架构不可改变的规则与后续可选方案。 |
| 架构硬约束写入 | done | 架构硬约束表 | 每条约束有来源、架构含义和禁止漂移。 |
| 未关闭风险思考 | done | 问题回答 / 诊断 / 取舍 | 已区分风险、待确认和当前处理口径。 |
| 未关闭风险写入 | done | 未关闭需求风险表 | 不确定项没有被写成架构事实。 |
| 架构单元停审 | done | 不适用说明 | Step 1 尚未划分架构单元。 |
| 旧材料差异审计 | done | 可保留方向 / 废弃旧口径 | 旧材料未直接继承。 |
| 自检与停审 | done | 自检表 / 待确认事项 | 达到本 Step 门禁,可进入 Step 2。 |

---

## 1. 必读文档

### 1.1 公共规范

| 文档 | 读取结论 |
|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 1 目标是确认架构依赖的需求结论是否足以支撑架构推导,输出架构需求基线、硬约束和未关闭需求风险。 |
| `standards/document/架构设计书写规范.md` | 正式 01 的来源承接章节只写上游来源和收束说明,需求基线清单不直接塞入 4.1 正文,而是支撑后续约束和追溯章节。 |
| `standards/document/设计文档讨论中间产物规范.md` | 当前 Step 必须记录 Step 内计划、问题回答、诊断、取舍、结构化产物、回填草稿和自检。 |
| `/tmp/l3_method_library_01_architecture_discussion_steps.md` | 本轮 01 必须全量重启,旧 `01` 和旧 `02_hld_*` / `03_ddd_*` 只能后置审计。 |

### 1.2 本仓需求输入

| 文档 | 读取结论 |
|---|---|
| `projects/L3-method-library/00-需求文档.md` | 本仓定位是方法资产定义、版本发布与分发语义的真相仓;核心闭环是统一定义和识别、稳定版本、受控消费、追溯一致性。 |
| `projects/L3-method-library/design-calibration/00_requirements_calibration_flow.md` | 00 需求 Step 1~17 已完成,可作为 01 架构输入。 |
| `projects/L3-method-library/design-calibration/00_req_step_07_core_capability_loop.md` | 核心能力闭环为架构单元和关键交互提供第一锚点。 |
| `projects/L3-method-library/design-calibration/00_req_step_11_data_ownership.md` | 真相数据、快照数据、引用数据和禁止保存正文已经分清,可用于后续数据所有权架构推导。 |
| `projects/L3-method-library/design-calibration/00_req_step_12_interfaces_dependencies.md` | 能力接口和依赖边界停留在能力层,不得在架构 Step 1 下沉到 API、DTO、event schema、port 或 adapter。 |
| `projects/L3-method-library/design-calibration/00_req_step_15_risks_open_questions.md` | Qualification / CapabilityDefinition、MethodPlugin / MethodConfiguration、marketplace、AIPolicy override、高级 ViewProfile、governance 强依赖、artifact 核心消费等仍需作为架构风险处理。 |
| `projects/L3-method-library/design-calibration/00_req_step_16_traceability_matrix.md` | FR-ML-001~007 与核心闭环、故事、规则、数据、接口、验收已形成主追溯链;未发现孤儿项。 |

### 1.3 后置审计输入

| 文档 | 读取时机 | 审计用途 |
|---|---|---|
| `projects/L3-method-library/README.md` | Step 1 独立结论形成后 | 识别旧 README 中仍可从新版需求重新推导的方向,以及不应继承的实现 / 技术栈 / 范围扩张。 |
| `projects/L3-method-library/01-架构设计.md` | Step 1 独立结论形成后 | 识别旧 01 中已与新版需求冲突的 P0 资产、同步链、fingerprint、outbox、P95、实现式主链路等口径。 |

---

## 2. 整体模块骨架

Step 1 只做需求到架构的前置筛选,不画上下文图,不划分架构单元,不定义容器或技术方案。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 |
|---|---|---|
| 需求基线筛选 | 哪些 00 需求结论会约束架构边界、数据所有权、依赖方向和一致性策略。 | 不重新写 00 需求,不扩展功能需求清单。 |
| 架构硬约束 | 哪些需求规则不可被后续架构方案改变。 | 不决定具体架构方案、状态机、事件或存储方案。 |
| 未关闭需求风险 | 哪些需求未闭口项会影响架构,当前如何防止误写成事实。 | 不关闭待确认事项,不把外围增强升级为核心前置。 |

---

## 3. 模块思考记录

### 3.1 需求基线筛选

#### 问题回答

当前架构设计依赖的需求结论主要集中在四条主线:

- 本仓是方法资产定义、版本发布与分发语义的真相仓。
- 核心闭环必须覆盖统一定义和识别、稳定版本、受控消费、追溯一致性。
- process、identity、runtime、member-images 是核心下游消费方,但不得拥有方法定义真相。
- 数据归属必须区分 truth、snapshot、reference 和 forbidden body。

#### 诊断

新版 00 已经把旧材料中“7 类 P0 MethodContent”“fingerprint 主链”“下游同步链”“P95 指标”等实现化或旧范围项拆开处理。Step 1 不能继续沿用旧 P0 枚举,而应使用 00 中已经收敛的能力闭环和数据归属作为架构入口。

#### 取舍

采用“能力闭环 + 数据归属 + 依赖边界”作为架构基线,不采用“旧对象清单 + 同步流程 + 技术指标”作为架构基线。这样可以避免旧概要 / 详细设计反向污染 01。

### 3.2 架构硬约束

#### 问题回答

架构不可改变的约束来自 Definition vs Use、正式版本稳定、下游不得反向拥有定义、边界外运行职责不得成为定义前置、运行期 / 事件协作不得写成源码级拥有关系。

#### 诊断

旧架构把 Qualification、capability-hub、artifact、governance、UI、marketplace 等消费或外围关系写得过重,容易让架构把“消费路径”误判成“核心定义前置”。这会破坏新版 00 对核心闭环和外围增强的区分。

#### 取舍

后续架构可以选择不同容器、交互和一致性策略,但不能改变真相归属、依赖方向和禁止正文边界。条件型 governance、artifact、marketplace、console / SDK 均不得升级为核心闭环成立前置。

### 3.3 未关闭需求风险

#### 问题回答

会影响架构但尚未闭口的问题包括 Qualification / CapabilityDefinition 是否入核心、MethodPlugin / MethodConfiguration 是否入 P0、governance 正式化是否强依赖、artifact 是否进入核心消费、下游消费影响回报是否进入 P0 一致性保护。

#### 诊断

这些问题如果在架构层被直接假定为已闭口,后续 Step 5/8/9/12 会产生错误的架构单元、数据所有权和通信方案。尤其是 Qualification、governance 和 artifact 三类最容易把相邻仓真相迁入本仓。

#### 取舍

本 Step 将它们列为未关闭需求风险,并给出当前处理口径。后续架构只能围绕已闭口核心基线展开;如需纳入待确认项,必须回写需求相关 Step,不能在架构局部直接补结论。

---

## 4. 架构单元小循环记录

本 Step 不适用架构单元小循环。

原因: Step 1 只确认需求基线、硬约束和未关闭风险,尚未进入限界上下文、子域或架构单元划分。架构单元小循环从 Step 5 开始正式适用,并在 Step 7/8/9/12/15 继续复用。

---

## 5. 旧材料差异审计

### 5.1 可保留为架构方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| `method-library` 是方法资产中心 | 重新表述为“方法资产定义、版本发布与分发语义的真相仓”。 |
| SPEM、24748-2、42001、ViewProfile 等方法论主题 | 作为方法资产定义主题和来源背景保留,但不直接继承旧对象枚举或 DSL。 |
| process / identity / runtime / member-images 等下游消费关系 | 作为运行期消费边界保留,不写成源码级依赖或同步实现链。 |
| 版本管理、正式发布、审计追溯方向 | 抽象为稳定版本、显式变化和追溯一致性架构基线。 |
| marketplace / package / MethodPlugin / MethodConfiguration | 作为外围增强或候选演进方向保留,不阻塞核心闭环。 |

### 5.2 必须废弃的旧口径

| 旧口径 | 废弃原因 | 后续处理 |
|---|---|---|
| 旧 `01` 将 Qualification 写入 P0 MethodContent 主链 | 新版 00 已把 Qualification / CapabilityDefinition 保持为待确认,不得在架构层直接恢复为核心资产。 | 保留为 Step 14 风险;若纳入需回写 00 Step 9~16。 |
| 旧 `01` 的 `Create Draft -> Submit Review -> Publish -> Generate Fingerprint -> Write Audit Record -> Write Outbox Event -> Export Definition Snapshot -> Downstream Sync` 主链 | 这是概要 / 详细设计或实现流程粒度,不是 Step 1 架构需求基线。 | 后续 Step 9 只可重新讨论关键交互与通信方式,不得继承旧流程名。 |
| 旧 `01` 直接写 fingerprint、outbox、snapshot、cache、PG、对象存储、P95 等 | 技术和实现细节早于架构目标、边界、数据所有权和交互选择。 | 后续 Step 10 或更后续设计重新论证。 |
| 旧 README 直接写 Rust、PostgreSQL、对象存储和目录结构 | 属于实现栈和代码组织,不是架构 Step 1 输入。 | 不进入 Step 1;后续技术选型也需重新论证。 |
| 旧 README 将 marketplace 上架 / 下载写成核心职责 | 新版 00 把 marketplace 交易和生态分发列为外围增强 / 边界外交易流程。 | 仅保留分发语义,交易履约留在 `L6-marketplace`。 |
| 旧 `01` 把 governance / capability-hub / artifact / UI 同步链作为 P0 成功标准 | 新版 00 只把 governance 作为条件型输入、artifact / UI / marketplace 作为候选或外围消费。 | 后续系统上下文和依赖方向重新裁剪。 |

---

## 6. 结构化中间产物

### 6.1 架构需求基线清单

| 基线结论 | 需求来源 | 影响的架构区域 | 稳定性 |
|---|---|---|---|
| `L3-method-library` 是方法资产定义、版本发布与分发语义的真相仓。 | `00-需求文档.md` §2;`00_req_step_02_position_boundary.md` | 职责边界、系统上下文、数据所有权、依赖方向。 | 稳定 |
| 核心能力闭环是统一定义和识别 -> 稳定版本进入正式使用语境 -> 下游按边界消费 -> 变化可追溯并保护消费一致性。 | `00-需求文档.md` §7;`00_req_step_07_core_capability_loop.md` | 架构目标、限界上下文、关键交互、追溯矩阵。 | 稳定 |
| FR-ML-001~007 是核心功能能力,FR-ML-E-001~003 是外围增强能力。 | `00_req_step_09_functional_requirements.md`;`00_req_step_16_traceability_matrix.md` | 架构单元范围、容器边界、演进路线。 | 稳定 |
| Definition vs Use 必须成立,本仓负责定义,相邻仓只能按边界使用、执行、索引或展示。 | BR-ML-003;BR-ML-012~018 | 职责边界、依赖方向、数据所有权、禁止依赖。 | 稳定 |
| 正式方法资产版本语义必须稳定,正式化和版本语义变化必须显式发生。 | BR-ML-004;BR-ML-009;BR-ML-010 | 架构目标、一致性策略、关键交互、审计追溯。 | 稳定 |
| 下游消费仓不得创建、修改或替代方法资产定义作为自身真相。 | BR-ML-005;BR-ML-008 | 系统上下文、依赖裁剪、接口能力边界。 | 稳定 |
| 本仓拥有方法资产定义、身份目录、正式化版本、关系、追溯和分发语义等 truth。 | `00-需求文档.md` §11;`00_req_step_11_data_ownership.md` | 数据所有权、一致性策略、持久化边界。 | 稳定 |
| governance 结论、外部标准、下游消费影响只可作为摘要或引用,不得形成第二真相源。 | `00_req_step_11_data_ownership.md`;BR-ML-019 | 数据所有权、系统上下文、横切审计。 | 稳定但后续需细化摘要 / 引用边界 |
| process、identity、runtime、member-images 是核心下游消费方,但只通过运行期能力边界消费。 | `00_req_step_06_consumers_dependencies.md`;`00_req_step_12_interfaces_dependencies.md` | 系统上下文、依赖方向、关键交互。 | 稳定 |
| `L0-core` 是编译期输入,`L0-bus` 是事件协作边界。 | `00_req_step_06_consumers_dependencies.md`;`00_req_step_12_interfaces_dependencies.md` | 依赖方向、容器 / 交互、技术选型。 | 稳定 |
| 外围增强失效不得拖垮核心闭环。 | NFR-ML-003;BR-ML-E-001 | 架构目标、演进路线、可用性策略。 | 稳定 |
| 架构不得继承旧 API、event、fingerprint、snapshot、outbox、P95、测试脚本、数据库或缓存方案。 | `00_req_step_15_risks_open_questions.md` | 技术选型、交互方式、后续设计边界。 | 稳定 |

### 6.2 架构硬约束表

| 约束 | 来源 | 架构含义 | 禁止的架构漂移 |
|---|---|---|---|
| 方法资产定义真相必须归属本仓。 | BR-ML-001 | 架构必须设置本仓为定义源,下游只能引用、消费或索引。 | 让 process、identity、governance、marketplace、UI 或 artifact 成为定义真相源。 |
| Definition vs Use 必须成立。 | BR-ML-003 | 本仓架构只表达定义源和正式消费边界,不承接运行时执行状态。 | 把流程实例、成员状态、治理执行、UI 渲染或 artifact 正文写成本仓核心能力。 |
| 正式版本语义不得静默变化。 | BR-ML-004;BR-ML-010 | 架构必须保留显式正式化、版本变化和追溯约束。 | 用覆盖更新、隐式同步或下游本地约定改变正式语义。 |
| 未正式化资产不得作为正式消费依据。 | BR-ML-007;BR-ML-009 | 架构必须区分非正式调整语境与正式使用语境。 | 让读取、引用、同步或运行时使用隐式触发正式化。 |
| 下游不得创建、修改或替代方法资产定义真相。 | BR-ML-005 | 下游消费面只能围绕正式引用、快照、索引或读取能力设计。 | 允许消费仓反写定义正文或拥有替代定义。 |
| 运行期 / 事件协作不得写成源码级拥有关系。 | BR-ML-008 | 跨仓依赖必须按编译期、运行期、事件协作分层裁剪。 | 让 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 链接本仓业务实现。 |
| 治理结论只能作为正式化输入或依据引用。 | BR-ML-014;BR-ML-019 | 架构可承接治理结论,但不得承接治理裁决执行或 policy enforce。 | 把 Gate 流程、策略执行结果、治理运行状态写成本仓子域。 |
| artifact/archive 正文不得入仓。 | BR-ML-018;数据归属禁止正文 | 本仓只可定义 work product 语义或保存引用。 | 保存 artifact、证据文件、archive 正文或生命周期状态。 |
| marketplace 交易履约不得入仓。 | BR-ML-016 | 本仓最多提供方法资产定义或分发语义来源。 | 把定价、订单、购买、结算、安装记录写入本仓架构。 |
| 外围增强不得改变核心定义真相边界。 | BR-ML-E-001;NFR-ML-003 | MethodPlugin、MethodConfiguration、marketplace、高级策略变体只能作为后续增强。 | 让外围能力成为核心闭环成立前置。 |

### 6.3 未关闭需求风险表

| 风险 / 待确认主题 | 影响的架构区域 | 当前处理口径 |
|---|---|---|
| Qualification / CapabilityDefinition 是否作为独立核心方法资产进入本轮范围。 | 限界上下文、数据所有权、接口能力、验收追溯。 | 当前不纳入核心架构基线;若纳入必须回写 00 Step 9~16 和后续架构 Step。 |
| MethodPlugin / MethodConfiguration 是否进入当前 P0 主线。 | 架构目标、子域划分、演进路线、数据归属。 | 当前作为外围增强,不得阻塞核心闭环。 |
| marketplace 发现、分发、上架和交易相关语境是否进入当前阶段。 | 系统上下文、依赖方向、交互方式、演进路线。 | 当前只保留分发语义和外围生态发现;交易、履约、安装记录边界外。 |
| AIPolicy override 是否进入当前定义目标。 | 数据所有权、子域划分、策略变体、横切治理。 | 当前只把 AIPolicy 定义主题纳入核心;override 和复杂变体外围挂起。 |
| ViewProfile 高级匹配策略是否进入当前主线。 | UI 边界、交互方式、技术选型、演进路线。 | 当前只把 ViewProfile 定义主题纳入核心;高级匹配和体验优化外围挂起。 |
| 方法资产正式化是否必须消费 `L1-governance` 正式结论。 | 系统上下文、依赖方向、可用性、正式化交互。 | 当前按条件型治理结论依赖处理,不写成强制主链。 |
| 治理正式化结论保存摘要还是仅保存引用。 | 数据所有权、一致性、审计追溯。 | 当前同时保留摘要与引用需求口径,后续数据所有权和详细设计需收束。 |
| `L1-artifact` 是否进入核心下游消费面。 | 系统上下文、数据所有权、关键交互。 | 当前作为外围 / 候选消费关系挂起;artifact 正文和生命周期禁止入仓。 |
| `L0-sdk` / `L5-console` 是否作为当前管理体验 P0 前置。 | 系统上下文、容器、API / 管理入口。 | 当前作为外围消费面挂起,不阻塞核心闭环。 |
| 下游消费影响回报摘要是否进入 P0 一致性保护。 | 一致性策略、事件输入、后台维护、追溯。 | 当前作为一致性保护快照候选,不定义具体回报机制、事件 schema 或存储结构。 |
| 具体 P95 / SLO / 验收执行方式。 | 技术选型、可观测性、测试验收。 | 当前不进入架构 Step 1,由后续 05 / 06 细化。 |

---

## 7. 回填草稿

### 7.1 可回填到 `01-架构设计.md` 的来源承接前提

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/01_arch_step_01_requirement_baseline.md` 的“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解本章架构基线如何从新版需求收敛。

本文基于新版 `00-需求文档.md` 重新推导 `L3-method-library` 架构。架构基线不是旧对象清单、旧同步链或旧技术栈,而是新版需求中已经收敛的方法资产定义真相、稳定版本、受控消费、追溯一致性、数据归属和依赖边界。

### 7.2 可回填到架构约束章节的摘要

`L3-method-library` 的架构设计必须保持 Definition vs Use 分离:本仓负责方法资产定义、版本发布和分发语义,相邻仓只能按边界消费、执行、索引或展示。正式方法资产版本语义不得静默变化;下游不得创建、修改或替代方法资产定义真相;流程运行、成员状态、治理执行、外部能力注册、marketplace 交易、UI 渲染和 artifact/archive 正文不得进入本仓真相范围。

### 7.3 可回填到需求追溯矩阵的摘要

后续架构结论必须至少回指以下需求基线:

- FR-ML-001~002: 统一定义、身份和目录语义。
- FR-ML-003~004: 正式化和版本稳定边界。
- FR-ML-005: 下游按边界受控消费。
- FR-ML-006~007: 追溯能力和消费一致性保护。
- BR-ML-001~021: 真相归属、Definition vs Use、显式变化、相邻仓边界和审计约束。
- Step 11 数据归属: truth / snapshot / reference / forbidden body。
- Step 12 依赖与接口: 能力级接口和跨仓依赖裁剪。

---

## 8. 自检与停审

### 8.1 自检表

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否列出本 Step 必读文档 | 通过 | 已列公共规范、本仓需求输入和后置审计输入。 |
| 是否先搭整体模块再逐模块写入 | 通过 | 第 2 节先给出模块骨架,第 3 节逐模块记录思考。 |
| 是否形成架构需求基线清单 | 通过 | 第 6.1 已输出基线清单。 |
| 是否形成架构硬约束表 | 通过 | 第 6.2 已输出硬约束表。 |
| 是否形成未关闭需求风险表 | 通过 | 第 6.3 已输出风险 / 待确认表。 |
| 是否后置审计旧材料 | 通过 | 第 5 节只在独立结论形成后审计旧 README / 旧 01。 |
| 是否把旧实现细节写成新架构事实 | 通过 | fingerprint、outbox、snapshot、P95、PG、对象存储、目录结构均未进入基线。 |
| 是否提前创建未来 Step 文件 | 通过 | 当前只创建总流程和 Step 1 文件。 |
| 是否可进入 Step 2 | 通过 | Step 1 输出已满足 SOP 门禁。 |

### 8.2 待确认事项

| 待确认事项 | 当前处理 |
|---|---|
| Qualification / CapabilityDefinition 是否入核心 | 不作为 Step 1 架构基线;保留到架构风险与后续需求回写判断。 |
| MethodPlugin / MethodConfiguration 是否入 P0 | 当前作为外围增强,不阻塞核心闭环。 |
| governance 正式化强依赖与摘要 / 引用边界 | 当前作为条件型依赖和数据归属待细化项。 |
| artifact 是否核心消费 | 当前作为外围 / 候选消费关系,正文和生命周期禁止入仓。 |
| 下游消费影响回报摘要机制 | 当前只保留能力和快照候选,不定义机制。 |

### 8.3 进入下一步条件

可以进入 Step 2。

进入 Step 2 前提:

- 架构需求基线清单已经形成。
- 硬约束和普通设计选择已经分开。
- 未关闭需求风险没有被写成架构事实。
- 旧材料差异审计已经完成,且旧实现细节未反向进入新基线。
