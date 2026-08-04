# L4-observability 01-架构设计 Step 16 · 整理正式文档

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 回填章节: `01-架构设计.md` §1~§18
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 `02-概要设计`

---

## 1. 本步目标

把 Step 01 ~ Step 15 已经确认并可回填的结论按 `架构设计书写规范.md` 的 18 章正式结构整理成 `projects/L4-observability/01-架构设计.md`。本步只做重组、术语统一、交叉引用、正式章节落位和总审计,不新增未经讨论的新架构结论。

本步同时替换旧正式 `01-架构设计.md` 的历史正文。旧正文中的对象 / schema 名称、产品栈、旧性能数字、hash chain / 冷存 / 事件数量、真实证据口径和旧 implementation boundary 均继续作为 historical material,不得进入正式架构基线。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | Step 15 已完成,用户已确认进入 Step 16 | 确认当前恢复点、正式装配门禁和后续文档停审要求。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~15 pass,Step 16 已获用户确认 | 确认本文档可进入正式装配,但不得自动进入 02。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | 已完成 | 提供来源声明、需求基线、硬约束和 historical material 处理口径。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | 已完成 | 提供业务背景、驱动力、架构目标、不可变约束、可接受取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供职责边界、做 / 不做清单和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供系统上下文图、输入 / 输出面和依赖失效降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context.md` | 已完成 | 提供限界上下文、核心 / 支撑子域、本地索引 / 投影 / 引用和统一语言。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供运行承载、同步入口、异步消费、后台维护和运行边界红线。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供依赖角色、层间约束、依赖倒置、跨仓裁剪、禁止依赖和裁剪图。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供数据归属、一致性策略、数据边界说明和停审记录。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供关键交互场景、通信方式、交互示意图和失败降级。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 提供机制级技术选型、不采用口径和技术边界说明。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线、路径级替代方案、轻量取舍和方案边界说明。 |
| `design-calibration/01_arch_step_12_cross_cutting.md` | 已完成 | 提供横切关注点、架构单元适用性和跨横切审计。 |
| `design-calibration/01_arch_step_13_evolution_roadmap.md` | 已完成 | 提供演进路线、阶段边界、债务、触发条件和演进边界。 |
| `design-calibration/01_arch_step_14_risks_open_questions.md` | 已完成 | 提供风险表、待确认事项表和当前处理口径。 |
| `design-calibration/01_arch_step_15_adr_traceability.md` | 已完成 | 提供需求追溯矩阵、漏项检查、ADR 候选、停审和跨审计。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 16 | 已读取 | 控制正式装配只能重组、统一和回填,不得新增结论。 |
| `standards/document/架构设计书写规范.md` | 已读取 | 控制正式章节顺序、校准来源、图表和评审清单。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 16 SOP 和正式书写规范 | done | 本文件 §2 |
| 读取 Step 01~15 的结构化中间产物和回填草稿 | done | 本文件 §4 / §7 |
| 诊断旧正式 `01-架构设计.md` 与旧 Step 16 的 historical material 污染 | done | 本文件 §5 |
| 输出章节回填矩阵、术语统一、交叉引用、风险保留和参考收口 | done | 本文件 §7 |
| 完成 Step 5 / 7 / 8 / 9 / 12 / 15 停审确认和跨架构单元总审计 | done | 本文件 §8 |
| 重建正式 `projects/L4-observability/01-架构设计.md` | done | 正式文档 |
| 更新 flow / 项目台账并执行污染与格式校验 | done | 本文件 §10 |

---

## 4. SOP 问题回答

### 4.1 哪些已确认结论应分别回填到哪些正式章节?

所有 Step 01~15 的正式回填关系见 §7.1。本文按 `架构设计书写规范.md` 的 18 章主链装配:来源声明、业务背景与驱动力、约束条件、职责边界、系统上下文、限界上下文、容器 / 部署、依赖方向、数据所有权、关键交互、技术机制、备选方案、横切关注点、演进路线、风险、需求追溯、ADR 索引和参考。

### 4.2 哪些结论需要拆分吸收到多个章节,而不是机械复制?

需求基线结论拆分到 §1 与 §3;架构目标结论拆分到 §2 与 §3;职责边界结论进入 §4,同时被 §9 / §10 / §13 的数据、交互和横切红线引用;依赖裁剪进入 §5 / §8 / §18;数据所有权同时支撑 §9、§11、§15 和 §16;风险与待确认事项进入 §15,并在 §16 的漏项检查中保留追溯状态;ADR 候选进入 §17,不重复 §16 的来源到承接矩阵。

### 4.3 哪些术语、编号或交叉引用需要统一?

统一使用 `observation truth`、`audit projection`、`body-free evidence linkage`、`report handoff`、`retention marker`、`active reference protection`、`no-write guard`、`safe ref`、`derived projection`、`forbidden body` 等当前 Step 01~15 已收稳术语。正式文档不再使用旧对象 / schema 名称作为架构主语,也不把产品名、topic、payload、DTO、数据库、handler、repository 或实现边界写成架构主体。

### 4.4 哪些内容仍应继续保留为风险或待确认,不能润色成定论?

对象、状态集、错误语义、协议、事件、配置项、完整性算法、外部产品组合、容量指标、SLO、留存窗口、report / archive / external audit handoff 格式、测试断言和 implementation boundary skeleton 仍保留在 §15 风险与待确认事项中。它们不会阻塞正式架构文档完成,但会阻塞后续概要 / 详细 / 配置 / 测试 / 验收 / 实施阶段自行脑补。

### 4.5 参考项应如何收口,不与 ADR 或追溯重复?

§18 只收纳正式参考来源,包括需求文档、各 Step 中间产物、架构 SOP、架构书写规范、全局依赖裁剪规则和相邻 L1 / L0 参考文档。§18 不重写需求追溯矩阵,不列 ADR 候选内容,不变成历史材料清单。

### 4.6 Step 5 / 7 / 8 / 9 / 12 / 15 是否全部停审?

已停审。Step 05 完成限界上下文和跨上下文审计;Step 07 完成依赖方向和跨依赖边界审计;Step 08 完成数据所有权和跨数据边界审计;Step 09 完成交互方式和跨交互边界审计;Step 12 完成横切关注点和跨横切约束审计;Step 15 完成 ADR 候选和跨 ADR / 需求追溯审计。

---

## 5. 当前文档问题诊断

| 输入材料 | 诊断 | 本步处理 |
|---|---|---|
| 旧正式 `01-架构设计.md` | 约 332 行,明显低于 L1-artifact 和 L1-governance 粒度;包含对象 / schema、产品、性能和实现口径 | 整体重建,不做局部修补。 |
| 旧 Step 16 中间产物 | 仍以 log / metric / trace / audit event schema 等对象口径组织,且门禁允许自动跨步 | 整体替换为正式装配审计产物,门禁改为等待用户确认进入 02。 |
| 旧 README / 旧正式 01 / 旧 Step 产物 | 混入 OTel、Prometheus、Grafana、TimescaleDB、对象存储、旧 P95、旧冷存、旧 hash chain、旧事件数量和旧实施资产 | 全部作为 historical material,只在风险 / 禁止沿用语境出现。 |
| 当前 Step 01~15 | 已完成逐 Step 停审,但正式正文尚未按 18 章装配 | 本步按章节回填矩阵装配正式文档。 |
| 下游 02~07 historical material | 已存在但未经本轮重建 | 仍为 historical material;不得因 01 完成自动进入 02 或恢复旧实现边界。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 修补旧正式 `01-架构设计.md` | 改动小 | 旧正文粒度偏短且混入对象、产品、性能和实现口径,难以保证真相源干净 | 不采用。 |
| 方案 B: 按 Step 01~15 重建正式文档 | 与 current calibration 真相源一致,每章可回指具体中间产物 | 文档较长,需要控制不新增结论 | 采用。 |
| 方案 C: 机械复制所有 Step 结构化表 | 最完整 | 正式正文会过长且混入过程材料、诊断和取舍细节 | 不采用。 |
| 方案 D: 摘要式压缩为短文档 | 阅读轻 | 不能满足 Step 5 以后可落码粒度,后续概要 / 详细会缺少边界输入 | 不采用。 |

---

## 7. 结构化中间产物

### 7.1 章节回填矩阵

| 正式章节 | 主要来源 | 回填方式 | 边界 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 01 | 承接需求文档、全局裁剪、L0 / L1 相邻 truth owner 和 historical material 处理 | 不重写需求。 |
| §2 业务背景与驱动力 | Step 02 | 摘录业务背景、驱动力和架构目标 | 不写性能数字和产品目标。 |
| §3 约束条件 | Step 01 / Step 02 | 合并硬约束、不可变约束、可接受取舍和非目标 | 不写 API、DTO、schema、测试或实施。 |
| §4 职责边界 | Step 03 | 摘录职责边界、做 / 不做、边界红线 | 不把对象字段或产品作为职责。 |
| §5 系统边界与上下文 | Step 04 | 摘录系统上下文图、上下游输入 / 输出面、降级口径 | 不画接口名、角色、事件名或产品图。 |
| §6 限界上下文与子域划分 | Step 05 | 摘录核心子域、支撑上下文、本地索引 / 投影 / 引用和统一语言 | 不写代码模块或对象清单。 |
| §7 容器 / 部署架构 | Step 06 | 摘录运行承载图、运行单元说明、部署关系、通信口径和运行红线 | 不写部署命令、产品或进程参数。 |
| §8 依赖方向与层间约束 | Step 07 | 摘录依赖角色、层间约束、依赖倒置、裁剪表、禁止依赖和裁剪图 | 不写调用链、topic、outbox 或源码依赖。 |
| §9 数据所有权与一致性策略 | Step 08 | 摘录数据归属、一致性策略、架构单元数据边界和数据边界说明 | 不写数据库表或字段。 |
| §10 关键交互与通信方式 | Step 09 | 摘录关键交互场景、通信方式、架构单元交互和交互图 | 不写 API / event / callback 协议。 |
| §11 关键技术选型 | Step 10 | 摘录机制级技术选型、适用表、不采用口径和技术边界 | 不锁定外部产品或算法。 |
| §12 备选方案与取舍 | Step 11 | 摘录当前主线、路径级方案比较、轻量取舍和边界说明 | 不做产品横评。 |
| §13 横切关注点 | Step 12 | 摘录横切结论、约束表、架构单元适用性和横切影响说明 | 不写监控字段、阈值或配置 key。 |
| §14 演进路线 | Step 13 | 摘录演进路线、阶段边界、债务、触发条件和演进边界 | 不写项目排期。 |
| §15 风险与待确认事项 | Step 14 | 摘录风险表、待确认事项和处理口径 | 不把挂起项润色为定论。 |
| §16 需求追溯矩阵 | Step 15 | 摘录需求追溯、漏项检查、跨审计和范围说明 | 不写项目状态或 ADR 索引。 |
| §17 ADR 索引 | Step 15 | 摘录 ADR 候选、停审记录和决策边界说明 | 不创建正式 ADR 文件。 |
| §18 参考 | Step 01~15 / 标准 / 上游 | 收纳正式参考来源与用途 | 不重复追溯矩阵或 ADR 内容。 |

### 7.2 术语统一表

| 统一术语 | 不再作为正式主语的旧口径 | 说明 |
|---|---|---|
| observation truth | 日志平台、监控平台、外部 APM truth | 本仓拥有横切观察面事实,不是产品配置。 |
| audit projection | audit ledger / Governance decision truth | 审计投影只读,不替代治理裁决或 source audit truth。 |
| body-free evidence linkage | evidence body、artifact body、真实 evidence | 只保存引用、摘要、缺口和真实性提示。 |
| correlation context / safe ref | opaque id、topic、route、dashboard label | 关联语境不能反推业务 truth。 |
| derived projection | dashboard / alert / report truth | 派生消费可延迟、可重建,不得反写。 |
| retention marker | archive package、cleanup truth | 留存标记不拥有归档包或恢复正文。 |
| no-write guard | repair command、source write path | 查询、诊断、维护、交接和导出均不得写源。 |
| product-neutral adapter | OTel / Prometheus / Grafana / TimescaleDB 硬选型 | 产品后续闭口,不得定义核心 truth。 |

### 7.3 保留为风险或待确认的内容

| 内容 | 正式落点 | 当前状态 |
|---|---|---|
| 对象、状态集、错误语义、协议和协作格式 | §15 待确认事项 | 后续概要 / 详细设计闭口。 |
| Redaction、visibility、retention、export 和 adapter 配置项 | §15 待确认事项 | 后续配置设计闭口。 |
| Digest、canonicalization、integrity hint、gap scan、完整事件溯源 | §15 待确认事项 / §17 ADR 候选边界 | 后续详细 / 测试 / ADR 判断。 |
| 产品组合、容量目标、SLO、留存窗口 | §15 待确认事项 | 后续测试 / 验收 / 实施计划基于真实负载模型闭口。 |
| 新版 implementation ledger 和 planned boundary skeleton | §15 待确认事项 | 必须在 `07-实施计划.md` 完成时创建,当前不伪造。 |

### 7.4 参考收口表

| 参考来源 | 类别 | 用途 |
|---|---|---|
| `projects/L4-observability/00-需求文档.md` | 当前需求基线 | 正式架构的需求来源。 |
| `design-calibration/01_arch_step_01~15` | 当前架构校准真相源 | 正式章节回填来源。 |
| `standards/document/架构设计讨论流程_SOP.md` | 生成流程标准 | 说明逐 Step 讨论与正式装配关系。 |
| `standards/document/架构设计书写规范.md` | 正式结构标准 | 说明 18 章结构、图表与评审规则。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪标准 | 支撑 `L0-core` 唯一编译期依赖和 sibling repo 裁剪。 |
| `projects/L0-bus` / `projects/L1-*` 正式文档 | 上游 / 相邻 truth owner 参考 | 只用于边界和依赖裁剪,不复制其 truth。 |

---

## 8. 跨架构单元总审计

### 8.1 停审确认表

| Step | 审计对象 | 停审结论 | 说明 |
|---|---|---|---|
| Step 05 | 限界上下文、核心 / 支撑子域、本地索引 / 投影 / 引用 | pass | 已区分 observation truth 主线、支撑消费和外部引用层。 |
| Step 07 | 依赖方向、依赖角色、跨仓裁剪和禁止依赖 | pass | `L0-core` 唯一编译期依赖、`L0-bus` 事件协作和 sibling 运行期协作已收稳。 |
| Step 08 | 数据所有权、一致性策略和 forbidden body 边界 | pass | Truth / derived / reference / forbidden body 已分离。 |
| Step 09 | 同步 / 异步 / 后台交互方式 | pass | 即时判断、材料送达、事实传播和后台维护边界已收稳。 |
| Step 12 | 横切关注点 | pass | 安全、追溯、可观测、韧性、性能预算和配置不可越界均已压到架构单元。 |
| Step 15 | ADR 与需求追溯 | pass | 需求追溯、ADR 候选、停审记录和跨审计均完成。 |

### 8.2 总审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在职责重叠 | pass | Observation truth、source business truth、Governance truth、Artifact truth、Identity truth、runtime truth、archive truth 和 UI truth 已分离。 |
| 是否存在依赖方向冲突 | pass | 正式文档只保留 `L0-core` 编译期依赖;其他协作均为运行期、事件协作、ref、summary、signal 或 handoff。 |
| 是否存在数据所有权冲突 | pass | 正式真相、派生投影、引用关系和 forbidden body 的边界一致。 |
| 是否存在通信方式冲突 | pass | 同步只处理准入、可见性、handoff、retention 和 no-write 即时判断;异步与后台不反写核心。 |
| 是否存在横切约束遗漏 | pass | redaction-first、body-free、traceability、idempotency、retention protection、no-write 和配置不可越界均入章。 |
| 是否存在追溯断裂 | pass | 核心需求、业务规则、数据归属、NFR、验收和 veto 均可回指正式架构章节。 |
| 是否存在未确认项被润色成定论 | pass | 产品、对象、状态、协议、算法、容量和 implementation boundary 均保留在风险 / 待确认。 |
| 是否存在旧材料污染 | pass | 旧产品栈、旧指标、旧事件 / topic / outbox、旧完整性链和旧实施资产只作为 historical material。 |
| 是否存在真实证据伪造 | pass | 未生成真实 run、真实 evidence alias、passed evidence、final verdict 或 signoff。 |

---

## 9. 正式文档写入记录

| 写入对象 | 结果 |
|---|---|
| `projects/L4-observability/01-架构设计.md` | 已按本文件和 Step 01~15 重建。 |
| 正式章节数量 | 18 章 + 文档元信息。 |
| 校准来源 | 每个正式章节均列出具体 `design-calibration/01_arch_step_*` 来源。 |
| 新增未讨论结论 | 无。 |
| 正式 ADR 文件 | 未创建。 |
| 实施 ledger / boundary skeleton | 未创建,保留到 `07-实施计划.md`。 |

---

## 10. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按正式 18 章主链装配 | pass | 正式 `01-架构设计.md` 已按 §1~§18 组织。 |
| 是否每章列出具体校准来源 | pass | 每章均引用具体 Step 中间产物。 |
| 是否只做重组、术语统一和回填 | pass | 未新增 Step 01~15 之外的新架构结论。 |
| 是否保留未确认项为风险或待确认 | pass | 对象、协议、产品、算法、容量和 implementation boundary 均保留在 §15。 |
| 是否完成跨架构单元总审计 | pass | §8 已覆盖职责、依赖、数据、通信、横切、ADR 和追溯。 |
| 是否修改代码或实现资产 | pass | 未实现代码,未创建 implementation ledger 或 boundary skeleton。 |
| 是否发现上游 blocker | pass | 未发现阻塞 Step 16 完成的上游 blocker。 |
| gate_status | pass | Step 16 已完成。 |
| next_allowed_action | wait_user_confirmation_before_02 | `01-架构设计.md` 完成后必须停审,等待用户确认后才能进入 `02-概要设计`。 |
