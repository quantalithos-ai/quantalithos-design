# L3-method-library 01 架构设计全量重启校准流程

> 状态: completed
> 创建日期: 2026-06-14
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L3-method-library`
> 正式文档目标: `projects/L3-method-library/01-架构设计.md`
> 本轮口径: 基于新版 `00-需求文档.md` 全量重新讨论架构,不是续写旧 `01` 或旧 `02_hld_*` / `03_ddd_*` 材料。
> `/tmp` 工作台: `/tmp/l3_method_library_01_architecture_discussion_steps.md`

---

## 1. 执行原则

本流程只负责 `L3-method-library` 的 `01-架构设计`。执行时必须按架构 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每个 Step 先列必读文档。
- 每个 Step 先搭整体模块,再逐模块先思考、后写入。
- 每个模块必须包含问题回答、诊断、取舍、结构化中间产物和回填草稿。
- 旧 `L3-method-library` 正式文档、历史 `02_hld_*` 和历史 `03_ddd_*` 只能在对应 Step 形成独立结论后做差异审计。
- 未到达的 Step 只保留在本文总计划中,不得提前创建未来 Step 文件。
- 正式 `01-架构设计.md` 每章必须能追溯到具体 `01_arch_step_*` 中间产物。
- 架构阶段不得写数据库表、Rust struct、repository、port、handler、事务流程、协议 schema 或代码目录。

---

## 2. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | 架构 Step 顺序、Step 内小阶段、架构单元小循环。 | read |
| `standards/document/架构设计书写规范.md` | 正式架构文档章节结构、图表规则和校准来源格式。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、状态表、停审和长文档分批纪律。 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 后续 Step 7 的跨仓依赖裁剪规则。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止架构结论诱发后续 schema / port / 状态缺口。 | read |
| `/tmp/quantalithos_subproject_discussion_plan.md` | 确认本轮项目讨论顺序与 L3-method-library 未完成状态。 | read |
| `/tmp/l3_method_library_00_requirements_discussion_steps.md` | 继承 00 需求重启纪律。 | read |
| `/tmp/l3_method_library_01_architecture_discussion_steps.md` | 本轮 01 架构重启执行计划。 | read |

---

## 3. 本仓权威输入

| 文档 | 用途 | 状态 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 本轮架构设计的第一权威输入。 | read |
| `projects/L3-method-library/design-calibration/00_requirements_calibration_flow.md` | 确认 00 需求 Step 1~17 已完成。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_02_position_boundary.md` | 架构定位、职责边界和系统上下文输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_06_consumers_dependencies.md` | 依赖方向和上下游输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_07_core_capability_loop.md` | 核心能力闭环、架构单元候选和关键交互输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_09_functional_requirements.md` | 功能能力输入,用于推导容器 / 交互边界。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_10_business_rules_boundaries.md` | 边界红线、约束和横切关注点输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_11_data_ownership.md` | 数据所有权和一致性策略输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_12_interfaces_dependencies.md` | 接口能力和事件协作架构输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_13_non_functional_requirements.md` | 架构目标、NFR 和技术选型约束输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_15_risks_open_questions.md` | 架构风险与待确认事项输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_16_traceability_matrix.md` | 架构需求追溯输入。 | read |

---

## 4. Step 总任务表

| Step | 中间产物 | 主题 | 状态 | 前序依赖 | 完成门禁 |
|---:|---|---|---|---|---|
| 1 | `01_arch_step_01_requirement_baseline.md` | 确认需求基线 | done | 新版 `00-需求文档.md` 已完成 | 架构需求基线、硬约束、未关闭风险三类分清。 |
| 2 | `01_arch_step_02_goals_constraints.md` | 明确架构目标与约束 | done | Step 1 | 目标、约束、取舍、非目标均可追溯到需求。 |
| 3 | `01_arch_step_03_responsibility_boundary.md` | 职责边界 | done | Step 1~2 | 做 / 不做 / 易混淆 / 红线闭合。 |
| 4 | `01_arch_step_04_system_context.md` | 系统边界与上下文 | done | Step 1~3 | 上下文图、上下游表、边界说明闭合。 |
| 5 | `01_arch_step_05_bounded_context_subdomains.md` | 限界上下文与子域划分 | done | Step 3~4 | 架构单元逐个停审,跨上下文语义边界审计完成。 |
| 6 | `01_arch_step_06_container_deployment.md` | 容器 / 部署架构 | done | Step 4~5 | 运行单元图和说明不下沉到目录、handler 或部署脚本。 |
| 7 | `01_arch_step_07_dependency_direction.md` | 依赖方向与层间约束 | done | Step 5~6 | 依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图完成。 |
| 8 | `01_arch_step_08_data_ownership_consistency.md` | 数据所有权与一致性策略 | done | Step 3/5/7 | truth / snapshot / projection / ref / forbidden body 和一致性口径闭合。 |
| 9 | `01_arch_step_09_interactions_communication.md` | 关键交互与通信方式 | done | Step 4/6/8 | 每类交互有通信方式和失败口径,不写协议 schema。 |
| 10 | `01_arch_step_10_technology_choices.md` | 关键技术选型 | done | Step 2/7/8/9 | 选型有约束来源和反向影响,不写 crate 细节。 |
| 11 | `01_arch_step_11_alternatives_tradeoffs.md` | 备选方案与取舍 | done | Step 2/10 | 每个取舍有选择、放弃原因、代价和后续承接。 |
| 12 | `01_arch_step_12_cross_cutting_concerns.md` | 横切关注点 | done | Step 2/8/9/10 | 按架构单元判断适用性,无模板化空话。 |
| 13 | `01_arch_step_13_evolution_path.md` | 演进路线 | done | Step 10~12 | 阶段演进不破坏 P0 truth / dependency / data 边界。 |
| 14 | `01_arch_step_14_risks_open_questions.md` | 风险与待确认事项 | done | Step 1~13 | 风险、待确认、当前处理口径分清。 |
| 15 | `01_arch_step_15_adr_traceability.md` | ADR 与需求追溯 | done | Step 1~14 | ADR 索引、追溯矩阵、孤儿项审计完成。 |
| 16 | `01_arch_step_16_formal_document_assembly.md` | 整理正式文档 | done | Step 1~15 | 正式每章有具体校准来源,正文不新增未确认结论。 |

---

## 5. 当前 Step

当前执行状态: Step 1~16 已完成,`01-架构设计.md` 已全量重建。

Step 1 已完成:

- 新版需求中哪些结论成为架构基线。
- 哪些需求规则是架构不可改变的硬约束。
- 哪些未关闭需求风险会影响后续架构判断。

Step 1 明确不处理:

- 系统上下文图。
- 职责边界细化。
- 限界上下文和架构单元划分。
- 容器、部署、数据一致性方案、技术选型、接口 schema、事件 schema 或实现目录。

Step 1 输出:

- `projects/L3-method-library/design-calibration/01_arch_step_01_requirement_baseline.md`

Step 2 已完成:

- 架构目标。
- 不可变架构约束。
- 架构层取舍和非目标。

Step 3 已完成:

- 本仓在方法资产定义源方面承担什么职责。
- 本仓不承担哪些相邻仓职责。
- role / template / policy / view / package / execution 等易混淆边界如何收紧。

Step 4 已完成:

- 本仓在全局系统中的正式上下游和输入输出面。
- 核心、条件、候选和外围上下文关系。
- 系统上下文图、上下游表和边界说明。

Step 5 已完成:

- 本仓内部限界上下文与子域划分。
- 核心子域、支撑子域、本地索引 / 投影 / 引用边界。
- 架构单元停审与跨单元审计。

Step 6 已完成:

- 本仓运行承载视角和容器 / 部署架构。
- 同步入口、异步协作、后台维护、正式状态承载、读取与追溯承载。
- 运行单元图、运行单元说明和部署说明。

Step 7 已完成:

- 本仓内部责任层和跨仓依赖方向。
- 编译期、运行期、事件协作依赖裁剪。
- 禁止依赖表和依赖方向图。

Step 8 已完成:

- 本仓数据所有权和一致性策略。
- truth / snapshot / projection / ref / forbidden body 边界。
- 哪些数据属于本仓正式拥有,哪些只能作为摘要、引用或读取材料。

下一步 Step 9 将只处理:

- 本仓关键交互与通信方式。
- 哪些交互适合同步能力边界、异步事件、后台维护或补偿路径。
- 失败时的架构层降级或挂起口径,不写协议 schema。

Step 9 已完成:

- 关键交互场景与正式边界位置。
- 同步请求 / 响应类交互、异步事件 / 回调类交互、后台任务 / 延后承接类交互的选择口径。
- 失败时的挂起、待承接、显式不可用和待恢复口径。

下一步 Step 10 将只处理:

- 关键技术选型在架构层是否需要固定。
- 技术选择如何服务 Step 2/7/8/9 的目标、依赖、数据和通信边界。
- 哪些技术细节必须留给概要、详细、配置或实施文档。

Step 10 已完成:

- 架构层关键技术机制。
- 每项机制解决的问题、采用理由和代价 / 约束。
- 不固定具体数据库、缓存、消息、协议、对象存储、指纹算法、事件格式、任务调度或部署环境。

下一步 Step 11 将只处理:

- 当前主线方案与相邻替代方案的结构性取舍。
- 为什么不采用共享数据库、复制外部正文、同步等待所有下游、把执行/治理/交易职责迁入本仓等方案。
- 每项取舍的收益、代价和后续承接。

Step 11 已完成:

- 当前主线方案是“独立定义真相与分层承接方案”。
- 已比较文档/Git 替代、下游私有模型、共享 truth、直接暴露核心、同步等待下游、复制外部正文、全量外围能力前置、强治理前置和全后台异步写入。
- 已明确采用 / 不采用结论与对应代价。

下一步 Step 12 将只处理:

- 横切关注点在本仓架构层如何形成约束。
- 安全、审计、可观测、韧性、性能、配置和兼容性等横切要求按架构单元是否适用。
- 横切要求不得下沉成监控指标、权限矩阵、配置项、日志字段、重试算法或部署方案。

Step 12 已完成:

- 横切关注点为安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制、兼容性 / 演进控制。
- 已按 Step 5 的 8 个架构单元完成适用性停审。
- 未继承旧指标、日志字段、P95、outbox、fingerprint、cache、配置项或恢复脚本。

下一步 Step 13 将只处理:

- 当前阶段做到哪里算架构成立。
- 外围增强、治理强化、artifact 核心消费、指标化与具体实现机制如何后续演进。
- 哪些债务当前可接受,哪些触发条件会要求回写前序 Step。

Step 13 已完成:

- 当前主线成立阶段、核心消费稳定强化阶段、条件型治理与外部依据增强阶段、外围包 / 方法集组织阶段、观测与恢复强化阶段、资产范围 / 下游范围扩展阶段。
- 已明确每个阶段的可接受债务、后续演进项和触发条件。
- 未把项目排期、任务拆单、边界外职责或未来愿望池写成架构演进。

下一步 Step 14 将只处理:

- 尚未关闭的架构风险和待确认事项。
- 每个风险的影响范围、当前处理口径和是否阻塞。
- 每个待确认事项当前如何挂起,不得脑补为确定结论。

Step 14 已完成:

- 已归并 Step 1~13 尚未关闭的架构风险和待确认事项。
- 已区分风险、待确认事项、当前处理口径和有条件阻塞项。
- 已明确未闭口内容不得进入核心主线,范围扩展必须回写前序 Step。

下一步 Step 15 将只处理:

- ADR 索引和需求追溯矩阵。
- 已确认架构决策到需求、约束、风险和待确认事项的映射。
- 孤儿架构结论、遗漏需求和旧材料残留审计;不新增新的架构决策。

Step 15 已完成:

- 已形成本轮 9 个长期架构决策的 ADR 索引。
- 已建立需求 / 约束到架构承接结果的追溯矩阵。
- 已显式保留 Qualification / CapabilityDefinition、强治理前置、artifact 核心消费、验收量化等追溯缺口。
- 已确认旧 ADR 编号、fingerprint、outbox、snapshot、P95、DB/cache 等旧机制不直接进入本轮 ADR。

下一步 Step 16 将只处理:

- 将 Step 1~15 已确认结论装配为正式 `projects/L3-method-library/01-架构设计.md`。
- 每个正式章节标注具体校准来源。
- 不新增 Step 1~15 之外的新架构判断,不恢复旧文档中的旧范围或旧实现机制。

Step 16 已完成:

- 已创建 `design-calibration/01_arch_step_16_formal_document_assembly.md`。
- 已按正式 1~18 章全量重建 `projects/L3-method-library/01-架构设计.md`。
- 已为正式文档每章标注具体校准来源。
- 已确认旧 ADR 编号、旧范围、fingerprint/outbox/snapshot/P95/DB/cache 等旧机制未作为正式结论继承。

本轮 `L3-method-library` 的 `01-架构设计` 全量重启校准完成。

---

## 6. 旧材料读取规则

| 旧材料 | 读取时机 | 用途 |
|---|---|---|
| `projects/L3-method-library/README.md` | 每个 Step 独立结论形成后 | 差异审计;不得作为初始答案。 |
| `projects/L3-method-library/01-架构设计.md` | 每个 Step 独立结论形成后 | 对比旧架构,筛掉旧口径残留或可保留事实。 |
| `projects/L3-method-library/02~07` | 对应 Step 需要时后置读取 | 只用于发现旧文档是否提前写了架构层不该写的内容。 |
| `projects/L3-method-library/design-calibration/02_hld_*` | Step 5 之后后置读取 | 只用于发现概要设计旧口径是否反向污染架构。 |
| `projects/L3-method-library/design-calibration/03_ddd_*` | Step 8 之后后置读取 | 只用于发现详细设计旧对象 / port / state 是否不应进入架构层。 |
| `projects/L3-method-library/legacy/03-详细设计.v0.1.0.md` | 必要时后置读取 | 仅用于旧口径风险排查。 |

---

## 7. 总门禁

| 检查项 | 当前状态 | 说明 |
|---|---|---|
| 是否承接新版 00 需求 | pass | `00-需求文档.md` 与 00 校准产物作为第一输入。 |
| 是否把旧 01 当作权威输入 | pass | 旧材料只在 Step 独立结论形成后做差异审计。 |
| 是否提前创建未来 Step 文件 | pass | 只创建总流程和 Step 1~16 文件。 |
| 是否避免实现细节下沉 | pass | 本流程不写代码、DB、port、handler、DTO、event schema。 |
| 是否按模块先思考再写入 | pass | 已完成 Step 均记录模块思考与结构化产物。 |
| 是否已完成正式文档装配 | pass | `01-架构设计.md` 已按 Step 1~16 重建。 |
