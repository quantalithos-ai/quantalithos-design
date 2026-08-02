# Step 15. ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 回填章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 15 | pass。用户已确认 Step 14 `风险与待确认事项`,可进入 Step 15。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `project_execution_ledger.md`、`01_architecture_calibration_flow.md` 和 `01_arch_step_14_risks_open_questions.md`,并按需回看 Step 1~13 的核心边界、数据、依赖、交互、技术取舍和横切约束。 |
| 是否已读取架构 SOP Step 15 与书写规范 §4.16 / §4.17 | pass。已读取 ADR / 需求追溯的输入、输出、固定表结构、完成标准和禁止写法。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md`,重点校验 C-SBX-1~5、FR-SBX-001~018、FR-SBX-E01~E06、BR-SBX-001~033、数据归属、接口依赖、NFR、AC-SBX-001~041 和 VF-SBX-001~010。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_15_adr_traceability.md` 和 `projects/L1-governance/design-calibration/01_arch_step_15_adr_traceability.md` 的组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_15_adr_traceability.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

把 Step 1~14 已经收稳的 `L4-sandbox` 关键架构决定与需求来源、约束来源、取舍来源和风险来源显式连接起来,并沉淀后续需要长期保留的 ADR 决策候选索引。

本步只做追溯映射、漏项检查、架构决定停审和 ADR 候选索引,不新增架构结论,不创建正式 ADR 文件,不补写 API / RPC / SDK / DTO / event / outbox / retry / worker、对象 schema、状态机、数据库、对象存储、OTel、secrets、后端产品、安全 profile、配置 key、测试用例、SLO 数字或 implementation boundary,也不把 Step 14 已挂起的待确认事项润色成已闭合事实。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供仓定位、核心能力、功能、规则、数据归属、依赖、NFR、验收和一票否决。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 提供需求层 C-SBX、US-SBX、FR-SBX、BR-SBX、数据归属、AC / VF 的追溯关系。 |
| `01_arch_step_01_requirement_baseline.md` | 已完成并经用户确认 | 提供架构需求基线、旧材料污染、硬约束和验收否决输入。 |
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 提供 execution isolation truth、架构目标、不可变约束、当前取舍和非目标。 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 提供做 / 不做、易混淆职责和边界红线。 |
| `01_arch_step_04_system_context.md` | 已完成并经用户确认 | 提供系统上下文、输入面、输出面和依赖失效口径。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成并经用户确认 | 提供受控执行隔离核心、边界承载、材料交接、失败收束和派生读取上下文边界。 |
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 提供同步入口、异步消费、后台维护、隔离承载和运行单元关系。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 提供 `L0-core` 唯一编译期依赖、运行期协作和禁止依赖口径。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 提供 execution isolation truth、snapshot / ref / derived / forbidden body 和一致性策略。 |
| `01_arch_step_09_interactions_communication.md` | 已完成并经用户确认 | 提供同步 / 异步 / 后台边界、handoff、cleanup guard、redline 和失败降级语义。 |
| `01_arch_step_10_technology_choices.md` | 已完成并经用户确认 | 提供机制级技术选型和产品 / 协议 / profile / 指标后置口径。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成并经用户确认 | 提供当前主线方案、替代路径、不采用方案和路径级取舍。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成并经用户确认 | 提供安全、审计、观测、韧性、性能和配置横切约束。 |
| `01_arch_step_13_evolution_path.md` | 已完成并经用户确认 | 提供当前成立边界、可接受债务、不可接受债务和演进触发条件。 |
| `01_arch_step_14_risks_open_questions.md` | 已完成并经用户确认 | 提供正式风险、待确认事项、处理口径和阻塞判断。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 15 | 已读取 | 控制 ADR / 追溯问题、停审和跨审计要求。 |
| `standards/document/架构设计书写规范.md` §4.16 / §4.17 | 已读取 | 控制需求追溯矩阵、漏项检查表、ADR 索引表和边界说明写法。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 14、SOP Step 15 和书写规范 §4.16 / §4.17 | done | 本文件 §1、§3 |
| 读取正式 00 的核心能力、功能、规则、数据、依赖、NFR、验收和一票否决 | done | 本文件 §5、§9.1 |
| 回看 Step 1~14 已收稳的架构决定、约束、取舍和风险 | done | 本文件 §5、§9.3、§9.4 |
| 输出需求追溯矩阵、漏项检查、ADR 候选索引、架构决定停审和跨审计表 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿并更新 flow / 项目台账 | done | 本文件 §10;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 哪些架构决定需要沉淀为 ADR?

