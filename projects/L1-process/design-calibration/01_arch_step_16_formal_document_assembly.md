# Step 16. 整理正式文档

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 回填章节: `01-架构设计.md` 全文
> 生成日期: 2026-06-05

---

## 1. 本步目标

把 Step 1~Step 15 已经确认的 `L1-process` 架构结论按 `架构设计书写规范.md` 的正式章节结构整理成新版 `01-架构设计.md`。本步只做重组、统一术语、统一章节落位和补齐校准来源,不新增未经讨论的新架构结论,不继承旧 Draft 中的旧技术栈、旧 ADR 状态、旧性能硬指标或旧文档链。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | 已完成 | 回填 §1 与 §3 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 回填 §2 与 §3 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 回填 §4 |
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 回填 §5 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 回填 §6 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 回填 §7 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 回填 §8 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 回填 §9 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 回填 §10 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 回填 §11 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 回填 §12 |
| `design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 回填 §13 |
| `design-calibration/01_arch_step_13_evolution_path.md` | 已完成 | 回填 §14 |
| `design-calibration/01_arch_step_14_risks_open_questions.md` | 已完成 | 回填 §15 |
| `design-calibration/01_arch_step_15_adr_traceability.md` | 已完成 | 回填 §16 与 §17 |
| `standards/document/架构设计书写规范.md` | 正式规范 | 控制章节结构、校准来源块、图表和参考章节 |
| 旧 `projects/L1-process/01-架构设计.md` | 历史 Draft | 仅用于排除旧口径,不得直接继承 |

---

## 3. SOP 问题回答

### 3.1 哪些已确认结论应分别回填到哪些正式章节?

完整落位见 §7.1 章节回填表。正式文档采用 18 章结构:来源声明、背景驱动力、约束条件、职责边界、系统上下文、限界上下文、容器 / 部署、依赖方向、数据所有权、关键交互、关键技术选型、备选方案、横切关注点、演进路线、风险、需求追溯、ADR 索引和参考。

### 3.2 哪些结论需要拆分吸收到多个章节?

Step 1 同时支撑来源声明和约束条件;Step 2 同时支撑业务背景、驱动力、目标、约束、取舍和非目标;Step 15 同时支撑需求追溯和 ADR 索引。依赖裁剪结论主要落 §8,但也被 §11、§12 和 §15 引用为技术机制、取舍和风险红线。数据所有权结论主要落 §9,同时支撑 §12 的方案取舍、§13 的横切审计和 §15 的风险。

### 3.3 哪些术语、编号或交叉引用需要统一?

正式文档统一使用 `L1-process`、Process truth、Runtime Process Shape、ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、pause context、Checkpoint、Recovery、Process Consumption、Maintenance & Reconciliation、External Context Mirrors 等 Step 5 已收稳术语。正式章节编号按规范 1~18,不沿用旧文档中的 17 节结构、旧 `ADR-0007 / ADR-0008 / ADR-0010` 状态或旧读码导航。

### 3.4 哪些内容仍应保留为风险或待确认,不能润色成定论?

API / Command / Query / Event / Job 名称和字段形态、状态集与迁移规则、checkpoint / recovery evidence schema、projection / handoff 可靠机制、pending / stale / unresolved 等 marker 字段、产品级语言 / state store / bus / object storage 选择、完整 BPMN 是否进入主线、旧性能候选指标是否硬化、配置项清单和平台安全制度,均保留在 §15 风险与待确认事项中,不得在正式正文其它章节写成已定实现。

### 3.5 参考项应如何收口,不与 ADR 或追溯重复?

参考章节只列正式参考材料及其参考价值,不重复 §1 来源承接关系、§16 需求追溯矩阵或 §17 ADR 索引。正式参考保留当前仓需求文档、架构校准中间产物、架构设计 SOP、架构设计书写规范、设计文档编写通则、需求文档中间产物和相关全局架构材料;旧 `01-架构设计.md` 不作为正式参考材料进入 §18。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` 元信息 | 日期为 2026-05-11,状态和版本为旧 Draft | 与当前 2026-06-05 校准链不一致 | 删除旧文件后重建 |
| 旧 `01-架构设计.md` 项目定位 | 写成 BPMN 2.0 引擎 + Python / PostgreSQL 等旧假设 | 新版架构尚未硬化产品级语言、存储和 BPMN engine | 不继承 |
| 旧 `01-架构设计.md` 成功标准 | 把 P95、checkpoint、恢复和规模数字写成硬目标 | 新版需求只把旧数字作为候选目标 | 改为 §15 待确认 / 风险口径 |
| 旧 `01-架构设计.md` ADR | 关联旧 ADR 编号和 Proposed 状态 | 新版 Step 15 已重建 ADR-PROC-ARCH-* 索引 | 使用新版 ADR 索引 |
| 旧 `01-架构设计.md` 章节结构 | 与新版规范 18 章结构不一致 | 无法保证校准来源逐章可追溯 | 按规范重建 18 章 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式文档来源 | 旧 Draft 直接承载正文 | 由 Step 1~Step 15 中间产物回填 | 保证可追溯 |
| 技术栈 | 旧文档写入 Python、PostgreSQL、BPMN engine 等 | 架构层只保留技术机制,产品硬选择后移 | 防止旧假设污染新版架构 |
| 性能指标 | 旧文档硬化为成功标准 | 候选指标后移到测试和容量验证 | 对齐需求风险口径 |
| ADR | 旧 ADR 状态混入正文 | 使用 ADR-PROC-ARCH-001~010 | 对齐新版关键架构决定 |
| 校准来源 | 旧文档没有逐章来源块 | 每个正式章节列出具体中间产物 | 对齐书写规范 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 在旧 `01-架构设计.md` 上局部替换 | 改动少 | 旧技术、旧 ADR 和旧章节容易残留 | 不采用 |
| 方案 B: 删除旧文件后按 18 章重建 | 真相源干净,可追溯 | 需要分批写入较长正文 | 采用 |
| 方案 C: 只复制各 Step 回填草稿 | 快速 | 正式文档会缺少章节之间的统一元信息和参考收口 | 不采用 |
| 方案 D: 在 Step 16 顺手补详细设计缺口 | 看似完整 | 违反架构文档层级和“不新增结论”约束 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 章节回填表

