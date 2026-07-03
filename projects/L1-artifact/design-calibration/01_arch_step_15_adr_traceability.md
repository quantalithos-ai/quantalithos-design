# Step 15. ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 回填章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 ~ Step 14 已经收稳的 `L1-artifact` 关键架构决定与需求来源、约束来源、取舍来源和风险来源显式连接起来,并沉淀后续需要长期保留的 ADR 决策候选索引。

本步只做追溯映射、漏项检查、架构决定停审和 ADR 候选索引,不新增架构结论,不创建正式 ADR 文件,不补写 API / Command / Query / Event / Job / DTO、对象 schema、状态机、数据库、content backend、hash 算法、graph engine、搜索产品或实施边界,也不把 Step 14 已挂起的待确认事项润色成已闭合事实。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 已按需求 SOP 重建 | 提供正式需求来源、功能需求、业务规则、数据归属、验收和风险基线。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 提供 `FR-ART-001~020` 与核心能力、故事、规则、数据归属和验收的需求层追溯关系。 |
| `design-calibration/01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、旧 Draft 回流风险、硬约束和验收否决项。 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做 / 易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供系统上下文、输入面、输出面和相邻仓协作定位。 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供 Artifact truth core、外部承接、派生消费和交接上下文边界。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、派生承载和交接承载角色。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供 `L0-core` 唯一编译期依赖和非 core sibling 运行期协作口径。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 Artifact truth / external reference / snapshot / derived separation 和一致性策略。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台交互分工、失败状态和交接语义。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 提供机制级技术选型和当前不采用口径。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线方案、替代路径和路径级取舍。 |
| `design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 提供安全、观测、韧性、性能、配置和追溯横切约束。 |
| `design-calibration/01_arch_step_13_evolution_path.md` | 已完成 | 提供当前阶段成立条件、可接受债务、不可接受债务和演进触发条件。 |
| `design-calibration/01_arch_step_14_risks_open_questions.md` | 已完成 | 提供正式风险、待确认事项、当前处理口径和阻塞判断。 |
| `projects/L1-governance/design-calibration/01_arch_step_15_adr_traceability.md` | 已参考 | 只参考“追溯矩阵 + 漏项检查 + ADR 候选索引 + 停审”的组织方式,不复制治理仓结论。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 15 | 已读取 | 控制 ADR / 追溯问题、停审和跨审计要求。 |
| `standards/document/架构设计书写规范.md` §4.16 / §4.17 | 已读取 | 控制需求追溯矩阵、漏项检查表、ADR 索引表和边界说明写法。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 14、SOP Step 15 和书写规范 4.16 / 4.17 | done | 本文件 §2 |
| 读取需求追溯矩阵、前序架构结论和 L1-governance Step 15 框架 | done | 本文件 §2 / §5 |
| 回答 ADR 候选、需求来源、孤儿结论、核心需求承接和长期红线问题 | done | 本文件 §4 |
| 输出需求追溯矩阵、漏项检查、ADR 候选索引、架构决定停审和跨审计表 | done | 本文件 §7 |
| 写出 Step 16 可回填草稿并更新 flow / 项目台账 | done | 本文件 §8 |

---

## 4. SOP 问题回答

### 4.1 哪些架构决定需要沉淀为 ADR?

应进入 ADR 索引的是会长期影响 Artifact truth、仓际边界、数据归属、一致性、依赖裁剪、外部正文、version / lineage / baseline、派生消费、追溯交接和演进方式的架构决定。当前建议沉淀的 ADR 候选包括:

