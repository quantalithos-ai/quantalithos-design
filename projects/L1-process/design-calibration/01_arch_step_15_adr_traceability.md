# Step 15. ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 回填章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 生成日期: 2026-06-05

---

## 1. 本步目标

把 Step 1~Step 14 已经收稳的关键架构决定与需求来源、约束来源和风险来源显式连接起来,并沉淀需要长期保留的 ADR 索引。本步只做追溯映射和决策索引,不新增架构结论,不补写详细设计,不把仍未闭合的 API、状态机、schema、存储或产品级技术选择提前升格为 ADR。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_16_traceability_matrix.md` | 需求追溯已完成 | 作为需求来源、核心闭环、功能、规则、数据和验收的主输入 |
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接架构需求基线、硬约束和未关闭需求风险 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接架构目标、不可变约束、取舍和非目标 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接职责边界、做 / 不做清单和边界红线 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 4 已完成 | 承接系统上下文和上下游输入 / 输出面 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | Step 5 已完成 | 承接限界上下文、子域、本地索引 / 投影 / 引用边界和统一语言 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 6 已完成 | 承接运行承载角色和部署边界 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | Step 7 已完成 | 承接依赖方向、依赖倒置和跨仓依赖裁剪 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | Step 8 已完成 | 承接数据归属、一致性策略、外部正文禁止和派生边界 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | Step 9 已完成 | 承接同步 / 异步 / 后台交互分工 |
| `design-calibration/01_arch_step_10_technology_choices.md` | Step 10 已完成 | 承接架构层技术机制和延后产品技术选择口径 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | Step 11 已完成 | 承接当前主线方案与不采用方案 |
| `design-calibration/01_arch_step_12_cross_cutting_concerns.md` | Step 12 已完成 | 承接安全、审计、可观测、恢复、性能和配置等横切约束 |
| `design-calibration/01_arch_step_13_evolution_path.md` | Step 13 已完成 | 承接演进阶段、可接受债务和触发条件 |
| `design-calibration/01_arch_step_14_risks_open_questions.md` | Step 14 已完成 | 承接正式风险、待确认事项和阻塞口径 |

---

## 3. SOP 问题回答

### 3.1 哪些架构决定需要沉淀为 ADR?

应进入 ADR 索引的不是文件清单或局部实现选择,而是会长期影响 Process truth、边界协作、依赖方向、数据归属、一致性、恢复和演进方式的架构决定。当前需要沉淀的 ADR 包括:

1. 独立 Process truth 作为架构核心。
2. Runtime process shape 消费 method-library 定义,但不拥有定义正文。
3. 仅允许 `L0-core` 编译期依赖,非 core sibling 通过运行期边界协作。
4. 用正式输入承接边界隔离外部输入与核心语义。
5. 同步真相决策、异步结果 / 事实传播、后台维护三类路径分离。
6. 区分本仓真相、外部快照、外部引用和禁止正文。
7. read model / projection 只读消费,不得反写真相。
8. checkpoint / recovery 维护同一 Process truth 连续性,不得形成第二份真相。
9. 显式表达 stale / unresolved / waiting / invalid / failed / retryable 等外部和派生状态 marker。
10. 产品级语言、存储、消息、对象存储和完整 BPMN 等硬选择延后,不得反向推翻已收稳架构边界。

### 3.2 每个关键架构决定对应哪些需求、约束或风险来源?

完整答案见 §7.1 需求追溯矩阵和 §7.3 ADR 索引表。当前关键架构决定均能追溯到需求 Step 16 的核心闭环、功能需求、业务规则、数据归属、验收标准,或架构 Step 1~Step 14 已明确的约束、取舍和风险。

### 3.3 是否存在没有需求来源的架构设计?

当前结论为否。Step 1~Step 14 中进入正式架构主线的结论,均能追溯到 `00-需求文档.md` 的需求基线、需求追溯矩阵、数据归属、一票否决项、非功能约束或风险挂起口径。旧 `01-架构设计.md` 中的 Python、PostgreSQL、旧 BPMN 假设和旧性能数字没有被作为新版架构来源直接继承。

### 3.4 是否存在没有架构承接的核心需求或关键约束?

当前结论为否。C-1~C-5 核心闭环、FR-PROC-001~FR-PROC-008、BR-PROC-001~BR-PROC-032、Process 数据归属和 AC / VF 验收约束,已经分别被职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、关键交互、技术机制、横切关注点和风险章节承接。外围增强 FR-PROC-E01~E05 不是未承接需求,而是已按演进路线和风险挂起口径处理。

### 3.5 哪些取舍和红线必须长期可追溯?

必须长期可追溯的红线包括:Process 不拥有 method-library definition 正文、Work truth、Governance decision truth、Artifact body、Runtime execution body、Conversation truth、Workspace dashboard truth、Observability / Archive body;非 `L0-core` sibling 不得成为编译期依赖;派生消费面不得反写真相;recovery 不得创建第二份 Process truth;详细设计和实现不得在真相源未闭合时自行补 schema 或选边。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | 有旧技术栈、旧日期、旧 ADR 状态和旧边界口径 | 不能作为新版 ADR 或追溯真相源直接继承 | 只保留为历史风险来源,不进入 ADR 索引 |
| 前序架构 Step | 每步已有局部回填草稿和结论表 | 需要统一说明需求如何承接到架构结果 | 汇总为 §7.1 主追溯矩阵 |
| Step 11 | 已有方案取舍 | 需要区分哪些取舍值得长期保留为 ADR | 只把长期影响主线的取舍纳入 §7.3 |
| Step 14 | 已有风险和待确认事项 | 容易把未闭合问题误写成 ADR | 未闭合详细项只进入漏项检查或风险说明,不进入 ADR |
| 需求 Step 16 | 已有需求层追溯矩阵 | 需要架构层承接位置而不是重复需求矩阵 | 以架构章节位置和承接理由重写映射 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 需求追溯 | 分散在需求追溯、架构 Step 回填草稿和风险表中 | 汇总为架构层需求追溯矩阵 | 对齐规范 4.16 |
| 漏项检查 | 分散在待确认事项和风险判断中 | 明确区分无缺口、挂起项和不进入 ADR 的未定项 | 防止用“已覆盖”掩盖后续详细设计风险 |
| ADR 索引 | 旧文档中存在历史 ADR 口径 | 重建为新版关键架构决定索引 | 防止旧技术和旧边界残留 |
| 决策粒度 | 可能把技术机制或文件名当 ADR | 只保留长期影响 Process 主线的架构决定 | 对齐规范 4.17 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把 Step 1~Step 14 每个结论逐条纳入主矩阵 | 覆盖极细 | 表会变成章节摘要,不利于识别主线追溯 | 不采用 |
| 方案 B: 以关键需求结论 / 约束为主轴,映射到架构承接结果 | 粒度稳定,能发现缺口 | 需要合并同类项 | 采用 |
| 方案 C: 把所有 Step 11 取舍都写成 ADR | ADR 完整性看似更强 | 会把普通取舍和长期决策混淆 | 不采用 |
| 方案 D: 只保留独立 Process truth 一个 ADR | 极简 | 无法长期解释依赖、数据、交互、恢复和延后技术选择等红线 | 不采用 |

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
| 方案 A | 直接继承旧 ADR 编号和状态 | 会把旧技术栈和旧边界带入新架构 |
| 方案 B | 重新建立新版 ADR 索引,旧文档只作历史输入 | 保持新版架构真相源干净 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` / `00_req_step_16_traceability_matrix.md` C-1, FR-PROC-001 | 运行时过程形态必须成立,但不能接管 method-library 定义正文 | `L1-process` 拥有 runtime process shape、ProcessProfile 和过程裁剪语境;method-library definition 正文只通过正式来源承接 | §2 业务背景与驱动力;§4 职责边界;§6 限界上下文;§9 数据所有权;§12 备选方案与取舍 | 架构把需求中的过程形态能力转译为独立 Process truth,同时用数据归属和方案取舍排除定义正文入仓。 |
| `00-需求文档.md` / `00_req_step_16_traceability_matrix.md` C-2, FR-PROC-002 | 项目过程实例必须成立,但不得拥有 Project / Work truth | ProcessInstance 只表达过程实例事实和项目语境引用;ProjectRef / work 摘要为外部引用或快照 | §4 职责边界;§5 系统上下文;§9 数据所有权;§10 关键交互 | 架构承接实例成立需求,但通过系统上下文和数据所有权防止把 Work 语义写入 Process。 |
| `00-需求文档.md` / `00_req_step_16_traceability_matrix.md` C-3, FR-PROC-003, FR-PROC-004 | Activity、Token / Gateway 和执行语境必须表达过程节点、流控位置与反馈绑定 | 仓内核心子域拆分为 Runtime Process Shape、Process Execution、Gate Coordination、Checkpoint & Recovery 等已收稳语义边界 | §4 职责边界;§6 限界上下文;§9 数据所有权;§10 关键交互 | 架构把节点和流控能力保留在 Process 内部统一语言中,同时明确不等同于 WorkItem、Iteration 或 runtime step。 |
| `00-需求文档.md` / `00_req_step_16_traceability_matrix.md` C-4, FR-PROC-005, FR-PROC-006 | 暂停等待、恢复语境和过程事实恢复连续性必须成立 | waiting gate、pause context、checkpoint / recovery fact 归属 Process truth;治理和 runtime 只提供引用、快照或结果输入 | §4 职责边界;§5 系统上下文;§6 限界上下文;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构承接等待恢复能力,并通过外部真相隔离和 recovery 连续性防止恢复链路变成 governance 或 runtime 真相。 |
| `00-需求文档.md` / `00_req_step_16_traceability_matrix.md` C-5, FR-PROC-007, FR-PROC-008 | 过程执行事实必须可消费、可追溯、可维护和可对账 | read model / timeline / progress summary 是派生消费面;process audit / traceability record 承接追溯;维护路径不得反写真相 | §8 依赖方向;§9 数据所有权;§10 关键交互;§11 关键技术选型;§13 横切关注点 | 架构把消费和维护拆出核心写路径,用只读派生和后台维护承接需求而不形成第二写源。 |
| `00_req_step_11_data_ownership.md` / `00_req_step_16_traceability_matrix.md` 数据归属要求 | Process 只能拥有过程真相、派生快照和必要引用,禁止保存外部正文 | 数据所有权表明确 Process truth、external snapshot、external ref、derived read model 和 forbidden body 的边界 | §9 数据所有权与一致性策略;§12 备选方案与取舍;§15 风险与待确认事项 | 架构把数据归属需求转译为一票否决红线,防止正文通过 snapshot、evidence、report 或 maintenance 进入本仓。 |
| `00_req_step_12_interfaces_dependencies.md` / `00_req_step_16_traceability_matrix.md` 跨仓依赖约束 | 只能稳定依赖 core,不能让 sibling repo 成为编译期依赖 | 内部层间方向、依赖倒置、禁止依赖表和依赖裁剪图共同约束跨仓协作 | §8 依赖方向与层间约束;§11 关键技术选型;§12 备选方案与取舍;§15 风险与待确认事项 | 架构把依赖约束转译为结构规则:非 core sibling 只通过 runtime seam、event、ref、snapshot 或 handoff 协作。 |
| `00_req_step_09_functional_requirements.md` / `00_req_step_14_acceptance_criteria.md` 同步 / 异步 / 后台能力要求 | 核心决策、外部结果、投影维护和恢复对账不能混在单一路径 | 同步入口处理 Process truth 决策;异步路径承接外部结果和事实传播;后台路径承接 projection、reconciliation、recovery 和 handoff | §7 容器 / 部署架构;§10 关键交互与通信方式;§11 关键技术选型;§12 备选方案与取舍 | 架构用交互分工承接不同一致性需求,避免全同步或全事件化路径打穿边界。 |
| `00_req_step_13_non_functional_requirements.md` / `00_req_step_14_acceptance_criteria.md` 安全、审计、恢复、可观测和配置约束 | 过程推进、等待、恢复和跨仓传播必须可追溯、可审计、可恢复、可观测 | 横切关注点约束安全边界、审计追溯、可观测性、韧性恢复、性能容量和配置变更控制 | §13 横切关注点;§14 演进路线;§15 风险与待确认事项 | 架构把非功能需求转译为跨章节约束,但不提前定义具体日志字段、指标 schema 或配置清单。 |
| `00_req_step_15_risks_open_questions.md` / `01_arch_step_14_risks_open_questions.md` 风险与待确认口径 | 未闭合的 API、状态机、schema、存储和产品级技术选择不得由实现自行补真相源 | 风险章节区分当前可接受、条件阻塞和直接阻塞;技术选择章节明确产品级硬选择延后但不得推翻边界 | §11 关键技术选型;§15 风险与待确认事项;§17 ADR 索引 | 架构承接“不确定项不脑补”的流程约束,防止后续详细设计和实现阶段出现隐含第二真相。 |
| `00_req_step_08_user_stories.md` / `00_req_step_09_functional_requirements.md` FR-PROC-E01~E05 | 高级投影视图、完整 BPMN、模板刚度、自动建议、容量趋势属于外围增强 | 演进路线保留触发条件;当前主线不把外围增强作为核心闭环前置 | §3 约束条件;§12 备选方案与取舍;§14 演进路线;§15 风险与待确认事项 | 架构保留增强来源并说明不阻塞当前主线,避免把外围增强误判为未承接核心需求。 |