| 正式章节 | 校准来源 | 回填内容 | 整理口径 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 来源承接说明、旧 Draft 排除说明 | 不重写需求目标 |
| §2 业务背景与驱动力 | Step 2 | 业务背景结论、驱动力、架构目标 | 不写成功指标硬值 |
| §3 约束条件 | Step 1 / Step 2 | 需求基线、硬约束、不可变约束、可接受取舍、非目标 | 未关闭风险只按待确认表达 |
| §4 职责边界 | Step 3 | 职责边界表、做 / 不做清单、边界红线 | 不写系统上下文或实现结构 |
| §5 系统边界与上下文 | Step 4 | 系统上下文图、上下游输入 / 输出面、边界说明 | 不写接口名和事件名 |
| §6 限界上下文与子域划分 | Step 5 | 子域划分、关系图、本地索引 / 投影 / 引用边界、统一语言 | 不写对象字段和代码模块 |
| §7 容器 / 部署架构 | Step 6 | 运行承载图、运行单元说明、部署说明 | 不锁定产品和部署参数 |
| §8 依赖方向与层间约束 | Step 7 | 依赖方向、层间约束、倒置边界、依赖裁剪、禁止依赖 | 编译期依赖只允许 `L0-core` |
| §9 数据所有权与一致性策略 | Step 8 | 数据归属、一致性策略、关系图、数据边界说明 | 不写事务、表或缓存实现 |
| §10 关键交互与通信方式 | Step 9 | 关键交互场景、通信方式、交互示意、失败口径 | 不写 API / event / topic |
| §11 关键技术选型 | Step 10 | 架构层技术机制、采用 / 不采用对照、技术边界说明 | 不写产品横评 |
| §12 备选方案与取舍 | Step 11 | 当前主线方案、方案路径比较、轻量取舍、边界说明 | 只比较路径级替代 |
| §13 横切关注点 | Step 12 | 横切约束、主线映射、影响说明 | 不写运维手册 |
| §14 演进路线 | Step 13 | 演进路线、触发条件、阶段边界说明 | 不写项目排期 |
| §15 风险与待确认事项 | Step 14 | 风险表、待确认事项、处理口径说明 | 不把待确认润色为定论 |
| §16 需求追溯矩阵 | Step 15 | 需求追溯矩阵、漏项检查、追溯范围说明 | 不重复 ADR 索引 |
| §17 ADR 索引 | Step 15 | ADR-PROC-ARCH-001~010 索引表 | 不写 ADR 正文 |
| §18 参考 | Step 16 | 正式参考材料表、参考范围说明 | 不重复来源声明、追溯或 ADR |

### 7.2 术语统一表