应进入 ADR 索引的是会长期影响受控执行隔离事实、仓际边界、数据归属、一致性、依赖裁剪、policy 执行边界、材料交接、失败收束、清理安全和演进方式的架构决定。当前建议沉淀的 ADR 候选包括:

1. 以独立 execution isolation truth 作为 `L4-sandbox` 架构核心。
2. 通过正式受控执行入口建立 execution environment identity 与责任链。
3. 以 resource / filesystem / network / process coherent boundary 作为隔离边界成立条件,并通过抽象 isolation backend contract 承载。
4. 只在给定 launch / isolation policy 内执行,policy 缺失、冲突、不支持、不可解析或越权时 fail-closed。
5. capture fact、candidate material、observability material 和 downstream handoff truth 分层。
6. failure classification、control fact、lease / orphan、cleanup guard、reaper 和 redline containment 作为一等架构事实。
7. 同步核心判断、异步已成立事实传播、后台 execution lifecycle / capture / cleanup / reaper / 派生材料维护三类路径分离。
8. inspect、preview、replay、operator control、backend comparison 和 trend 等 read surface 只读派生,不得反写核心 truth。
9. `L0-core` 作为唯一编译期依赖,非 core sibling 仓通过运行期接缝、事件、refs、snapshot、safe summary 或 handoff 协作。
10. 配置不得改变 truth owner、边界、policy、handoff、cleanup、redline、fallback、retention 或依赖裁剪。
11. Docker / gVisor / Firecracker / k8s、DB、object store、OTel、secrets、GRC、seccomp / AppArmor / cap-drop 和旧性能数字暂不作为当前架构硬选型。

### 5.2 每个关键架构决定对应哪些需求、约束或风险来源?

完整映射见 §9.1 需求追溯矩阵和 §9.3 ADR 决策候选索引。当前关键架构决定均可追溯到新版 `00-需求文档.md` 的仓定位、C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、数据归属、接口依赖边界、NFR、AC-SBX-001~041、VF-SBX-001~010,以及 Step 1~14 已收稳的架构目标、职责边界、系统上下文、限界上下文、依赖方向、数据所有权、通信方式、技术机制、方案取舍、横切约束、演进债务和风险红线。

### 5.3 是否存在没有需求来源的架构设计?

当前结论为否。进入正式架构主线的判断都能追溯到需求基线、需求层追溯矩阵、数据归属、接口依赖边界、非功能约束、验收否决项、风险挂起口径或 Step 1~14 的已确认取舍。

旧 README / 旧 `01-架构设计.md` 中的 Docker + gVisor 硬选型、Firecracker 展望、SandboxService、RPC / SDK、allowlist lookup、audit event、local_process、backend fallback、seccomp / AppArmor / cap drop 配置、旧 P95 / SLA 和旧阶段路线,没有被作为新版架构来源直接继承。

### 5.4 是否存在没有架构承接的核心需求或关键约束?

当前结论为否。C-SBX-1~5 和 FR-SBX-001~018 已分别被正式受理与身份、隔离边界、policy fail-closed、capture / handoff、failure / cleanup / redline 主线承接;BR-SBX-001~033 已被职责边界、数据所有权、一致性策略、依赖裁剪、横切约束和风险章节承接;VF-SBX-001~010 已转译为架构红线和阻塞风险。

FR-SBX-E01~E06 外围增强不是未承接需求,而是已按只读派生、后续演进、待确认事项和不改核心 truth 的验收口径处理,不作为当前核心闭环成立前置。

### 5.5 哪些取舍和红线必须长期可追溯?

必须长期可追溯的红线包括:

- 宿主直跑、旁路执行、匿名执行或调用方本地执行不得被宣称为正式 sandbox 受控执行。
- resource / filesystem / network / process 任一必需边界不得 silent degrade、部分忽略或未验证即继续执行。
- policy 缺失、冲突、不支持、不可解析或未授权高风险动作不得继续执行。
- sandbox 不得保存或拥有 identity / work / tool semantic / runtime recover / formal artifact / observability store / policy DSL / operator UI 等外部正文或外部 truth。
- 输出、候选材料或 observability material 不得静默提升为 formal artifact truth、baseline truth、evidence truth 或 observability store truth。
- cleanup / reaper 不得在审计、回放、调查或安全交接所需材料安全交接前先删除 capture / audit / investigation material。
- 租约到期、孤儿环境或 redline 事件不得在托管恢复路径之外继续运行或脱离受控收束。
- 同一正式执行、同一 policy 语境或同一 control 信号不得在不同调用方、承载或下游处出现第二套正式语义。
- 除 `L0-core` 外,非 core sibling repo 不得成为编译期业务依赖。
- 配置不得暗改 truth、边界、policy、handoff、cleanup、redline、fallback、retention 或依赖裁剪。

