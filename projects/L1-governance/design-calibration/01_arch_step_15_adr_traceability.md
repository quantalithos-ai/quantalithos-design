# Step 15. ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 回填章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 ~ Step 14 已经收稳的 `L1-governance` 关键架构决定与需求来源、约束来源和风险来源显式连接起来,并沉淀后续需要长期保留的 ADR 决策候选索引。

本步只做追溯映射、漏项检查和 ADR 候选索引,不新增架构结论,不创建正式 ADR 文件,不补写 API / Command / Query / Event / Job / DTO、对象 schema、状态机、数据库、规则引擎、外部 GRC 产品或实现细节,也不把 Step 14 已挂起的待确认事项润色成已闭合事实。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 已按需求 SOP 重建 | 提供正式需求来源、功能、规则、数据归属、验收和风险基线 |
| `00_req_step_16_traceability_matrix.md` | 已完成 | 提供需求层 C-GOV、US-GOV、FR-GOV、BR-GOV、数据归属和 AC / VF 追溯关系 |
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、旧 Draft 回流风险和硬约束输入 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做 / 易混淆职责和边界红线 |
| `01_arch_step_04_system_context.md` | 已完成 | 提供系统上下文、正式输入 / 输出面和依赖失效口径 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑子域、本地索引 / 投影 / 引用边界和统一语言 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载和派生承载角色 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供 `L0-core` 唯一编译期依赖、依赖倒置和跨仓裁剪口径 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 Governance truth / external snapshot / reference / derived separation 和一致性策略 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台交互分工和失败挂起口径 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 提供机制级技术选型和当前不采用口径 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线方案、替代路径和路径级取舍 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 提供安全、可观测、韧性、性能预算、配置和追溯横切约束 |
| `01_arch_step_13_evolution_path.md` | 已完成 | 提供当前阶段成立条件、可接受债务、不可接受债务和演进触发条件 |
| `01_arch_step_14_risks_open_questions.md` | 已完成 | 提供正式风险、待确认事项和阻塞口径 |

---

## 3. SOP 问题回答

### 3.1 哪些架构决定需要沉淀为 ADR?

应进入 ADR 索引的是会长期影响 Governance truth、仓际边界、数据归属、一致性、依赖裁剪、Policy / shared rules、合规结论、纠正闭环、追溯和演进方式的架构决定。当前建议沉淀的 ADR 候选包括:

1. 以独立 Governance truth 作为 `L1-governance` 架构核心。
2. Gate / Decision truth 与 process waiting state、work lifecycle、conversation display、runtime cache、workspace view 分离。
3. Policy effective fact / shared rules 归 Governance,并与 AIPolicyDef、runtime cache、capability whitelist、policy engine 和 external GRC status 分离。
4. Control / AIIA / SoA governance conclusion 与 artifact / evidence / method / standard 正文分离。
5. Nonconformity corrective loop 归 Governance,并与 bug、work blocker、observability alert、report comment 分离。
6. 通过正式承接边界、运行期接缝、引用、快照、safe summary、event 和 handoff 承接非 `L0-core` sibling 仓。
7. 采用 Governance truth / external snapshot / reference / derived separation。
8. 核心治理事实强一致,下游消费、派生、report、reconciliation、external export、observability / archive handoff 最终一致。
9. 同步核心治理判断、异步事实传播 / 外部结果送达、后台派生 / 对账 / 交接三类路径分离。
10. 派生视图、report、dashboard、external GRC export、reconciliation 和 archive preparation 只读消费,不得反写真相。
11. 关键治理变化、消费、维护、报告和交接必须有 traceability / evidence / handoff 语义。
12. 产品级数据库、消息、缓存、搜索、rule engine、Policy DSL、external GRC、report 工具、完整 ES / CQRS 和旧性能数字暂不作为当前架构硬选型。

### 3.2 每个关键架构决定对应哪些需求、约束或风险来源?