### 7.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | C-1~C-5 核心闭环和 FR-PROC-001~FR-PROC-008 | 职责边界;数据所有权;关键交互;横切关注点 | 无缺口 | 核心闭环和核心功能均已映射到明确架构承接结果和章节位置。 |
| 需求未被承接 | FR-PROC-E01~FR-PROC-E05 外围增强 | 演进路线;风险与待确认事项 | 已挂起,非缺口 | 外围增强已作为演进项保留,当前不作为核心闭环前置。 |
| 架构判断缺来源 | 独立 Process truth、外部正文禁止、非 core sibling 禁止编译期依赖、projection 不反写、recovery 不分叉等主线判断 | 架构主线;数据归属;依赖方向;恢复 | 无缺口 | 这些判断均可追溯到需求基线、数据归属、一票否决项或 Step 11 / Step 14 的取舍与风险。 |
| 承接关系未闭环 | API / Command / Query / Event / Job 名称和字段形态 | 详细设计;测试方案;实现 boundary | 架构层不阻塞,后续文档必须闭合 | 该项不是架构追溯缺口,但若进入详细设计或实现仍未闭合,会阻塞对应 boundary。 |
| 承接关系未闭环 | 状态机、checkpoint / recovery evidence、projection / handoff 失败 marker、配置项和产品级技术选择 | 详细设计;配置设计;测试方案;实施计划 | 架构层已挂起 | 当前只保留架构语义和边界,不在 Step 15 主观补 schema 或产品选型。 |
| ADR 缺失 | 长期架构主线决策 | 后续读者理解;实施约束;评审追溯 | 已建立 ADR 索引 | §7.3 已把长期影响主线的架构决定沉淀为 ADR 索引项。 |
| ADR 误收录 | 旧技术栈、旧性能数字、局部实现库、未收稳 schema | ADR 索引质量;架构真相源 | 已排除 | 这些事项不满足长期稳定架构决策标准,不得进入 ADR 索引。 |