### 5.6 每个关键架构决定是否通过停审?

当前进入 ADR 候选索引的决策均满足三项停审条件:属于架构层决策,具备长期影响,可回指需求 / 约束 / 风险 / 取舍来源。没有把 API 字段、RPC / SDK 形态、DTO schema、事件 payload、状态机、数据库、对象存储、OTel、secrets、后端产品、seccomp / AppArmor profile、SLO 数字、测试用例或实施动作塞入 ADR。

---

## 6. 当前文档问题诊断

| 位置 / 来源 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 README / 旧 `01-架构设计.md` | 包含 Docker/gVisor、SandboxService、RPC、audit event、allowlist、local_process、fallback、旧指标和旧路线图 | 容易作为隐性架构来源回流 | 不作为新版追溯主线,只作为 historical material / 风险来源。 |
| 正式 `00-需求文档.md` | 已建立 C-SBX、FR-SBX、BR-SBX、数据、依赖、NFR、AC / VF 追溯关系 | 还需要架构层承接位置和成立理由 | 转成 §9.1 架构追溯矩阵。 |
| 架构 Step 1~14 | 每步已有局部结论和回填草稿 | 关键决策尚未统一连接到需求、约束、风险和取舍来源 | 汇总为需求追溯、漏项检查、停审和 ADR 候选索引。 |
| Step 10 / Step 11 / Step 13 | 已有机制选型、备选方案和演进债务 | 需要判断哪些长期取舍值得进入 ADR 索引 | 只保留改变主线结构的决策。 |
| Step 14 | 有后端、policy、handoff、material、failure、read surface、协议、存储、配置、profile 和 SLO 待确认事项 | 容易在追溯阶段被误写成已定 ADR | 保留为漏项检查 / 待确认,不升格为已收敛结论。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 追溯来源 | 需求矩阵、架构步骤、风险和旧材料线索分散 | 统一以新版需求基线和 Step 1~14 已确认结论为来源 | 防止旧口径和孤儿结论混入。 |
| 追溯方式 | 容易写成章节目录对照 | 写成需求 / 约束 -> 架构承接结果 -> 承接位置 -> 成立理由 | 对齐书写规范 §4.16。 |
| ADR 粒度 | 可能把产品、接口、字段或局部机制都写成 ADR | 只列长期影响 sandbox 主线的架构决策候选 | 对齐书写规范 §4.17。 |
| 待确认处理 | API、状态、schema、产品、profile、容量可能被追溯阶段脑补 | 保留为漏项检查和后续文档挂起口径 | 防止伪确定性。 |
| 风险承接 | 风险分散在 Step 14 和各章节 | 纳入追溯矩阵和 ADR 候选说明 | 保证边界红线长期可追溯。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只列需求章节到架构章节的目录映射 | 短,容易写 | 不能证明具体承接关系,也无法发现孤儿结论 | 不采用。 |
| 方案 B: 建立需求追溯矩阵、漏项检查表、ADR 候选索引、架构决定停审和跨审计 | 可审查,能说明来源、承接、缺口和长期决策 | 文档较长,需要严格避免新增结论 | 采用。 |
| 方案 C: 本步直接创建正式 ADR 文件 | ADR 体系看起来完整 | 超出当前 SOP Step,且会绕过 ADR 评审流程 | 不采用。 |
| 方案 D: 把所有 Step 10 技术机制和产品候选都写成 ADR | 表面完整 | 会把局部机制、产品候选和实现偏好噪音化 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| API / RPC / SDK / DTO / event / 状态机未闭合是否进入 ADR | A. 建 ADR 占位;B. 留在 Step 14 风险和待确认事项 | B | 未闭合详细项不是已收稳架构决定。 |
| 后端产品、profile 和 SLO 是否进入 ADR | A. 现在定论;B. 只保留“不由产品反写主线”的长期决策 | B | 当前架构固定边界和机制口径,不由产品设施定义 truth。 |
| 外围增强是否进入需求追溯矩阵 | A. 不进入;B. 进入漏项 / 范围说明并按演进和待确认处理 | B | 避免被误判为未承接,但不升级为当前核心前置。 |
| 旧架构文档中的方案是否直接继承 | A. 继承旧方案;B. 重新建立新版追溯和 ADR 候选索引 | B | 防止旧技术栈、旧指标和旧路线污染新版架构。 |