完整映射见 §7.1 需求追溯矩阵和 §7.3 ADR 决策候选索引。当前关键架构决定均可追溯到新版 `00-需求文档.md` 的仓定位、C-GOV 核心闭环、FR-GOV 功能需求、BR-GOV 业务规则、数据归属要求、AC / VF 验收标准,以及 Step 1 ~ Step 14 已收稳的架构目标、职责边界、依赖方向、数据所有权、通信方式、机制选型、方案取舍、横切约束、演进债务和风险红线。

### 3.3 是否存在没有需求来源的架构设计?

当前结论为否。进入正式架构主线的判断都能追溯到需求基线、需求追溯矩阵、数据归属、一票否决项、非功能约束、风险挂起口径或 Step 1 ~ Step 14 的已确认取舍。

旧 `01-架构设计.md` 中的 PostgreSQL、audit store、Policy engine、report system、external GRC、旧 `150ms / 200ms / 50ms / 30s / 99.95%` 指标和旧 ADR 状态,没有被作为新版架构来源直接继承。

### 3.4 是否存在没有架构承接的核心需求或关键约束?

当前结论为否。C-GOV-1 ~ C-GOV-5、FR-GOV-001 ~ FR-GOV-010、BR-GOV-001 ~ BR-GOV-040、Governance 数据归属和 AC / VF 验收约束已经分别被职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、关键交互、关键技术机制、横切关注点、演进路线和风险章节承接。

外围增强 FR-GOV-E01 ~ FR-GOV-E06 不是未承接需求,而是已按派生消费、外围增强、后续演进和待确认事项处理,不作为当前核心闭环成立前置。

### 3.5 哪些取舍和红线必须长期可追溯?

必须长期可追溯的红线包括:

- Governance truth 不得被 process waiting、work lifecycle、artifact body、conversation display、runtime cache、workspace view、observability ledger、archive package 或 external GRC truth 替代。
- Gate / Decision truth 不等于 waiting gate、review card、UI 操作或 runtime cache 状态。
- Policy effective fact / shared rules 不得由 AIPolicyDef、runtime cache、capability whitelist、tool execution、低 scope 配置、timeout fallback 或 external GRC status 反向定义。
- Control / AIIA / SoA governance conclusion 不得复制 artifact / evidence / method / standard / archive / external GRC 正文。
- Nonconformity corrective loop 不得退化为 bug、work blocker、observability alert、report comment 或普通任务。
- report、dashboard、external export、reconciliation、archive preparation、projection rebuild 和维护任务不得创建、批准、关闭、覆盖或回滚 Governance truth。
- 同步成功不得伪装 runtime cache、report、external GRC、observability 或 archive handoff 已完成。
- 除 `L0-core` 外,非 core sibling repo 不得成为编译期业务依赖。

---

## 4. 当前文档问题诊断

| 位置 / 来源 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | 旧 Draft 包含旧日期、旧 ADR、PostgreSQL、audit store、Policy engine、report、external GRC 和旧性能数字 | 容易作为隐性架构来源回流 | 不作为新版追溯主线,只作为历史风险来源 |
| 需求 Step 16 | 已建立需求层追溯矩阵 | 还需要架构层承接位置和成立理由 | 转成 §7.1 架构追溯矩阵 |
| 架构 Step 1 ~ Step 14 | 每步已有局部结论和回填草稿 | 关键决策尚未统一连接到需求、约束和风险来源 | 汇总为需求追溯、漏项检查和 ADR 候选索引 |
| Step 11 / Step 13 | 已有备选方案和演进债务 | 需要判断哪些长期取舍值得进入 ADR 索引 | 只保留改变主线结构的决策 |
| Step 14 | 有 API、schema、状态、产品、容量等待确认事项 | 容易在追溯阶段被误写成已定 ADR | 保留为漏项检查 / 待确认,不升格为已收敛结论 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 追溯来源 | 需求矩阵、架构步骤、风险和旧 Draft 线索分散 | 统一以新版需求基线和 Step 1 ~ Step 14 已确认结论为来源 | 防止旧口径和孤儿结论混入 |
| 追溯方式 | 容易写成章节目录对照 | 写成需求 / 约束 -> 架构承接结果 -> 承接位置 -> 成立理由 | 对齐书写规范 §4.16 |
| ADR 粒度 | 可能把产品、接口、字段或局部机制都写成 ADR | 只列长期影响 Governance 主线的架构决策候选 | 对齐书写规范 §4.17 |
| 待确认处理 | API、状态、schema、产品、容量可能被追溯阶段脑补 | 保留为漏项检查和后续文档阻塞口径 | 防止伪确定性 |
| 风险承接 | 风险分散在 Step 14 和各章节 | 纳入追溯矩阵和 ADR 候选说明 | 保证边界红线长期可追溯 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只列需求章节到架构章节的目录映射 | 短,容易写 | 不能证明具体承接关系,也无法发现孤儿结论 | 不采用 |
| 方案 B: 建立需求追溯矩阵、漏项检查表和 ADR 决策候选索引 | 可审查,能说明来源、承接、缺口和长期决策 | 文档较长,需要严格避免新增结论 | 采用 |
| 方案 C: 本步直接创建正式 ADR 文件 | ADR 体系看起来完整 | 超出当前 SOP Step,且会绕过 ADR 评审流程 | 不采用 |
| 方案 D: 把所有 Step 10 技术机制都写成 ADR | 表面完整 | 会把局部机制、产品候选和实现偏好噪音化 | 不采用 |