### 7.3 ADR 索引表

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| ADR-PROC-ARCH-001 | 以独立 Process truth 作为 `L1-process` 架构核心 | 防止过程执行事实散落在 method-library、work、governance、runtime、conversation 或 workspace 中形成多真相 | 职责边界;数据所有权;备选方案;风险 | 该决策长期决定本仓为什么独立存在,也决定后续所有对象、交互和恢复设计都必须围绕同一 Process truth 展开。 |
| ADR-PROC-ARCH-002 | Runtime process shape 消费 method-library definition,但不拥有 definition body | 解决过程形态需要承接方法定义、同时不能接管方法库正文的问题 | 职责边界;限界上下文;数据归属;关键交互 | 该决策长期保护 Process / method-library 边界,后续任何模板、裁剪或形态扩展都必须遵守。 |
| ADR-PROC-ARCH-003 | `L1-process` 仅允许 `L0-core` 编译期依赖,非 core sibling 通过运行期边界协作 | 防止 L1 真相域之间通过源码依赖形成隐性上下级和边界串线 | 依赖方向;技术机制;备选方案;风险 | 该决策会长期影响仓间协作、adapter 设计和实施边界,不是局部构建选择。 |
| ADR-PROC-ARCH-004 | 通过正式输入承接边界隔离外部输入与核心 Process 语义 | 防止 Work、Governance、Runtime、Artifact、Conversation 等外部事实直接打穿核心边界 | 系统上下文;职责边界;关键交互;横切安全 | 该决策长期决定外部结果只能以 ref、snapshot、event、handoff 或 marker 进入 Process 语境。 |
| ADR-PROC-ARCH-005 | 同步真相决策、异步结果 / 事实传播、后台维护三类路径分离 | 解决所有交互压进同步闭环或全部事件化导致的耦合、延迟和可恢复性问题 | 容器部署;关键交互;一致性策略;备选方案 | 该决策长期影响 API、consumer、job、projection、reconciliation 和 recovery 的职责分工。 |
| ADR-PROC-ARCH-006 | 明确区分本仓真相、外部快照、外部引用、派生读模型和禁止正文 | 解决外部正文、快照和引用容易混写并反向污染 Process truth 的问题 | 数据所有权;一致性策略;风险;横切审计 | 该决策长期约束所有数据进入和对外供给方式,也是后续设计可落码性的核心红线。 |
| ADR-PROC-ARCH-007 | read model / projection 只能消费和派生,不得反写真相 | 防止查询、报告、对账、重建或维护路径成为第二写源 | 数据所有权;关键交互;技术机制;风险 | 该决策长期保护写 / 读 / 维护边界,直接影响查询和后台维护设计。 |
| ADR-PROC-ARCH-008 | checkpoint / recovery 维护同一 Process truth 连续性,不得形成第二份恢复真相 | 解决失败恢复可能落入 runtime checkpoint、archive body 或独立 recovery truth 的问题 | 数据一致性;横切韧性;演进路线;风险 | 该决策长期决定恢复能力如何承接过程事实,并约束后续 evidence、存储和 handoff 设计。 |
| ADR-PROC-ARCH-009 | 显式表达 stale / unresolved / waiting / invalid / failed / retryable 等外部和派生状态 marker | 解决跨仓快照、外部引用、派生维护和下游传播失败不可见的问题 | 一致性策略;关键交互;横切可观测;风险 | 该决策长期影响 public contract、查询解释、维护 job 和故障恢复,但字段 schema 留给后续详细设计闭合。 |
| ADR-PROC-ARCH-010 | 产品级语言、状态存储、消息、对象存储、完整 BPMN 等硬选择延后,且不得推翻已收稳边界 | 防止旧技术栈或未验证产品选择反向决定架构边界和数据归属 | 技术选型;备选方案;演进路线;风险 | 该决策长期保护架构层与产品 / 实施层的职责分离,也说明哪些旧 Draft 口径不能继承。 |