---

## 9. 结构化中间产物

### 9.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` §2 / §7 C-SBX-1~5 | `L4-sandbox` 是受控执行隔离基础,必须形成从执行语境、隔离边界、policy、capture 到 failure / cleanup / redline 的闭环 | 以独立 execution isolation truth 为架构核心,围绕正式受理、边界建立、policy 裁定、capture / handoff、failure / cleanup / redline 组织边界 | §2 业务背景与驱动力;§3 架构目标与约束;§4 职责边界;§6 限界上下文;§9 数据所有权 | 架构把仓定位转译为独立 truth center,防止退化为普通命令执行器、后端适配器、工具执行语义或 runtime agent loop。 |
| C-SBX-1 / FR-SBX-001~003 / BR-SBX-001~005 | 真实执行开始前必须有正式受理语境、execution environment identity、责任链和跨调用方统一入口 | 正式受控执行入口与执行环境身份承接 actor / member / work / runner refs、trace / responsibility 语境和最低拒绝条件 | §4 职责边界;§5 系统边界与上下文;§6 限界上下文;§10 关键交互 | 需求侧的归责和统一入口要求,在架构侧被转译为同步受理 / 拒绝边界和统一 sandbox 语义。 |
| C-SBX-2 / FR-SBX-004~006 / BR-SBX-006~010 | 真实执行只能发生在正式隔离环境内,resource / filesystem / network / process 边界必须一致落实,不可 silent degrade | coherent boundary 与抽象 isolation backend contract 承接正式环境建立、限制施加、能力校验和保守拒绝 | §6 限界上下文;§7 容器 / 部署架构;§9 数据所有权;§11 关键技术选型;§13 横切关注点 | 架构不锁定 Docker / gVisor / Firecracker / k8s,但固定后端不能反向削弱边界。 |
| C-SBX-3 / FR-SBX-007~010 / BR-SBX-011~017 | 执行动作只能在给定 launch / isolation policy 内继续,策略缺失、冲突、不支持或越权必须 fail-closed | policy execution decision fact 承接给定 policy / authorization,policy definition、approval、allowlist 和 capability truth 保持外部拥有 | §4 职责边界;§8 依赖方向;§9 数据所有权;§10 关键交互;§13 横切关注点 | 需求侧的策略执行要求在架构侧被转译为“消费给定策略并裁定执行”,而不是 sandbox 自行拥有 policy truth。 |
| C-SBX-4 / FR-SBX-011~014 / BR-SBX-018~024 | stdout / stderr、输出文件、候选材料、usage / audit / observability material 必须安全捕获并分层交接 | capture fact、candidate material、observability material、handoff fact 和下游 refs 分层承接,下游 formal truth 由下游确认 | §5 系统边界与上下文;§6 限界上下文;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构允许材料交接和观测消费,但防止 candidate material 静默升级为 Artifact / evidence / observability store truth。 |
| C-SBX-5 / FR-SBX-015~018 / BR-SBX-025~033 | timeout、deny、kill、capture failure、orphan、lease expiry、cleanup、reaper 和 redline 必须稳定分类、留痕和保守收束 | failure classification、control fact、cleanup guard、lease / orphan recovery、reaper 和 redline containment 作为一等架构事实承接 | §4 职责边界;§6 限界上下文;§10 关键交互;§13 横切关注点;§15 风险与待确认事项 | 非 happy path 不是外围补丁,而是受控执行隔离闭环的一部分,否则证据和安全收束会断裂。 |
| FR-SBX-E01~E06 / AC-SBX-024~025 | 风险分层承载、inspect / replay、输出预览、多宿主调度、后端比较、趋势分析可作为外围增强,但不得改核心语义 | 外围增强按只读派生、后续演进和待确认事项承接,不得成为核心通过前提或核心 truth 写源 | §12 备选方案与取舍;§14 演进路线;§15 风险与待确认事项 | 外围增强已被架构承接,但被明确限制在核心闭环之后,防止 read surface 或产品能力反写 execution isolation truth。 |
| `00-需求文档.md` §11 数据归属 | sandbox 只拥有 execution isolation truth;外部正文只能作为 refs、snapshot、safe summary 或 handoff material 进入 | truth / snapshot / ref / derived / forbidden body separation 承接正式受理、边界、policy、capture、handoff、failure、cleanup 和 redline 数据边界 | §9 数据所有权与一致性策略;§11 关键技术选型;§13 横切关注点 | 这是后续对象、协议、持久化和测试都必须继承的核心数据边界。 |
| `00-需求文档.md` §12 / 全局依赖裁剪规则 | `L0-core` 是唯一编译期依赖;L2 / L1 / L4 / L5 sibling 和后端产品只能运行期、事件、ref、snapshot、safe summary 或 handoff 协作 | 依赖方向图、依赖倒置表、禁止依赖表和跨仓协作口径承接 | §5 系统边界与上下文;§8 依赖方向与层间约束;§11 关键技术选型;§15 风险与待确认事项 | 架构明确非 core sibling 不进入编译期依赖,保护 L4 基础设施仓边界。 |
| `00-需求文档.md` §13 NFR / AC-SBX-036~041 | 安全、可追溯、幂等、一致性、可观测、性能预算和配置治理必须有结构性口径 | 横切关注点和机制级技术选型承接零容忍安全、回链追溯、统一执行语义、关键状态观察和配置不可越界 | §11 关键技术选型;§13 横切关注点;§14 演进路线;§15 风险与待确认事项 | 架构保留质量底线,但不预支监控字段、配置 key、压测脚本或旧性能数字。 |
| AC-SBX-001~041 / VF-SBX-001~010 | 核心闭环断裂、宿主直跑、边界 silent degrade、policy continue、外部正文入仓、material 升格、cleanup 先删证据、orphan / redline 脱管、第二套语义和追溯缺口均不能通过 | 风险表、漏项检查、ADR 候选索引和 Step 16 装配门禁长期保留这些红线 | §15 风险与待确认事项;§16 需求追溯矩阵;§17 ADR 索引 | 架构把验收否决项转译为长期可追溯的决策和阻塞风险。 |
| Step 14 风险与待确认事项 | 后端组合、policy 来源矩阵、handoff ack、大材料治理、failure taxonomy、read surface、协议 / 存储 / 配置 / profile / SLO 仍未闭合 | 作为后续概要 / 详细 / 配置 / 测试 / 验收 / 实施阶段必须闭合的挂起项 | §15 风险与待确认事项;§16 需求追溯矩阵 | 架构层不补字段、不选产品、不造状态,但明确实现阶段不得自行补真相源。 |