### 6.1 待确认问题的方案选择

#### API / 状态机 / schema 未闭合是否进入 ADR?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 为每个未闭合详细项建立 ADR 占位 | 会把未收稳问题升格为架构决定 |
| 方案 B | 留在 Step 14 风险和待确认事项,不进入 ADR | 保持 ADR 只记录已收稳长期决策 |

推荐方案 B。

#### 外围增强是否进入需求追溯矩阵?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不进入架构追溯 | 容易被误判为未承接需求 |
| 方案 B | 进入漏项 / 范围说明,按演进路线和风险挂起处理 | 保留来源,但不误升级为当前核心架构 |

推荐方案 B。

#### 旧架构文档中的 ADR 是否直接继承?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接继承旧 ADR 编号和状态 | 会把旧技术栈、旧边界和旧性能数字带入新架构 |
| 方案 B | 重新建立新版 ADR 候选索引,旧文档只作历史输入 | 保持新版架构真相源干净 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` §2 / Step 1 ARB-GOV-001 | `L1-governance` 是治理决策与治理控制真相仓 | 以独立 Governance truth 为架构核心,围绕 Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity、traceability 组织边界 | §2 业务背景与驱动力;§4 职责边界;§6 限界上下文;§9 数据所有权 | 架构把仓定位转译为独立 truth center,防止退化为审批 UI、policy cache、artifact 副本或 external GRC adapter。 |
| C-GOV-1 / FR-GOV-001 / FR-GOV-002 | 治理语境、适用对象、治理输入和可裁决语境必须成立 | 治理语境与裁决核心 + 治理输入收束上下文承接 actor、scope、对象、目的、责任语境和外部输入 | §4 职责边界;§5 系统边界与上下文;§6 限界上下文;§10 关键交互 | 架构允许外部触发、周期复核、风险信号和相邻仓请求进入,但必须经正式承接边界形成可裁决语境。 |
| C-GOV-2 / FR-GOV-003 / FR-GOV-004 | 关键节点正式治理裁决和自动化治理边界必须成立 | Gate / Decision、Approval / responsibility 和自动化治理边界由 Governance 同步收口 | §4 职责边界;§9 数据所有权;§10 关键交互;§13 横切关注点 | 裁决必须返回成立、拒绝、挂起、待人工或依据不足,不能由后台补写伪成功。 |
| C-GOV-3 / FR-GOV-005 / FR-GOV-006 | Policy 生效、shared rules、Control 适用与复核责任必须成立 | 治理策略与控制核心承载 Policy effective fact、shared rules、scope / priority / conflict 和 Control applicability / review | §6 限界上下文;§9 数据所有权;§11 关键技术选型;§13 横切关注点 | 架构将 Policy truth 与 AIPolicyDef、runtime cache、capability whitelist 和 rule engine 分离。 |
| C-GOV-4 / FR-GOV-007 / FR-GOV-008 | AIIA / SoA 治理评审结论和 Nonconformity 纠正闭环必须成立 | 合规结论与纠正核心承载 AIIA / SoA governance conclusion、Control coverage 和 Nonconformity corrective loop | §4 职责边界;§6 限界上下文;§9 数据所有权;§10 关键交互 | 架构只拥有治理结论、原因、纠正、复验和关闭,不拥有 artifact / evidence / method / standard 正文。 |
| C-GOV-5 / FR-GOV-009 / FR-GOV-010 | 治理事实必须可消费、可追溯、可维护、可对账、可归档准备 | 治理事实消费与追溯上下文、派生维护与交接上下文、只读派生和 handoff 承接 | §6 限界上下文;§9 数据所有权;§10 关键交互;§13 横切关注点 | 查询、report、dashboard、reconciliation、archive preparation 只能从 Governance truth 派生,不得反写真相。 |
| BR-GOV-001~BR-GOV-040 | 业务规则约束 Governance truth、边界、Policy、Control、合规、纠正、追溯和依赖 | 通过职责红线、数据归属、一致性、依赖裁剪、横切约束和风险表承接 | §4 职责边界;§8 依赖方向;§9 数据所有权;§13 横切关注点;§15 风险与待确认事项 | 架构把业务规则转译为不得串仓、不得正文入仓、不得派生反写、不得低 scope 覆盖 shared rules 等红线。 |
| `00_req_step_11_data_ownership.md` | Governance 只拥有治理事实;外部对象只能作为快照、引用或派生;正文禁止入仓 | Governance truth / external snapshot / reference / derived separation | §9 数据所有权与一致性策略;§11 关键技术选型;§12 备选方案与取舍 | 这是后续对象、协议、存储和测试都必须继承的核心数据边界。 |
| `00_req_step_12_interfaces_dependencies.md` / Step 7 | `L0-core` 是唯一编译期依赖;其他仓通过运行期、事件、ref、snapshot、safe summary 或 handoff 协作 | 依赖方向图、依赖倒置表、禁止依赖表和依赖裁剪图承接 | §8 依赖方向与层间约束;§11 关键技术选型;§15 风险与待确认事项 | 架构明确非 core sibling 不进入编译期依赖,防止 L1 平权 truth 域被打穿。 |
| `00_req_step_13_non_functional_requirements.md` | 安全、可追溯、幂等、顺序、一致性、可观测、配置和性能预算必须有结构性口径 | 横切关注点和机制级技术选型承接正式入口、Policy / shared rules、失败状态、幂等顺序和配置不可越界 | §11 关键技术选型;§13 横切关注点;§14 演进路线 | 架构保留质量底线,但不预支监控字段、配置 key、压测脚本或旧性能数字。 |
| AC-GOV / VF-GOV 验收与否决项 | 核心闭环断裂、治理事实污染、边界打穿、关键变化不可追溯、非 core 编译依赖均不能通过 | 风险表、漏项检查和 ADR 候选索引长期保留这些红线 | §15 风险与待确认事项;§16 需求追溯矩阵;§17 ADR 索引 | 架构把验收否决项转译为长期可追溯的决策和阻塞风险。 |
| FR-GOV-E01~FR-GOV-E06 | 高级治理看板、Policy DSL、复杂 Gate、自动草拟、external GRC、健康度分析为外围增强 | 演进路线和待确认事项承接,不作为当前核心闭环成立前置 | §12 备选方案与取舍;§14 演进路线;§15 风险与待确认事项 | 外围增强已被承接,但不得让 report、rule engine、external GRC 或健康分析反向定义 Governance truth。 |
| Step 14 风险与待确认事项 | API、状态、schema、产品、容量、交接细节未闭合但不推翻架构边界 | 作为后续概要 / 详细 / 测试 / 配置 / 实施阶段必须闭合的挂起项 | §15 风险与待确认事项;§16 需求追溯矩阵 | 架构层不补字段、不选产品、不造状态,但明确实现阶段不得自行补真相源。 |

### 7.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | C-GOV-1 ~ C-GOV-5 | 架构主线、职责边界、数据归属、关键交互、横切关注点 | 无缺口 | 核心闭环均已映射到明确架构承接结果。 |
| 需求未被承接 | FR-GOV-001 ~ FR-GOV-010 | 核心功能、数据归属、交互、风险和验收 | 无缺口 | 核心功能均已由核心子域、支撑上下文、正式承接边界和一致性策略承接。 |
| 需求未被承接 | FR-GOV-E01 ~ FR-GOV-E06 外围增强 | 演进路线、派生消费、rule engine / external GRC / report 候选 | 已挂起,非缺口 | 外围增强已按演进和待确认事项承接,不作为当前核心闭环前置。 |
| 架构判断缺来源 | 独立 Governance truth、Policy truth 分离、正文排除、派生不反写、依赖裁剪、同步 / 异步 / 后台分离 | 架构主线 | 无缺口 | 均可追溯到需求定位、数据归属、接口依赖、非功能、验收和风险章节。 |
| 承接关系未闭合 | API / Command / Query / Event / Job / DTO 名称、字段和错误语义 | 概要设计、详细设计、测试方案、实现 boundary | 保留为待确认 | 架构只承接能力类别和交互方式,不能在 Step 15 补字段。 |
| 承接关系未闭合 | Governance 对象 schema、状态集、迁移规则、持久化和 repository 契约 | 详细设计、状态矩阵、持久化、测试方案 | 保留为待确认 | 后续设计必须闭合后才可实现,不能由实现侧补真相源。 |
| 承接关系未闭合 | Gate 六类可解释语境、Policy 冲突 / shared rules、Control / AIIA / SoA、Nonconformity 详细口径 | 详细对象契约、协议、状态、测试 | 保留为待确认 | 不改变当前架构主线,但会阻塞对应 detailed boundary。 |
| 承接关系未闭合 | report / dashboard / external GRC export / archive handoff / observability handoff schema | 派生消费、外部导出、归档交接、测试 | 保留为待确认 | 当前只固定只读派生和 handoff 接缝。 |
| 承接关系未闭合 | 旧性能数字、SLO、容量、DB、message bus、cache、search、rule engine、object storage、external GRC 产品 | 测试方案、配置设计、实施计划 | 保留为待确认 | 当前不继承旧指标,不锁产品。 |
| ADR 缺口 | `L1-governance` 专项正式 ADR 文件 | 长期架构决策评审 | 正式 ADR 尚未建立 | 本步只形成决策候选索引,不伪装成已评审 ADR。 |

### 7.3 ADR 决策候选索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立 Governance truth 作为 `L1-governance` 架构核心 | 防止治理事实散落到 process、work、artifact、runtime、conversation、workspace、observability、archive 或 external GRC 中形成多真相 | 职责边界 / 数据所有权 / 备选方案 / 风险 | 这是本仓存在和后续设计的根决策,值得单独建立正式 ADR。 |
| 未建立 | Gate / Decision truth 与 process waiting state、work lifecycle、conversation display、runtime cache 和 workspace view 分离 | 防止过程等待、工作状态、UI 显化或执行缓存替代正式治理裁决 | 职责边界 / 系统上下文 / 关键交互 / 风险 | 该决策长期保护关键节点治理裁决的正式性。 |
| 未建立 | Policy effective fact / shared rules 归 Governance,并与 AIPolicyDef、runtime cache、capability whitelist、rule engine 和 external GRC status 分离 | 防止定义层、执行层、工具层或外部系统反向定义 Policy truth | 数据所有权 / 技术机制 / 横切安全 / 演进路线 | 该决策长期影响 Policy、automation boundary、runtime consumption 和 shared rules 设计。 |
| 未建立 | Control / AIIA / SoA governance conclusion 与 artifact / evidence / method / standard 正文分离 | 防止 Governance 保存第二份合规正文或接管外部材料生命周期 | 数据归属 / 合规结论 / 追溯 / handoff | 该决策长期保护 artifact、method-library、archive 和 Governance 的正文边界。 |
| 未建立 | Nonconformity corrective loop 归 Governance,并与 bug、work blocker、observability alert、report comment 分离 | 防止不符合纠正闭环退化为普通任务、阻塞、告警或报表备注 | 合规纠正 / 关键交互 / 风险 | 该决策长期保护不符合、原因、纠正、复验和关闭的治理语义。 |
| 未建立 | 非 `L0-core` sibling 仓通过运行期接缝、引用、快照、safe summary、event 和 handoff 协作 | 防止 L1 / L2 / L3 / L4 仓通过源码依赖形成隐式上下级和循环依赖 | 依赖方向 / 技术机制 / 实施约束 | 该决策长期保护全局依赖裁剪和 L1 平权 truth 域。 |
| 未建立 | 采用 Governance truth / external snapshot / reference / derived separation | 防止正式治理事实、外部正文、外部生命周期、引用和派生视图混成一类数据 | 数据所有权 / 一致性策略 / 详细设计约束 | 该决策会长期影响对象 schema、持久化、查询、投影和测试。 |
| 未建立 | 核心治理事实强一致,外围消费、派生、导出和 handoff 最终一致 | 防止核心裁决半成立,同时避免下游显化、report、archive、external GRC 阻塞主真相 | 一致性策略 / 关键交互 / 韧性 | 该决策长期影响失败状态、stale / failed / retryable marker 和恢复方式。 |
| 未建立 | 同步核心治理判断、异步事实传播 / 外部结果送达、后台派生 / 对账 / 交接三类路径分离 | 防止全同步拖重主链或全异步导致裁决成立口径不清 | 容器部署 / 关键交互 / 技术机制 | 该决策长期影响 API、consumer、publisher、job、projection 和 reconciliation 分工。 |
| 未建立 | 派生视图、report、dashboard、external export、reconciliation、archive preparation 只读消费,不得反写真相 | 防止查询、报表、外部导出、维护或归档准备成为第二业务写源 | 数据所有权 / 横切关注点 / 风险 | 该决策长期保护 read model / write model / maintenance model 边界。 |
| 未建立 | 关键治理变化、消费、维护、报告和交接采用 traceability / evidence / handoff 语义 | 防止治理事实无法解释 actor、scope、basis、reason、result、consumer 和 handoff 状态 | 横切追溯 / observability / archive / 验收 | 该决策长期支撑审计、复盘、归档准备和外部消费解释。 |
| 未建立 | 产品级 DB、message bus、cache、search、rule engine、Policy DSL、external GRC、report 工具、完整 ES / CQRS 和旧性能数字暂不作为当前架构硬选型 | 防止旧 Draft 技术、产品设施或伪量化指标反向决定架构边界 | 技术选型 / 备选方案 / 演进路线 / 风险 | 该决策保留后续实施空间,但要求后续产品选择不得推翻已收稳边界。 |

### 7.4 追溯范围说明

本章采用关键需求结论和关键架构约束为追溯粒度,不把 Step 1 ~ Step 14 的每一行表格机械展开为目录对照。主矩阵只记录已经成立的来源到承接关系,漏项检查表只记录当前是否仍有追溯缺口或后续详细设计挂起项。

当前没有已评审通过的 `L1-governance` 专项 ADR 文件,因此 ADR 表采用“决策候选索引”口径,不替代正式 ADR 文件。API、状态机、schema、存储、产品级技术选择、容量数字和交接协议已经在 Step 14 风险与待确认事项中挂起,当前不补写为确定架构结论。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §16 “需求追溯矩阵”直接摘录并整理本文件 §7.1、§7.2 和 §7.4。
- §17 “ADR 索引”直接摘录并整理本文件 §7.3 和 §7.4。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 进入下一步条件

- 已明确哪些架构决定需要 ADR。
- 已建立关键需求、约束和风险与架构承接结果之间的追溯关系。
- 已明确承接位置和承接理由。
- 已检查核心需求、关键约束和长期架构决定没有孤儿项。
- 未在追溯矩阵或 ADR 索引中新增前文未确认的架构结论。
- 未把未闭合的详细设计问题、产品技术选择或局部实现偏好升格为 ADR。

结论:可以进入 Step 16 “整理正式文档”。