1. 以独立 Artifact truth 作为 `L1-artifact` 架构核心。
2. Artifact truth 与 work / process / governance / conversation / workspace / runtime / method / observability / archive / sync truth 分离。
3. Artifact truth、external reference、snapshot 和 derived material 分层。
4. 外部正文与 Artifact content fact context 分离。
5. Artifact version / lineage / baseline 锚定正式 Artifact fact / version。
6. 核心 Artifact truth 强一致,派生消费、report、reconciliation、archive / observability / sync handoff 最终一致。
7. 同步核心判断、异步外部输入 / 变化传播、后台派生 / 对账 / 交接三类路径分离。
8. Search / preview / projection / report / reconciliation / archive / observability / sync material 只读消费,不得反写 Artifact truth。
9. 非 `L0-core` sibling 仓通过运行期接缝、引用、快照、safe summary、event、adapter 和 handoff 协作。
10. 关键 Artifact truth 变化、消费、维护、报告和交接必须有 traceability / audit backref / handoff 语义。
11. 配置不得改变 truth ownership、外部正文边界、同步 / 异步 / 后台边界和派生不反写规则。
12. DB、object store、Git、search、graph、message、hash、完整 ES / CQRS 和旧性能数字暂不作为当前架构硬选型。

### 4.2 每个关键架构决定对应哪些需求、约束或风险来源?

完整映射见 §7.1 需求追溯矩阵和 §7.3 ADR 决策候选索引。当前关键架构决定均可追溯到新版 `00-需求文档.md` 的仓定位、核心能力闭环、`FR-ART-001~020`、`BR-ART-001~025`、数据归属要求、NFR / AC / VF 验收约束,以及 Step 1 ~ Step 14 已收稳的架构目标、职责边界、系统上下文、限界上下文、依赖方向、数据所有权、通信方式、技术机制、方案取舍、横切约束、演进债务和风险红线。

### 4.3 是否存在没有需求来源的架构设计?

当前结论为否。进入正式架构主线的判断都能追溯到需求基线、需求追溯矩阵、数据归属、接口依赖边界、非功能约束、验收否决项、风险挂起口径或 Step 1 ~ Step 14 的已确认取舍。

旧 `01-架构设计.md` 中的 content backend、Git / S3 / URL / DB 直接方案、hash scan、relation graph、旧 kind / relation 数量、旧 P95 / P99 / SLA / 容量数字和旧技术栈,没有被作为新版架构来源直接继承。

### 4.4 是否存在没有架构承接的核心需求或关键约束?

当前结论为否。`FR-ART-001~020` 已分别被 Artifact fact、version、lineage、baseline 和 consumable reference 主线承接;`BR-ART-001~025` 已被职责边界、数据所有权、一致性策略、依赖裁剪、横切约束和风险章节承接;外部正文禁止入仓、非 core sibling 不做编译期依赖、消费方不得反写 truth、version / lineage / baseline 稳定追溯等关键约束均已落到架构章节。

外围增强、产品级技术选择、状态机、schema、port、配置 key、测试证据和实施 boundary 不是未承接核心需求,而是已按后续设计 / 配置 / 测试 / 实施阶段挂起。

### 4.5 哪些取舍和红线必须长期可追溯?

必须长期可追溯的红线包括:

- Artifact truth 不得被 work lifecycle、process execution、governance decision、conversation display、workspace view、runtime material、method definition body、observability ledger、archive package 或 sync private copy 替代。
- Artifact fact、content fact context、version、lineage、baseline 和 consumption backref 必须保留本仓独立 ownership。
- 外部正文、runtime output、method body、archive body、observability record、事件正文和消费方私有副本不得进入 Artifact truth 生命周期。
- Version 不得被 current latest、候选修订、自动化再生成、外部状态或消费副本无声覆盖。
- Lineage 不得由 runtime trace、tool result、model context、event stream、observability record、graph query 或私有追溯链补造。
- Baseline 不得由发布说明、治理裁决、项目状态、归档包、临时清单或 current version 集合替代。
- Search、preview、projection、report、reconciliation、archive / observability / sync handoff 不得创建、覆盖、回滚或反写 Artifact truth。
- 同步成功不得伪装 report、archive、observability、sync 或下游消费已完成。
- 除 `L0-core` 外,非 core sibling repo 不得成为编译期业务依赖。
- 配置不得暗改 truth owner、外部正文边界、同步 / 异步 / 后台路径或只读派生规则。

