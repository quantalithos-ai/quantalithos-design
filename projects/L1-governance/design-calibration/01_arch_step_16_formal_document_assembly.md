# Step 16. 整理正式文档

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 回填章节: `01-架构设计.md` 全文
> 生成日期: 2026-06-07
> 状态: 已完成:正式文档已回填

---

## 1. 本步目标

把 Step 1 ~ Step 15 已确认的 `L1-governance` 架构结论按 `standards/document/架构设计书写规范.md` 的 18 章正式结构整理为新版 `projects/L1-governance/01-架构设计.md`。当前已按 18 章正式结构完成正文回填。

本步只做重组、摘录、压缩、术语统一、编号统一和交叉引用统一,不新增未经前序 Step 讨论的新架构结论,不继承旧 Draft 中的旧日期、旧 ADR 状态、旧性能硬指标、旧产品设施或旧技术栈假设。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 回填 §1、§3 和 §16 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 回填 §2 和 §3 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 回填 §4 |
| `01_arch_step_04_system_context.md` | 已完成 | 回填 §5 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 回填 §6 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 回填 §7 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 回填 §8 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 回填 §9 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 回填 §10 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 回填 §11 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 回填 §12 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 回填 §13 |
| `01_arch_step_13_evolution_path.md` | 已完成 | 回填 §14 |
| `01_arch_step_14_risks_open_questions.md` | 已完成 | 回填 §15 |
| `01_arch_step_15_adr_traceability.md` | 已完成 | 回填 §16 与 §17 |
| `standards/document/架构设计书写规范.md` | 正式规范 | 控制 18 章正式结构、校准来源块和参考章节 |
| 旧 `projects/L1-governance/01-架构设计.md` | 历史 Draft | 仅用于排除旧口径,不得直接继承 |

---

## 3. SOP 问题回答

### 3.1 哪些已确认结论应分别回填到哪些正式章节?

完整落位见 §7.1 章节回填表。正式文档采用 18 章结构:来源声明、业务背景与驱动力、约束条件、职责边界、系统上下文、限界上下文、容器 / 部署、依赖方向、数据所有权、关键交互、关键技术选型、备选方案、横切关注点、演进路线、风险与待确认、需求追溯、ADR 索引和参考。

### 3.2 哪些结论需要拆分吸收到多个章节,而不是机械复制?

Step 1 同时支撑来源声明、约束条件和需求追溯;Step 2 同时支撑业务背景、架构目标、不可变约束、取舍和非目标;Step 15 同时支撑需求追溯和 ADR 索引。数据所有权、依赖裁剪、Policy / shared rules、正文排除、派生不反写和同步 / 异步 / 后台分离等主线机制需要在多个章节中交叉引用,但不得重复扩写为新结论。

### 3.3 哪些术语、编号或交叉引用需要统一?

正式文档统一使用 `L1-governance`、Governance truth、governance context、Gate / Decision、Approval / responsibility、Policy effective fact、shared rules、Control applicability、AIIA / SoA governance conclusion、Nonconformity corrective loop、Governance traceability、truth / snapshot / reference / derived separation、formal intake boundary、handoff、`L0-core` 唯一编译期依赖等术语。

旧 Draft 中的旧 ADR 编号、旧 `150ms / 200ms / 50ms / 30s / 99.95%` 数字、PostgreSQL、audit store、Policy engine、report system 和 external GRC 不能作为新版正式主线。它们只可在风险或待确认口径中作为历史回流风险出现。

### 3.4 哪些内容仍应继续保留为风险或待确认,不能润色成定论?

Governance API / Command / Query / Event / Job / DTO 名称与字段、对象 schema、状态集、迁移规则、Gate 六类可解释语境、Policy 冲突 / shared rules / 自动授权详细口径、Control / AIIA / SoA / Nonconformity 详细口径、traceability / evidence / handoff schema、derived view / export mapping、runtime cache consumption marker、具体 DB / bus / cache / search / rule engine / external GRC 产品、旧性能数字是否硬化为 SLO 等,必须继续保留为风险或待确认事项。

### 3.5 参考项应如何收口,不与 ADR 或追溯重复?