### 9.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | C-SBX-1~5 | 架构主线、职责边界、数据归属、关键交互、横切关注点 | 无缺口 | 核心闭环均已映射到正式受理、边界建立、policy、capture / handoff 和 failure / cleanup / redline 主线。 |
| 需求未被承接 | FR-SBX-001~018 | 核心功能、数据归属、交互、风险和验收 | 无缺口 | 核心功能均已由核心子域、支撑上下文、正式承接边界和一致性策略承接。 |
| 需求未被承接 | BR-SBX-001~033 | 入口、隔离、policy、capture / handoff、failure / cleanup / redline、依赖和外部正文边界 | 无缺口 | 业务规则已被职责红线、数据所有权、一致性策略、依赖裁剪、横切约束和风险表承接。 |
| 需求未被承接 | FR-SBX-E01~E06 外围增强 | 演进路线、派生消费、operator / inspect / trend / backend comparison 候选 | 已挂起,非缺口 | 外围增强已按演进和待确认事项承接,不作为当前核心闭环前置。 |
| 架构判断缺来源 | execution isolation truth、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment、依赖裁剪、配置不可越界 | 架构主线 | 无缺口 | 均可追溯到需求定位、数据归属、接口依赖、NFR、验收和风险章节。 |
| 承接关系未闭合 | API / RPC / SDK / port / DTO / event / outbox / retry / worker 形态 | 概要设计、详细设计、测试方案、实现 boundary | 保留为待确认 | 架构只承接能力类别和交互方式,不能在 Step 15 补协议 schema。 |
| 承接关系未闭合 | sandbox 对象 schema、状态集、transition、持久化和 repository 契约 | 详细设计、状态矩阵、持久化、测试方案 | 保留为待确认 | 后续设计必须闭合后才可实现,不能由实现侧补真相源。 |
| 承接关系未闭合 | isolation backend 组合、capability matrix、seccomp / AppArmor / cap-drop / mount / network profile、正式 / 测试承载边界 | 技术选型、配置设计、测试方案、实施计划 | 保留为待确认 | 当前只固定 backend 不得反向削弱 coherent boundary,不锁产品和 profile。 |
| 承接关系未闭合 | artifact / observability / runtime / runner / investigation handoff ack、failed、retryable、回链验证和 cleanup guard 细节 | capture / handoff、cleanup、测试验收 | 保留为待确认 | 当前只固定 handoff fact、pending / failed / retryable 和 cleanup guard 不破坏材料。 |
| 承接关系未闭合 | captured output、candidate material、observability material 的大小、保留、存储、摘要、partial capture 和删除放行口径 | 数据所有权、材料治理、配置设计、容量、cleanup | 保留为待确认 | 当前只固定材料分层和外部正文禁止入仓,不补存储产品或 retention 数字。 |
| 承接关系未闭合 | SLO、容量、启动时延、policy 判断开销、capture / cleanup / reaper 阈值 | 测试方案、验收标准、容量评估、实施计划 | 保留为待确认 | 当前保留结构性性能预算,旧数字不作为硬指标。 |
| 文档链缺口 | 正式 `04-配置设计.md` 和 `07-实施计划.md` | 配置设计、实施计划、implementation ledger、planned boundary skeleton | open_downstream | 不阻塞当前架构 Step 15 / Step 16,但进入对应阶段前必须按 SOP 补齐。 |
| ADR 缺口 | `L4-sandbox` 专项正式 ADR 文件 | 长期架构决策评审 | 正式 ADR 尚未建立 | 本步只形成决策候选索引,不伪装成已评审 ADR。 |