### 4.6 每个关键架构决定是否通过停审?

当前进入 ADR 候选索引的决策均满足三项停审条件:属于架构层决策,具备长期影响,可回指需求 / 约束 / 风险 / 取舍来源。没有把 API 字段、数据库、对象存储、hash 算法、graph engine、搜索产品、性能数字、状态机或实施动作塞入 ADR。

---

## 5. 当前文档问题诊断

| 位置 / 来源 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | 旧 Draft 包含 content backend、metadata-first、relation graph、hash scan、Git / S3 / DB / URL、旧指标和旧对象数量 | 容易作为隐性架构来源回流 | 不作为新版追溯主线,只作为历史风险来源。 |
| 需求 Step 16 | 已建立 `FR-ART-001~020` 的需求层追溯矩阵 | 还需要架构层承接位置和成立理由 | 转成 §7.1 架构追溯矩阵。 |
| 架构 Step 1 ~ Step 14 | 每步已有局部结论和回填草稿 | 关键决策尚未统一连接到需求、约束、风险和取舍来源 | 汇总为需求追溯、漏项检查、停审和 ADR 候选索引。 |
| Step 10 / Step 11 / Step 13 | 已有机制选型、备选方案和演进债务 | 需要判断哪些长期取舍值得进入 ADR 索引 | 只保留改变主线结构的决策。 |
| Step 14 | 有 taxonomy、状态、schema、协议、产品、容量等待确认事项 | 容易在追溯阶段被误写成已定 ADR | 保留为漏项检查 / 待确认,不升格为已收敛结论。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只列需求章节到架构章节的目录映射 | 短,容易写 | 不能证明具体承接关系,也无法发现孤儿结论 | 不采用。 |
| 方案 B: 建立需求追溯矩阵、漏项检查表、ADR 候选索引、架构决定停审和跨审计 | 可审查,能说明来源、承接、缺口和长期决策 | 文档较长,需要严格避免新增结论 | 采用。 |
| 方案 C: 本步直接创建正式 ADR 文件 | ADR 体系看起来完整 | 超出当前 SOP Step,且会绕过 ADR 评审流程 | 不采用。 |
| 方案 D: 把所有 Step 10 技术机制和产品候选都写成 ADR | 表面完整 | 会把局部机制、产品候选和实现偏好噪音化 | 不采用。 |

### 6.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| API / 状态机 / schema 未闭合是否进入 ADR | A. 建 ADR 占位;B. 留在 Step 14 风险和待确认事项 | B | 未闭合详细项不是已收稳架构决定。 |
| 外围增强是否进入需求追溯矩阵 | A. 不进入;B. 进入漏项 / 范围说明并按演进和待确认处理 | B | 避免被误判为未承接,但不升级为当前核心前置。 |
| 旧架构文档中的方案是否直接继承 | A. 继承旧方案;B. 重新建立新版追溯和 ADR 候选索引 | B | 防止旧技术栈、旧指标和旧对象数量污染新版架构。 |
| content backend / hash / graph / search 是否现在定论 | A. 现在定论;B. 作为 ADR 候选或后续设计输入挂起 | B | 当前只固定边界和机制口径,不由产品设施定义 truth。 |

---

## 7. 结构化中间产物