| 统一术语 | 禁止替代 / 旧口径 | 说明 |
|---|---|---|
| Process truth | process 状态附属物 / workspace 进度 / work 状态 | 强调本仓拥有独立过程执行事实 |
| Runtime Process Shape | ProcessTemplateDef / TaskDefinition 正文 | 前者属于 Process 运行时形态,后者属于 method-library 定义正文 |
| ProcessProfile | 模板刚度实现 / Project 状态 | 表达项目采用和裁剪后的过程语境 |
| Activity | WorkItem / runtime step / ImplementationPlan step | 只表达过程节点和承担语境 |
| Token / Gateway | runtime 队列 / 工具执行计划 | 只表达过程流控位置和路径选择 |
| waiting gate | governance decision / policy / approval | 只表达等待意图和恢复语境 |
| Checkpoint / Recovery | runtime micro checkpoint / reasoning trace / archive package | 只表达 Instance 级恢复连续性 |
| External Context Mirrors | 外部 truth 副本 | 只表达 ref / snapshot / projection,不拥有外部正文 |
| read model / projection | 业务写源 | 只读派生消费面 |
| ADR-PROC-ARCH-* | 旧 ADR-0007 / 0008 / 0010 | 新版 Process 架构 ADR 索引 |

### 7.3 交叉引用结论

| 引用位置 | 引用目标 | 作用 |
|---|---|---|
| §1 | `00-需求文档.md`;Step 1 | 说明架构承接来源 |
| §3 | Step 1;Step 2;§15 | 约束与待确认风险不混写 |
| §8 | §4;§5;§9;§11 | 依赖方向支撑职责、上下文、数据和技术机制 |
| §9 | §4;§6;§10;§15 | 数据归属支撑交互和风险红线 |
| §10 | §7;§9;§11 | 通信方式承接运行角色和一致性口径 |
| §12 | §2~§11 | 方案取舍只比较已形成的路径级方案 |
| §15 | §3;§8;§9;§10;§11;§14 | 风险和待确认事项承接所有主线红线 |
| §16 | Step 15 | 追溯需求、架构承接结果和章节位置 |
| §17 | Step 15 | 索引长期架构决策 |
| §18 | Step 16 | 收口正式参考材料 |

### 7.4 参考材料清单

| 参考材料 | 材料类别 | 用途 / 参考价值 | 说明 |
|---|---|---|---|
| `projects/L1-process/00-需求文档.md` | 当前仓需求基线 | 当前架构设计的直接需求来源 | 正式承接核心闭环、功能、规则、数据归属、验收和风险口径。 |
| `projects/L1-process/design-calibration/00_req_step_*.md` | 需求校准中间产物 | 追溯需求如何从讨论收敛 | 用于验证架构追溯矩阵的需求来源。 |
| `projects/L1-process/design-calibration/01_arch_step_*.md` | 架构校准中间产物 | 正式架构正文的逐章来源 | 每个正式章节必须引用具体 Step 文件。 |
| `standards/document/架构设计讨论流程_SOP.md` | 架构生成流程规范 | 控制 Step 1~Step 16 的讨论顺序和门禁 | 说明本文不是一次性生成,而是由中间产物收敛。 |
| `standards/document/架构设计书写规范.md` | 架构结果结构规范 | 控制正式 18 章结构、图表和章节职责 | 正式文档按该规范整理。 |
| `standards/document/设计文档编写通则.md` | 通用写作规范 | 控制文档层级、表达和边界 | 用于约束正式文档不下沉实现细节。 |
| 全局仓级拆分与架构材料 | 上游架构材料 | 提供 `L1-process` 的全局仓级定位和依赖裁剪背景 | 只作为仓级边界来源,不替代当前仓需求和架构校准结论。 |

### 7.5 正式文档整理结论

正式 `01-架构设计.md` 应删除旧 Draft 后按新版 18 章结构重建。每章开头必须列出具体校准来源和延伸阅读,正文只摘录 Step 1~Step 15 已收稳结论。旧 Python、PostgreSQL、BPMN engine、旧成功指标、旧 ADR 编号和旧读码导航不得进入新版正式文档。正式参考章节保持克制,只列长期参考材料,不重复来源声明、追溯矩阵和 ADR 索引。

---

## 8. 回填草稿

本步本身用于指导正式 `01-架构设计.md` 全文重建。正式文档应按照 §7.1 章节回填表逐章写入,并在 §18 摘录 §7.4 参考材料清单和 §7.5 正式文档整理结论中的参考范围口径。

---

## 9. 进入下一步条件

- 已明确所有已确认结论的正式章节落位。
- 已明确术语、编号和交叉引用统一口径。
- 已明确旧 Draft 中哪些内容不得继承。
- 已明确参考章节范围。
- 未在整理阶段新增未经讨论的架构结论。

结论:可以删除旧 `projects/L1-process/01-架构设计.md` 并按新版结构重建正式文档。