### 9.3 ADR 决策候选索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立 execution isolation truth 作为 `L4-sandbox` 架构核心 | 防止受控执行事实散落到 tools、runtime、member-service、runner、artifact、observability、governance / capability 或后端产品中形成多真相 | 职责边界 / 数据所有权 / 备选方案 / 风险 | 这是本仓存在和后续设计的根决策,值得单独建立正式 ADR。 |
| 未建立 | 通过正式受控执行入口建立 execution environment identity 与责任链 | 防止宿主直跑、旁路执行、匿名执行或调用方本地执行被补记为正式 sandbox | 职责边界 / 系统上下文 / 关键交互 / 验收否决 | 该决策长期保护一次执行的归责、追溯和跨调用方统一入口。 |
| 未建立 | 以 resource / filesystem / network / process coherent boundary 作为隔离成立条件,并由抽象 isolation backend contract 承载 | 防止某个后端、弱测试路径、fallback 或产品能力反向定义正式隔离边界 | 容器部署 / 技术机制 / 横切安全 / 风险 | 该决策长期影响后端适配、配置、测试和安全验证。 |
| 未建立 | 只在给定 launch / isolation policy 内执行并 fail-closed | 防止 sandbox 反向拥有 policy definition、approval、allowlist 或 capability truth,也防止策略不完备时继续执行 | 依赖方向 / 数据归属 / 关键交互 / 安全横切 | 该决策长期保护 policy 来源边界和高风险动作阻断口径。 |
| 未建立 | capture fact、candidate material、observability material 和 downstream handoff truth 分层 | 防止输出、候选材料或观测材料静默升级为 Artifact / evidence / observability store truth | 数据所有权 / 关键交互 / 下游协作 / 验收否决 | 该决策长期影响材料治理、下游交接、cleanup guard 和测试验收。 |
| 未建立 | failure classification、control fact、lease / orphan、cleanup guard、reaper 和 redline containment 作为一等架构事实 | 防止非 happy path 由调用方兜底、证据被提前删除、孤儿环境托管外运行或 redline 退化为提示 | 关键交互 / 横切安全 / 韧性 / 风险 | 该决策长期保护失败解释、安全收束和审计链。 |
| 未建立 | 同步核心判断、异步已成立事实传播、后台生命周期 / capture / cleanup / reaper / 派生材料维护三类路径分离 | 防止全同步拖重主链或同步成功伪装长时执行、handoff、cleanup、观测消费全部完成 | 容器部署 / 关键交互 / 一致性策略 / 技术机制 | 该决策长期影响 API、event、worker、retry、状态和恢复设计。 |
| 未建立 | inspect、preview、replay、operator control、backend comparison 和 trend 等 read surface 只读派生,不得反写核心 truth | 防止排障、预览、观测或运维增强成为第二写源或核心通过前提 | 数据所有权 / 横切关注点 / 演进路线 / 风险 | 该决策长期保护 read model / write model / maintenance model 边界。 |
| 未建立 | `L0-core` 作为唯一编译期依赖,非 core sibling 仓通过运行期接缝、事件、refs、snapshot、safe summary 或 handoff 协作 | 防止 L1 / L2 / L4 / L5 sibling 或后端产品通过源码依赖形成隐式上下级和循环依赖 | 依赖方向 / 技术机制 / 实施约束 | 该决策长期保护全局依赖裁剪和 L4 基础设施仓可独立落码性。 |
| 未建立 | 配置不得改变 truth owner、边界、policy、handoff、cleanup、redline、fallback、retention 或依赖裁剪 | 防止配置层暗改架构主线、扩大权限、放宽边界或绕过正式交接 | 横切配置 / 配置设计 / 实施约束 / 风险 | 该决策长期保护配置设计不成为 hidden architecture。 |
| 未建立 | 产品级 Docker / gVisor / Firecracker / k8s、DB、object store、OTel、secrets、GRC、seccomp / AppArmor / cap-drop 和旧性能数字暂不作为当前架构硬选型 | 防止旧 Draft 技术、产品设施或伪量化指标反向决定架构边界 | 技术选型 / 备选方案 / 演进路线 / 风险 | 该决策保留后续实施空间,但要求产品选择不得推翻已收稳边界。 |