### 7.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` §2 / Step 1 ARB-ART-001 | `L1-artifact` 是可审计制品真相仓 | 以独立 Artifact truth 为架构核心,围绕 fact、content fact context、version、lineage、baseline、consumption backref 和 traceability 组织边界 | §2 业务背景与驱动力;§4 职责边界;§6 限界上下文;§9 数据所有权 | 架构把仓定位转译为独立 truth center,防止退化为附件库、内容后端、视图仓或归档包。 |
| `FR-ART-001~004` / 制品事实承载 | 平台产出和自动化产出必须进入正式 Artifact fact,并与派生材料区分 | Artifact truth core + 正式纳管入口 + external reference / snapshot / derived separation 承接 | §4 职责边界;§5 系统上下文;§6 限界上下文;§9 数据所有权 | 需求侧的 fact 入口要求在架构侧转译为正式边界、外部输入承接和派生不得替代 fact。 |
| `FR-ART-005~008` / 制品版本化 | Artifact 修订、替代、历史版本和自动化迭代必须稳定可追溯 | Version 作为 Artifact truth 主线,同步形成 / 拒绝 / 挂起,不得被 current latest 或再生成结果覆盖 | §6 限界上下文;§9 数据所有权;§10 关键交互;§13 横切关注点 | 需求侧版本稳定性被架构承接为强一致核心判断和不可无声覆盖红线。 |
| `FR-ART-009~012` / 制品血缘关联 | Artifact 来源、影响、替代、依赖和跨仓消费追溯必须正式成立 | Lineage truth 锚定正式 fact / version;trace、event、tool output 和 graph query 只能作为线索或派生 | §6 限界上下文;§9 数据所有权;§10 关键交互;§11 关键技术选型 | 架构保护血缘不被 runtime trace、event stream 或查询图补造。 |
| `FR-ART-013~016` / 制品基线冻结 | 一组正式 Artifact version 必须形成受控冻结集合并可历史回溯 | Baseline truth 归 `L1-artifact`,外部发布说明、治理裁决、项目状态和归档包只能引用或消费 | §4 职责边界;§6 限界上下文;§9 数据所有权;§10 关键交互 | 架构把需求侧冻结集合转译为 Artifact-owned baseline,防止外部集合替代。 |
| `FR-ART-017~020` / 制品事实可消费表达 | 相邻仓必须稳定引用和消费 Artifact truth,但不得复制、反写或迁移 ownership | Consumable reference / read surface / projection / sync / handoff 只读消费并回指正式 Artifact truth | §5 系统上下文;§8 依赖方向;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构允许消费和交接,但把消费副本、视图、report、sync private state 明确排除为 truth source。 |
| `BR-ART-001~025` | 业务规则保护 truth 入口、禁止覆盖、禁止补造、基线冻结和消费回指 | 通过职责红线、数据归属、一致性策略、依赖裁剪、横切约束和风险表承接 | §4 职责边界;§8 依赖方向;§9 数据所有权;§13 横切关注点;§15 风险与待确认事项 | 架构把业务规则转译为不得串仓、不得正文入仓、不得派生反写、不得外部补造 truth 等红线。 |
| `00_req_step_11_data_ownership.md` | Artifact truth、快照、引用、禁止正文必须分离 | Artifact truth / external reference / snapshot / derived material / forbidden body separation | §9 数据所有权与一致性策略;§11 关键技术选型;§12 备选方案与取舍 | 这是后续对象、协议、持久化和测试都必须继承的核心数据边界。 |
| `00_req_step_12_interfaces_dependencies.md` / 全局裁剪规则 | `L0-core` 是唯一编译期依赖;非 core sibling 只能运行期、事件、ref、snapshot、safe summary 或 handoff 协作 | 依赖方向图、依赖倒置表、禁止依赖表和运行期协作口径承接 | §8 依赖方向与层间约束;§11 关键技术选型;§15 风险与待确认事项 | 架构明确非 core sibling 不进入编译期依赖,保护 L1 平权 truth 域。 |
| `00_req_step_13_non_functional_requirements.md` | 安全、追溯、幂等、顺序、一致性、观测、配置和性能预算必须有结构性口径 | 横切关注点和机制级技术选型承接正式入口、失败状态、幂等顺序、配置不可越界和核心 / 外围分离 | §11 关键技术选型;§13 横切关注点;§14 演进路线 | 架构保留质量底线,但不预支监控字段、配置 key、压测脚本或旧性能数字。 |
| AC-ART / VF-ART 验收与否决项 | 核心闭环断裂、truth ownership 串线、版本 / 血缘 / 基线不可追溯、消费方反写均不能通过 | 风险表、漏项检查、ADR 候选索引和 Step 16 装配门禁长期保留这些红线 | §15 风险与待确认事项;§16 需求追溯矩阵;§17 ADR 索引 | 架构把验收否决项转译为长期可追溯的决策和阻塞风险。 |
| Step 14 风险与待确认事项 | taxonomy、状态、schema、协议、产品、容量、交接细节未闭合但不推翻架构边界 | 作为后续概要 / 详细 / 测试 / 配置 / 实施阶段必须闭合的挂起项 | §15 风险与待确认事项;§16 需求追溯矩阵 | 架构层不补字段、不选产品、不造状态,但明确实现阶段不得自行补真相源。 |