参考章节只列正式参考材料及其用途,不重复 §1 来源承接关系、§16 需求追溯矩阵或 §17 ADR 索引。旧 `01-架构设计.md` 不作为正式参考材料进入 §18,只在正文开头说明其历史 Draft 口径不被直接继承。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` 元信息 | 日期为 2026-05-11,状态为旧 Draft | 与当前 2026-06-07 架构校准链不一致 | 删除旧正文后按新版结构重建 |
| 旧业务背景 | 旧 Gate 六段式、SoA 控制项和外部 GRC 线索较早硬化 | 新版需求已把字段级和产品级细节后移 | 只保留 Governance truth 和核心闭环主线 |
| 旧成功指标 | 旧 `150ms / 200ms / 50ms / 30s / 99.95%` 直接写成目标 | 缺少新版负载模型和验证来源 | 写入待确认和风险,不作硬指标 |
| 旧技术设施 | PostgreSQL、audit store、Policy engine、report system、external GRC 混入架构主线 | 产品设施会反向定义 Governance truth | 作为后续候选或风险,不进入主线 |
| 旧 ADR | 旧 ADR 编号和状态直接挂在正式文档 | 新版 Step 15 只形成 ADR 候选索引 | 使用“未建立”候选索引,不伪造正式 ADR |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式文档来源 | 旧 Draft 直接承载正文 | 由 Step 1 ~ Step 15 中间产物回填 | 保证可追溯 |
| 章节结构 | 旧文档结构与新版规范不一致 | 按 18 章结构重建 | 对齐架构设计书写规范 |
| 校准来源 | 旧文档没有逐章来源块 | 每个正式章节列出具体中间产物 | 保证读者能定位讨论来源 |
| 技术口径 | 旧产品设施较早硬化 | 架构层只保留机制级结论,产品后移 | 防止实现反向定义架构 |
| 风险处理 | 待确认事项容易被正文润色成定论 | 保留在 §15,不在其它章节闭合 | 防止伪确定性 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 在旧 `01-架构设计.md` 上局部替换 | 改动少 | 旧日期、旧 ADR、旧性能、旧产品设施和旧章节容易残留 | 不采用 |
| 方案 B: 删除旧正文后按 18 章重建 | 真相源干净,逐章可追溯 | 需要较大篇幅重建 | 采用 |
| 方案 C: 机械复制各 Step 回填草稿 | 快速 | 正式文档会冗长且缺少章节间统一 | 不采用 |
| 方案 D: 在 Step 16 顺手补详细设计缺口 | 看似完整 | 违反 Step 16 不新增结论约束 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 章节回填表

| 正式章节 | 校准来源 | 回填内容 | 整理口径 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 上游来源、承接主题、旧 Draft 排除说明 | 不重写需求目标 |
| §2 业务背景与驱动力 | Step 2 | 背景结论、驱动力、架构目标 | 不继承旧性能数字 |
| §3 约束条件 | Step 1 / Step 2 | 需求基线、硬约束、不可变约束、取舍、非目标 | 不写协议、对象字段或实现细节 |
| §4 职责边界 | Step 3 | 职责边界、做 / 不做清单、边界红线 | 不写系统上下文或对象 schema |
| §5 系统边界与上下文 | Step 4 | 系统上下文图、上下游输入 / 输出面、降级口径 | 不写接口名和事件名 |
| §6 限界上下文与子域划分 | Step 5 | 核心子域、支撑上下文、本地索引 / 投影 / 引用层、统一语言 | 不写代码模块 |
| §7 容器 / 部署架构 | Step 6 | 运行承载图、运行单元、部署关系 | 不锁定产品和部署参数 |
| §8 依赖方向与层间约束 | Step 7 | 依赖角色、依赖倒置、跨仓裁剪、禁止依赖 | 编译期依赖只允许 `L0-core` |
| §9 数据所有权与一致性策略 | Step 8 | 数据归属、一致性策略、数据边界 | 不写 DDL、事务或缓存实现 |
| §10 关键交互与通信方式 | Step 9 | 关键交互、通信方式、失败口径 | 不写 API / event / topic / DTO |
| §11 关键技术选型 | Step 10 | 机制级技术选型、不采用口径 | 不写产品横评 |
| §12 备选方案与取舍 | Step 11 | 当前主线、路径比较、取舍说明 | 只比较路径级替代 |
| §13 横切关注点 | Step 12 | 横切约束、主线映射、影响说明 | 不写运维手册 |
| §14 演进路线 | Step 13 | 演进阶段、债务、触发条件 | 不写项目排期 |
| §15 风险与待确认事项 | Step 14 | 风险表、待确认事项、处理口径 | 不把待确认润色为定论 |
| §16 需求追溯矩阵 | Step 15 | 需求追溯矩阵、漏项检查、范围说明 | 不新增孤儿架构判断 |
| §17 ADR 索引 | Step 15 | ADR 决策候选索引 | 不伪造正式 ADR 编号 |
| §18 参考 | Step 16 | 正式参考材料清单 | 不重复来源声明、追溯矩阵或 ADR 索引 |

### 7.2 术语统一表

| 正式术语 | 统一含义 | 禁止替代表达 |
|---|---|---|
| Governance truth | 治理决策与治理控制事实真相 | 审批 UI、policy cache、external GRC status |
| governance context | actor、scope、适用对象、治理目的和责任语境 | process context / work context 的正文副本 |
| Gate / Decision | 关键节点正式治理裁决结论 | waiting gate、review card、UI 操作 |
| Policy effective fact | 已生效、可消费、带 scope / priority / conflict 语义的治理策略事实 | AIPolicyDef、runtime cache、capability whitelist |
| shared rules | 组织级不可被低 scope 覆盖的治理硬约束 | project config、runtime default、timeout fallback |
| Control applicability | 控制项在具体治理语境下的适用、实施、复核或违反事实 | Control definition、standard body |
| AIIA / SoA governance conclusion | 影响评估和适用性声明的治理评审、适用 / 排除、覆盖和批准结论 | AIIA / SoA 文档正文 |
| Nonconformity corrective loop | 不符合、原因、纠正、复验和关闭的正式治理闭环 | bug、work blocker、alert、report comment |
| truth / snapshot / reference / derived separation | 数据归属和一致性主机制 | 外部正文统一复制入仓 |
| handoff | 向 observability / archive / external export 交接治理材料的边界语义 | 接收方反写真相 |

### 7.3 交叉引用结论

| 引用位置 | 引用目标 | 作用 |
|---|---|---|
| §1 | `00-需求文档.md`;Step 1 | 说明架构承接来源 |
| §3 | Step 1;Step 2;§15 | 约束与待确认风险不混写 |
| §8 | §4;§5;§9;§11 | 依赖方向支撑职责、上下文、数据和技术机制 |
| §9 | §4;§6;§10;§15 | 数据归属支撑交互和风险红线 |
| §10 | §7;§9;§11 | 通信方式承接运行角色和一致性口径 |
| §12 | §2~§11 | 方案取舍只比较已形成的路径级方案 |
| §15 | §3;§8;§9;§10;§11;§14 | 风险和待确认事项承接主线红线 |
| §16 | Step 15 | 追溯需求、架构承接结果和章节位置 |
| §17 | Step 15 | 索引长期架构决策候选 |
| §18 | Step 16 | 收口正式参考材料 |

### 7.4 参考材料清单

| 参考材料 | 材料类别 | 用途 / 参考价值 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 当前仓需求基线 | 当前架构设计的直接需求来源 |
| `projects/L1-governance/design-calibration/00_req_step_*.md` | 需求校准中间产物 | 追溯需求如何从讨论收敛 |
| `projects/L1-governance/design-calibration/01_arch_step_*.md` | 架构校准中间产物 | 正式架构正文的逐章来源 |
| `standards/document/架构设计讨论流程_SOP.md` | 架构生成流程规范 | 控制 Step 1 ~ Step 16 的讨论顺序和门禁 |
| `standards/document/架构设计书写规范.md` | 架构结果结构规范 | 控制正式 18 章结构、图表和章节职责 |
| `standards/document/设计文档编写通则.md` | 通用写作规范 | 控制文档层级、表达和边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局依赖规范 | 提供仓际依赖类型和裁剪纪律 |

### 7.5 正式文档整理结论

正式 `01-架构设计.md` 应按新版 18 章结构重建。每章开头必须列出具体校准来源和延伸阅读,正文只摘录 Step 1 ~ Step 15 已收稳结论。旧日期、旧 ADR 状态、旧性能硬指标、旧 PostgreSQL / audit store / Policy engine / report system / external GRC 等产品设施不得进入新版架构主线。正式参考章节保持克制,只列长期参考材料,不重复来源声明、追溯矩阵和 ADR 索引。

---

## 8. 回填草稿

本步本身用于指导正式 `01-架构设计.md` 全文重建。正式文档已按照 §7.1 章节回填表逐章写入,并在 §18 摘录 §7.4 参考材料清单和 §7.5 正式文档整理结论中的参考范围口径。

---

## 9. 进入下一步条件

- 已明确所有已确认结论的正式章节落位。
- 已明确术语、编号和交叉引用统一口径。
- 已明确旧 Draft 中哪些内容不得继承。
- 已明确参考章节范围。
- 未在整理阶段新增未经讨论的架构结论。

结论:新版 `projects/L1-governance/01-架构设计.md` 已按 §7.1 章节回填表完成正式正文回填。本 Step 状态已更新为完成。