### 9.4 架构决定停审记录

| 架构决定 | 是否值得长期保留 | 来源是否明确 | 是否新增未确认结论 | 停审结论 |
|---|---|---|---|---|
| 独立 execution isolation truth | 是 | 仓定位、C-SBX-1~5、数据归属、AC / VF | 否 | pass |
| 正式受控执行入口与 execution environment identity | 是 | FR-SBX-001~003、BR-SBX-001~005、AC-SBX-001 / 006~008、VF-SBX-002 / 010 | 否 | pass |
| resource / filesystem / network / process coherent boundary | 是 | FR-SBX-004~006、BR-SBX-006~010、AC-SBX-002 / 009~011、VF-SBX-003 | 否 | pass |
| 给定 policy 内执行与 fail-closed | 是 | FR-SBX-007~010、BR-SBX-011~017、AC-SBX-003 / 012~015、VF-SBX-004 | 否 | pass |
| capture / candidate / observability / handoff 分层 | 是 | FR-SBX-011~014、BR-SBX-018~024、AC-SBX-004 / 016~019、VF-SBX-006 | 否 | pass |
| failure / control / lease / cleanup / reaper / redline 一等事实 | 是 | FR-SBX-015~018、BR-SBX-025~033、AC-SBX-005 / 020~023、VF-SBX-007 / 008 / 010 | 否 | pass |
| 同步 / 异步 / 后台路径分离 | 是 | Step 6、Step 9、NFR 一致性 / 可用性、Step 11 取舍 | 否 | pass |
| read surface 只读派生 | 是 | FR-SBX-E02 / E03 / E05 / E06、数据归属、风险表、AC-SBX-025 | 否 | pass |
| 非 core sibling 运行期协作 | 是 | 全局依赖裁剪、`00` §12、Step 7、AC-SBX-031 | 否 | pass |
| 配置不可越界 | 是 | Step 12 横切配置、Step 14 风险、后续 `04` 约束 | 否 | pass |
| 产品和旧指标不作为硬选型 | 是 | Step 10 技术机制、Step 11 备选方案、Step 13 演进、旧材料诊断 | 否 | pass |