### 7.4 追溯范围说明

本章采用关键需求结论和关键架构约束为追溯粒度,不把 Step 1~Step 14 的每一行表格机械展开为目录对照。主矩阵只记录已经成立的来源—承接关系,漏项检查表只记录当前是否仍有追溯缺口或后续详细设计挂起项。API、状态机、schema、存储和产品级技术选择已经在风险章节挂起,当前不补写为确定架构结论。ADR 索引只记录长期影响 Process 主线的架构决定,不继承旧文档中的局部技术选择或未收稳占位。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“需求追溯矩阵”“漏项检查表”和“追溯范围说明”小节,了解本章如何把需求结论、架构承接结果和章节位置显式连接起来。

正式章节应摘录:

- `design-calibration/01_arch_step_15_adr_traceability.md` §7.1 需求追溯矩阵。
- `design-calibration/01_arch_step_15_adr_traceability.md` §7.2 漏项检查表。
- `design-calibration/01_arch_step_15_adr_traceability.md` §7.4 追溯范围说明。

## 17. ADR 索引

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“ADR 索引表”和“追溯范围说明”小节,了解哪些架构决定已经足够长期、足够关键,需要被后续读者单独理解。

正式章节应摘录:

- `design-calibration/01_arch_step_15_adr_traceability.md` §7.3 ADR 索引表。
```

---

## 9. 进入下一步条件

- 已明确哪些架构决定需要 ADR。
- 已建立关键需求、约束和风险与架构承接结果之间的追溯关系。
- 已明确承接位置和承接理由。
- 已检查核心需求、关键约束和长期架构决定没有孤儿项。
- 未在追溯矩阵或 ADR 索引中新增前文未确认的架构结论。
- 未把未闭合的详细设计问题、产品技术选择或局部实现偏好升格为 ADR。

结论:可以进入 Step 16 `整理正式文档`。