### 7.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | `FR-ART-001~020` | 架构主线、职责边界、数据归属、关键交互、横切关注点 | 无缺口 | 核心功能均已映射到 Artifact fact、version、lineage、baseline 和 consumable reference 主线。 |
| 需求未被承接 | `BR-ART-001~025` | truth 入口、禁止覆盖、禁止补造、冻结集合、消费回指 | 无缺口 | 业务规则已被职责红线、数据所有权、一致性策略、依赖裁剪、横切约束和风险表承接。 |
| 需求未被承接 | 外围增强、搜索、预览、report、sync、archive / observability handoff | 演进路线、派生消费、交接边界 | 已挂起,非缺口 | 外围增强已按只读派生、最终一致、后续演进和待确认事项处理,不作为当前核心闭环前置。 |
| 架构判断缺来源 | 独立 Artifact truth、外部正文分离、version / lineage / baseline 锚定、派生不反写、依赖裁剪、同步 / 异步 / 后台分离 | 架构主线 | 无缺口 | 均可追溯到需求定位、数据归属、接口依赖、NFR、验收和风险章节。 |
| 承接关系未闭合 | API / Command / Query / Event / Job / DTO 名称、字段和错误语义 | 概要设计、详细设计、测试方案、实现 boundary | 保留为待确认 | 架构只承接能力类别和交互方式,不能在 Step 15 补字段。 |
| 承接关系未闭合 | Artifact 对象 schema、状态集、transition、持久化和 repository 契约 | 详细设计、状态矩阵、持久化、测试方案 | 保留为待确认 | 后续设计必须闭合后才可实现,不能由实现侧补真相源。 |
| 承接关系未闭合 | content backend、hash、content-addressing、graph engine、search product、message product | 技术选型、配置设计、实施计划 | 保留为待确认 | 当前只固定边界和机制口径,不让产品选择反向定义 truth。 |
| 承接关系未闭合 | archive / observability / sync handoff schema、回链验证、失败恢复 | 派生消费、归档交接、观测交接、同步交接、测试 | 保留为待确认 | 当前只固定 handoff 接缝、回指语义和接收方不得反写 truth。 |
| ADR 缺口 | `L1-artifact` 专项正式 ADR 文件 | 长期架构决策评审 | 正式 ADR 尚未建立 | 本步只形成决策候选索引,不伪装成已评审 ADR。 |