### 9.5 跨 ADR / 需求追溯审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿架构决定 | 否 | ADR 候选均可回指需求、约束、风险或取舍来源。 |
| 是否存在孤儿核心需求 | 否 | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、数据归属、NFR 和 VF 均已找到架构承接。 |
| 是否存在普通实现选择误入 ADR | 否 | API、RPC、SDK、DTO、event payload、状态机、DB、object store、OTel、secrets、后端产品、profile、SLO、测试用例和实施动作未进入 ADR 候选。 |
| 是否存在旧材料污染 | 否 | 旧 Docker/gVisor/Firecracker、SandboxService、allowlist、audit event、fallback、profile 和旧指标只作为历史风险,未成为追溯来源。 |
| 是否存在新增未确认结论 | 否 | 本步只整理 Step 1~14 已收稳结论和正式 00 的追溯结果。 |
| 是否存在待确认事项被伪装为已闭合 | 否 | 后端组合、policy 来源矩阵、handoff ack、failure taxonomy、read surface、协议、存储、配置、profile 和 SLO 仍保留为待确认。 |
| 是否存在 ADR 与追溯职责混写 | 否 | §9.1 写来源到承接关系,§9.3 写长期决策索引,两者职责分离。 |

### 9.6 追溯范围说明

本章采用关键需求结论和关键架构约束为追溯粒度,不把 Step 1~14 的每一行表格机械展开为目录对照。主矩阵只记录已经成立的来源到承接关系,漏项检查表只记录当前是否仍有追溯缺口或后续详细设计 / 配置 / 测试 / 实施挂起项。当前没有已评审通过的 `L4-sandbox` 专项 ADR 文件,因此 ADR 表采用“决策候选索引”口径,不替代正式 ADR 文件。API、状态机、schema、存储、产品级技术选择、容量数字和交接协议已经在 Step 14 风险与待确认事项中挂起,当前不补写为确定架构结论。

---

## 10. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §16 “需求追溯矩阵”直接摘录并整理本文件 §9.1、§9.2、§9.5 和 §9.6。
- §17 “ADR 索引”直接摘录并整理本文件 §9.3、§9.4、§9.5 和 §9.6。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项处理建议

### 11.1 本 Step 未确认事项

本步不新增阻塞 Step 16 的待确认事项。§9.2 所列未闭合项均继承 Step 14 挂起口径,作为后续概要设计、详细设计、配置设计、测试方案、验收标准和实施计划需要继续确认的架构输入。

### 11.2 后续阻塞转换规则

| 事项 | 当前状态 | 转为阻塞的条件 |
|---|---|---|
| 正式 ADR 文件未建立 | 不阻塞 Step 16 | 若后续声称已有 ADR 编号、ADR 文件或评审状态但没有真实文件和评审记录,转为阻塞。 |
| API / state / schema / event / storage 未定 | 不阻塞 Step 16 | 若进入实现前 `02/03` 未闭口且实现私补,转为阻塞。 |
| 后端组合 / profile / SLO 未定 | 不阻塞 Step 16 | 若后续实现绕过 `04/05/06/07` 直接落产品、profile 或指标,转为阻塞。 |
| handoff ack / cleanup guard 细节未定 | 不阻塞 Step 16 | 若后续允许 cleanup 先删证据或 material 升格为下游 truth,转为阻塞。 |
| `04` / `07` 正式文档缺失 | 不阻塞当前架构 Step 15 / Step 16 | 进入对应文档阶段前必须创建;完成 `07` 时必须同步 ledger 和 planned boundary skeleton。 |

---

## 12. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 已明确哪些架构决定需要 ADR | pass。见 §5.1 和 §9.3。 |
| 已建立关键需求、约束和风险与架构承接结果之间的追溯关系 | pass。见 §9.1。 |
| 已显式暴露尚未闭合的追溯缺口或后续挂起项 | pass。见 §9.2。 |
| 每个关键架构决定已停审 | pass。见 §9.4。 |
| 跨 ADR / 需求追溯审计没有 unresolved 冲突 | pass。见 §9.5。 |
| 是否新增前文未确认的架构结论 | pass。未新增。 |
| 是否创建正式 ADR 文件或伪造 ADR 编号 | pass。未创建;ADR 编号均为 `未建立`。 |
| 是否把普通实现选择误入 ADR | pass。API、schema、状态机、数据库、产品、profile、SLO、测试和实施动作均未进入 ADR 候选。 |
| 是否修改正式 `01-架构设计.md` | pass。正式 `01` 未修改。 |

结论: Step 15 `ADR 与需求追溯` 已完成,等待用户审查。用户确认后,才允许进入 Step 16 `整理正式文档`;Step 16 需读取本文件、Step 1~14、架构 SOP Step 16 和书写规范正式装配章节,并在 Step 16 中间产物完成后重建正式 `01-架构设计.md`。