### 7.3 ADR 决策候选索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立 Artifact truth 作为 `L1-artifact` 架构核心 | 防止制品事实散落到 work、process、governance、conversation、workspace、runtime、method、observability、archive 或 sync 中形成多真相 | 职责边界 / 数据所有权 / 备选方案 / 风险 | 这是本仓存在和后续设计的根决策,值得单独建立正式 ADR。 |
| 未建立 | Artifact truth 与相邻仓 truth 分离 | 防止工作状态、过程执行、治理裁决、对话显化、工作台视图、运行材料、方法定义、观测记录、归档包或同步副本替代制品事实 | 系统上下文 / 数据归属 / 依赖方向 / 风险 | 该决策长期保护 L1 平权 truth 域和相邻仓协作边界。 |
| 未建立 | 采用 Artifact truth / external reference / snapshot / derived material separation | 防止正式制品事实、外部正文、外部生命周期、快照摘要和派生视图混成一类数据 | 数据所有权 / 一致性策略 / 详细设计约束 | 该决策会长期影响对象 schema、持久化、查询、投影和测试。 |
| 未建立 | 外部正文与 Artifact content fact context 分离 | 防止 Git / S3 / URL / DB / runtime output / method body / archive body / observability body 进入 Artifact truth 生命周期 | 数据归属 / 技术机制 / 横切安全 / 演进路线 | 该决策长期保护内容来源、完整性候选和 Artifact truth 的边界。 |
| 未建立 | Artifact version / lineage / baseline 锚定正式 Artifact fact / version | 防止 current latest、trace、event stream、graph query、release note、治理裁决或归档包替代正式版本、血缘和基线 | 核心语义 / 关键交互 / 风险 / 验收 | 该决策长期保护历史版本、血缘解释和冻结集合。 |
| 未建立 | 核心 Artifact truth 强一致,外围派生和 handoff 最终一致 | 防止核心事实半成立,同时避免 search、report、archive、observability、sync 阻塞主真相 | 一致性策略 / 关键交互 / 韧性 | 该决策长期影响失败状态、stale / rebuilding / failed / retryable marker 和恢复方式。 |
| 未建立 | 同步核心判断、异步输入 / 传播、后台派生 / 对账 / 交接三类路径分离 | 防止全同步拖重主链或全异步导致 Artifact truth 成立口径不清 | 容器部署 / 关键交互 / 技术机制 | 该决策长期影响 API、consumer、publisher、job、projection 和 reconciliation 分工。 |
| 未建立 | 派生视图、search、preview、report、reconciliation、archive / observability / sync material 只读消费 | 防止查询、报表、维护、归档准备或同步材料成为第二业务写源 | 数据所有权 / 横切关注点 / 风险 | 该决策长期保护 read model / write model / maintenance model 边界。 |
| 未建立 | 非 `L0-core` sibling 仓通过运行期接缝、引用、快照、safe summary、event、adapter 和 handoff 协作 | 防止 L1 / L2 / L3 / L4 / L5 仓通过源码依赖形成隐式上下级和循环依赖 | 依赖方向 / 技术机制 / 实施约束 | 该决策长期保护全局依赖裁剪和本仓可独立落码性。 |
| 未建立 | 关键 Artifact truth 变化、消费、维护、报告和交接采用 traceability / audit backref / handoff 语义 | 防止制品事实无法解释 actor、source、scope、basis、reason、result、version、lineage、baseline、consumer 和 handoff 状态 | 横切追溯 / observability / archive / 验收 | 该决策长期支撑审计、复盘、归档准备、观测交接和外部消费解释。 |
| 未建立 | 配置不得改变 truth ownership、外部正文边界、同步 / 异步 / 后台边界和派生不反写规则 | 防止配置层暗改架构主线或绕过正式边界 | 横切配置 / 实施约束 / 风险 | 该决策长期保护配置设计和运行降级不成为 hidden architecture。 |
| 未建立 | 产品级 DB、object store、Git、search、graph、message、hash、完整 ES / CQRS 和旧性能数字暂不作为当前架构硬选型 | 防止旧 Draft 技术、产品设施或伪量化指标反向决定架构边界 | 技术选型 / 备选方案 / 演进路线 / 风险 | 该决策保留后续实施空间,但要求产品选择不得推翻已收稳边界。 |

### 7.4 架构决定停审记录

| 架构决定 | 是否值得长期保留 | 来源是否明确 | 是否新增未确认结论 | 停审结论 |
|---|---|---|---|---|
| 独立 Artifact truth | 是 | 需求定位、核心闭环、数据归属、验收否决项 | 否 | pass |
| 相邻仓 truth 分离 | 是 | 职责边界、系统上下文、依赖裁剪、风险表 | 否 | pass |
| truth / reference / snapshot / derived separation | 是 | 数据归属、NFR、备选方案、风险表 | 否 | pass |
| 外部正文与 content fact context 分离 | 是 | 数据归属、横切安全、技术选型、演进路线 | 否 | pass |
| Version / lineage / baseline 正式锚定 | 是 | 功能需求、业务规则、关键交互、验收否决项 | 否 | pass |
| 核心强一致 + 外围最终一致 | 是 | 一致性策略、关键交互、韧性约束、演进路线 | 否 | pass |
| 同步 / 异步 / 后台路径分离 | 是 | 容器部署、关键交互、技术机制、性能预算 | 否 | pass |
| 派生和 handoff 只读消费 | 是 | 数据归属、横切追溯、风险表、验收否决项 | 否 | pass |
| 非 core sibling 运行期协作 | 是 | 全局依赖裁剪、依赖方向、系统上下文 | 否 | pass |
| Traceability / audit backref / handoff | 是 | NFR、横切关注点、archive / observability / sync 边界 | 否 | pass |
| 配置不可越界 | 是 | 横切配置、风险表、后续配置设计约束 | 否 | pass |
| 产品和旧指标不作为硬选型 | 是 | 技术选型、备选方案、演进路线、旧材料诊断 | 否 | pass |

### 7.5 跨 ADR / 需求追溯审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿架构决定 | 否 | ADR 候选均可回指需求、约束、风险或取舍来源。 |
| 是否存在孤儿核心需求 | 否 | `FR-ART-001~020`、`BR-ART-001~025`、数据归属、NFR 和 VF 均已找到架构承接。 |
| 是否存在普通实现选择误入 ADR | 否 | DB、object store、Git、hash、graph、search、message、字段、状态机和实施动作未进入 ADR 候选。 |
| 是否存在旧材料污染 | 否 | 旧技术栈、旧指标、旧 kind / relation 数量和旧 content backend 只作为历史风险,未成为追溯来源。 |
| 是否存在新增未确认结论 | 否 | 本步只整理 Step 1 ~ Step 14 已收稳结论和需求 Step 16 追溯结果。 |
| 是否存在待确认事项被伪装为已闭合 | 否 | Taxonomy、状态、schema、协议、产品、容量、handoff schema 仍保留为待确认。 |
| 是否存在 ADR 与追溯职责混写 | 否 | §7.1 写来源到承接关系,§7.3 写长期决策索引,两者职责分离。 |

### 7.6 追溯范围说明

本章采用关键需求结论和关键架构约束为追溯粒度,不把 Step 1 ~ Step 14 的每一行表格机械展开为目录对照。主矩阵只记录已经成立的来源到承接关系,漏项检查表只记录当前是否仍有追溯缺口或后续详细设计挂起项。当前没有已评审通过的 `L1-artifact` 专项 ADR 文件,因此 ADR 表采用“决策候选索引”口径,不替代正式 ADR 文件。API、状态机、schema、存储、产品级技术选择、容量数字和交接协议已经在 Step 14 风险与待确认事项中挂起,当前不补写为确定架构结论。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §16 “需求追溯矩阵”直接摘录并整理本文件 §7.1、§7.2、§7.5 和 §7.6。
- §17 “ADR 索引”直接摘录并整理本文件 §7.3、§7.4、§7.5 和 §7.6。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 进入下一步条件

- 已明确哪些架构决定需要 ADR。
- 已建立关键需求、约束和风险与架构承接结果之间的追溯关系。
- 已明确承接位置和承接理由。
- 已检查核心需求、关键约束和长期架构决定没有孤儿项。
- 已完成每个关键架构决定的停审记录。
- 已完成跨 ADR / 需求追溯审计。
- 未在追溯矩阵或 ADR 索引中新增前文未确认的架构结论。
- 未把未闭合的详细设计问题、产品技术选择或局部实现偏好升格为 ADR。

结论:可以进入 Step 16 “整理正式文档”。
