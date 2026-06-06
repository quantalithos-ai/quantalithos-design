# L1-process 需求文档校准工作台

> 对应文档: `projects/L1-process/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 创建日期: 2026-06-05
> 当前目标: 按最新需求 SOP 校准 `L1-process`,并允许它依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work` 和 `L3-method-library` 结论。

---

## 1. 本轮校准原则

- `L1-process` 可以依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work` 和 `L3-method-library` 设计结论,不重新定义共享契约、事件协作、SDK 接入、actor / member、对话事实、项目工作事实或方法定义。
- `L1-process` 是过程执行真相仓,不是 method-library 定义仓、work 项目工作事实仓、governance 决策仓、artifact 正文仓、conversation 真相仓、identity 成员真相仓、runtime 执行仓、member-service 容器编排仓或 workspace 视图仓。
- 旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入,不能直接视为新版需求基线。
- 旧 `domain/process/README.md` 是重要历史领域输入和不变量线索,但它包含大量详细设计、字段、状态机和实现倾向,不能高于新版 SOP 和已完成上游正式文档。
- 旧文档中的 `Python + PostgreSQL`、BPMN 引擎生态、分区表、对象存储和性能指标只作为历史候选输入;需求阶段不确认实现技术栈。
- 本轮先按 Step 逐个生成中间产物,最后在 Step 17 删除旧 `00-需求文档.md` 并按新文件标准重建正式需求文档。
- 每个 Step 必须独立落盘、独立更新本文状态,不合并 Step。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `L0-core` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游,承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `L0-bus` | 已完成 `00`~`07` 深度校准 | 作为事件协作上游,承接发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `L0-sdk` | 已完成 `00`~`07` 深度校准 | 作为 L5/L6 与外部调用方访问 process 能力的默认封装边界输入 |
| `L1-identity` | 已完成深度校准 | 作为 GlobalMember、actor、角色和成员生命周期来源 |
| `L1-conversation` | 已完成 `00`~`07` 深度校准 | 作为 conversation space、conversation fact、trace / handoff 和显化过程上下文的相邻真相来源 |
| `L1-work` | 已完成 `00`~`07` 深度校准 | 作为 Project、ProjectMember、Backlog、WorkItem、Iteration、ProcessTimeboxRef 协作边界来源 |
| `L3-method-library` | 已完成深度校准 | 作为 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 等定义真相来源 |
| `product/最终目的.md` | 产品叙事上游 | 承接关键节点强制人类、过程可观察和人机协作需要规则推进的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Process 是六域之一、回答“按什么规矩推进”的领域位置 |
| `architecture/仓库拆分方案.md` | 全局分层上游 | 承接 `quantalithos-process` 在 L1 六域服务层的位置和相邻仓关系 |
| `architecture/架构设计.md` | 全局架构上游 | 承接 process 与 identity、conversation、work、governance、artifact、runtime、workspace 等仓的架构协作位置 |
| `architecture/adr/0007-checkpoint-persistence-in-process.md` | Accepted ADR | 承接 Instance 级 checkpoint 归属 process 的边界 |
| `architecture/adr/0008-activity-completion-policy.md` | Accepted ADR | 承接 Activity completion policy 与 WorkItem 状态独立的边界 |
| `architecture/adr/0010-template-rigidity-levels.md` | Proposed ADR | 作为模板刚度分层的候选输入,后续 Step 15 标注状态风险 |
| `architecture/adr/0011-process-nesting.md` | Proposed ADR | 作为 SubProcess / CallActivity 边界的候选输入,后续 Step 15 标注状态风险 |
| `domain/process/README.md` | 旧过程域详细设计 | 作为 ProcessTemplate / ProcessProfile / ProcessInstance、Activity、Token、checkpoint、gate wait、不变量和历史边界线索 |
| 旧 `L1-process` 文档 | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接总依赖关系,并在 Step 6 / Step 12 裁剪出 `L1-process` 自己的部分 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 与上游文档的关系声明 | 已完成 | `design-calibration/00_req_step_01_upstream_relation.md` |
| Step 2 | 本仓定位与边界 | 已完成 | `design-calibration/00_req_step_02_position_boundary.md` |
| Step 3 | 背景与问题定义 | 已完成 | `design-calibration/00_req_step_03_problem_context.md` |
| Step 4 | 目标与非目标 | 已完成 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| Step 5 | 用户与角色 | 已完成 | `design-calibration/00_req_step_05_users_roles.md` |
| Step 6 | 使用方与依赖 | 已完成 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| Step 7 | 核心能力闭环 | 已完成 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| Step 8 | 用户故事 | 已完成 | `design-calibration/00_req_step_08_user_stories.md` |
| Step 9 | 功能需求 | 已完成 | `design-calibration/00_req_step_09_functional_requirements.md` |
| Step 10 | 业务规则与边界约束 | 已完成 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| Step 11 | 数据需求与数据归属 | 已完成 | `design-calibration/00_req_step_11_data_ownership.md` |
| Step 12 | 接口与依赖 | 已完成 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| Step 13 | 非功能需求 | 已完成 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| Step 14 | 验收标准 | 已完成 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| Step 15 | 风险与待确认事项 | 已完成 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| Step 16 | 需求追溯矩阵 | 已完成 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| Step 17 | 正式整理为 `00-需求文档.md` | 已完成 | `../00-需求文档.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-001 | 是否从旧版 `00-需求文档.md` 直接局部修补 | 否。旧文档作为输入,正式文档在 Step 17 删除旧文件后按新文件标准重建。 |
| D-002 | `domain/process/README.md` 是否作为新版需求权威直接继承 | 否。它是历史领域输入和不变量线索,不高于新版 SOP 与已完成上游正式文档。 |
| D-003 | 旧 `README.md` 的 `Python + PostgreSQL` 是否进入需求基线 | 否。技术栈和存储实现后移到架构、详细设计和实施计划重新裁剪。 |
| D-004 | `L1-process` 是否重新定义 method-library 的流程模板和任务定义 | 否。`ProcessTemplateDef`、`TaskDefinition` 等定义真相属于 `L3-method-library`;process 只消费定义 snapshot / event 并维护运行时索引和执行状态。 |
| D-005 | `L1-process` 是否重新定义 WorkItem / Iteration truth | 否。Project、Backlog、WorkItem、Iteration 和承诺子集属于 `L1-work`;process 只提供过程节奏、Activity 状态和 timebox / instance 引用。 |
| D-006 | `L1-process` 是否拥有 Gate 决策 | 否。process 可发起 waiting gate / decision request,但 Gate / Policy / approval 决策真相属于 `L1-governance`。 |
| D-007 | `L1-process` 的 Step 1 来源口径 | 来源是产品 / 架构 / ADR / 稳定子项目正式文档 / 旧过程域设计共同收敛,不是只继承旧 product、旧 README 和 `domain/process/README.md`。 |
| D-008 | `L1-process` 的一句话定位 | `L1-process` 是过程执行真相仓,负责把方法库发布的过程 / 任务定义转成可执行的运行时索引,并维护 ProcessProfile、ProcessInstance、Activity、Token / Gateway、Checkpoint、waiting gate 意图、恢复和过程节奏等正式过程推进事实。 |
| D-009 | ProcessTemplate 的需求层口径 | 使用 ProcessTemplate runtime index / execution copy 口径,不把 method-library 的 ProcessTemplateDef / TaskDefinition 定义正文并入 process。 |
| D-010 | Activity 与 WorkItem / runtime step 边界 | Activity 是过程节点执行事实,不是 WorkItem、ImplementationPlan step 或 runtime tool step。 |
| D-011 | Checkpoint 与 trace 边界 | process 只拥有 Instance 级 checkpoint;runtime 微步 checkpoint 和 observability reasoning trace 正文不归 process。 |
| D-012 | waiting gate 与治理边界 | process 拥有等待治理决策的意图和过程状态,不拥有 Gate / Policy / decision truth。 |
| D-013 | Step 3 的问题主线 | 问题主线收敛为“过程执行事实缺少统一需求收束”,不把 BPMN 引擎、技术栈、P95 或容量数字写成背景问题。 |
| D-014 | Step 3 的问题集合 | 核心问题是过程执行事实未统一、定义 / 工作 / 运行事实混淆、挂起与恢复链路未抽象。 |
| D-015 | 旧量化指标口径 | `10w 活跃 Instance / 5000w Activity/年`、`CompleteActivity P95 < 200ms`、checkpoint 延迟和恢复时间后移到 Step 13 非功能需求评估。 |
| D-016 | Step 4 的目标口径 | 目标收敛为过程执行事实边界、运行时索引 / Profile、ProcessInstance / Activity / Token、waiting gate / checkpoint / recovery 和相邻仓协作边界;不把功能、P95、容量或测试写成目标。 |
| D-017 | Step 4 的非目标口径 | 非目标覆盖 method-library、work、governance、artifact、runtime、member-service、identity、conversation、workspace、observability、archive 和 Proposed ADR 后续确认项。 |
| D-018 | Step 5 的角色口径 | 角色收敛为项目发起 / 管理者、过程协调 / 技术负责人、执行成员、审计 / 观察者、内部系统调用方、Activity 执行反馈方、运维 / 后台任务;不把具体相邻仓写成角色。 |
| D-019 | Step 5 的权限口径 | 权限差异只写能力级接触方式,不写 API、Command、事件名或状态机动作。 |
| D-020 | Step 6 的依赖裁剪口径 | `L1-process` 的唯一编译期依赖是 `L0-core`;`L0-bus` 是事件协作主干;`L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L2-runtime` 是核心运行期 / 事件协作前置;其它相邻仓按运行期、事件协作、下游消费或追溯交接处理。 |
| D-021 | Step 6 的外部系统口径 | PostgreSQL、BPMN 引擎、对象存储和分区表不进入需求 Step 6 的正式外部依赖,只作为后续架构 / 详细 / 配置 / 实施候选输入。 |
| D-022 | Step 6 的禁止依赖口径 | `L1-process` 不得把 method-library、work、identity、governance、artifact、conversation、workspace、runtime、member-service、observability 或 archive 写成编译期 package dependency。 |
| D-023 | Step 7 的核心闭环口径 | 核心能力闭环收敛为运行时过程形态成立、项目过程实例成立、过程节点和流控位置成立、暂停等待恢复连续成立、过程执行事实可消费可追溯。 |
| D-024 | Step 7 的外围增强口径 | 完整 BPMN / 嵌套过程、模板刚度分层、高级投影视图、容量 / P95 / 恢复 SLO、自动调度 / 重试 / 补偿、完整归档恢复和观测报表不进入核心闭环。 |
| D-025 | Step 7 的闭环图约束 | 闭环图只表达能力成立的逻辑依赖关系,不表达接口时序、事件传播、开发顺序、对象字段或实现机制。 |
| D-026 | Step 8 的用户故事口径 | 用户故事围绕 Step 7 的五个核心闭环节点组织,覆盖运行时过程形态、项目过程实例、过程节点与流控、暂停等待恢复、可消费可追溯。 |
| D-027 | Step 8 的外围故事口径 | 高级投影视图、完整 BPMN / 嵌套过程、模板刚度分层、自动调度 / 重试 / 补偿、容量 / 恢复趋势只作为外围增强故事。 |
| D-028 | Step 8 的排除口径 | method-library、work、governance、artifact、runtime、identity、conversation、workspace 等边界外能力不进入正式用户故事表。 |
| D-029 | Step 9 的功能需求口径 | 功能需求收敛为运行时过程形态形成、项目过程实例成立、过程节点与流控位置表达、Activity 执行语境与反馈绑定、暂停等待与恢复语境表达、过程事实恢复连续性维护、过程执行事实消费与追溯、过程执行事实维护与对账。 |
| D-030 | Step 9 的外围功能口径 | 高级过程投影视图、完整 BPMN / 嵌套过程、模板刚度与高级裁剪策略、自动调度 / 重试 / 补偿建议、容量 / 延迟 / 恢复趋势分析只作为外围增强能力。 |
| D-031 | Step 9 的排除口径 | 旧 F-001~F-013 不直接继承;状态机、checkpoint 机制、waiting gate 协作、artifact outputs、workitem completion policy 等后移规则、数据归属、接口或设计阶段。 |
| D-032 | Step 10 的规则口径 | 规则分为不变量、禁止行为、显式变化、边界约束、治理约束和审计约束,用于保护过程执行事实不被相邻仓污染。 |
| D-033 | Step 10 的关键边界口径 | 运行时过程形态不得替代 method-library 定义真相;ProcessInstance / Activity / Token 不等同 work 或 runtime truth;waiting gate 不等同 governance decision;checkpoint / recovery 只表达 Instance 级恢复连续性。 |
| D-034 | Step 10 的旧规则处理口径 | 旧 BR-001~BR-007 只保留需求层语义;字段、状态、checkpoint 写入时机、事件名和具体状态迁移后移详细设计。 |
| D-035 | Step 11 的数据归属口径 | `L1-process` 只拥有过程执行事实真相;相邻仓数据只可作为快照或引用进入;外部正文不得保存到 Process。 |
| D-036 | Step 11 的 ProcessTemplate 口径 | Process 拥有 ProcessTemplate runtime index / 运行时过程形态,不拥有 ProcessTemplateDef / TaskDefinition / Method Content 定义正文。 |
| D-037 | Step 11 的读模型口径 | process read model / timeline / progress summary 是 Process 真相派生快照,不形成新的业务真相。 |
| D-038 | Step 12 的接口口径 | `L1-process` 只在需求层表达能力级接口面,不写 API、Command、event 名、DTO、字段或实现组件。 |
| D-039 | Step 12 的依赖口径 | 外部输入来自 core、bus、method-library、work、identity、governance、artifact、runtime / member-service 和 conversation;除 `L0-core` 外不得写成编译期依赖。 |
| D-040 | Step 12 的存储依赖口径 | PostgreSQL、object storage 等存储实现不进入需求 Step 12 的正式外部依赖,后移架构 / 配置 / 实施。 |
| D-041 | Step 13 的非功能口径 | 非功能要求按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类展开,并给出判断口径。 |
| D-042 | Step 13 的旧指标口径 | `CompleteActivity P95 < 200ms`、checkpoint write 延迟和 `小 Instance 恢复 < 30s` 只作为候选目标,不作为需求层已验证硬指标。 |
| D-043 | Step 13 的恢复口径 | checkpoint / recovery 的正式要求是关键变化和恢复连续性可追溯、恢复不产生第二份过程真相;具体写入时机后移设计。 |
| D-044 | Step 14 的验收分类口径 | 验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类组织。 |
| D-045 | Step 14 的一票否决口径 | 一票否决只覆盖核心闭环断裂、过程执行事实污染、相邻仓边界打穿、关键变化不可追溯和依赖裁剪失效。 |
| D-046 | Step 14 的旧验收口径 | 旧 Given-When-Then、测试步骤、接口调用、报告路径和旧 P95 / 30s 数字不进入需求层硬验收。 |
| D-047 | Step 15 的风险口径 | 风险只记录会导致边界串线、核心闭环断裂、数据归属打穿、伪量化或后续 Agent 自行补设计的问题。 |
| D-048 | Step 15 的待确认口径 | API / Command / Event、状态机、checkpoint 机制、mandatory gate 前置、完整 BPMN / 嵌套过程、模板刚度、性能候选目标和存储实现后移后续文档。 |
| D-049 | Step 15 的阻塞口径 | 当前无阻塞 Step 16 的待确认项;后续若相邻仓正文入仓、Process 接管相邻真相、恢复分叉、关键变化不可追溯或非 core 编译期依赖发生,必须回退修正。 |
| D-050 | Step 16 的追溯矩阵口径 | 主追溯矩阵以功能需求为主轴,连接核心闭环、用户故事、业务规则、数据归属和验收标准;核心功能 FR-PROC-001~FR-PROC-008 全部闭合,外围增强 FR-PROC-E01~E05 保留为后续能力线索并按 Step 15 挂起,不新增前文未确认项。 |
| D-051 | Step 16 的漏项检查结论 | 当前无孤儿功能、孤儿故事、孤儿规则、孤儿数据归属或孤儿验收项;C-1~C-5 均有故事、功能、规则、数据和验收承接,可进入 Step 17 正式文档重建。 |
| D-052 | Step 17 的正式文档重建口径 | 旧 `00-需求文档.md` 已删除并按新文件标准重建;正式文档逐章标注 `design-calibration` 校准来源,只摘录和收口 Step 1~16 已确认结论,不新增未经讨论的新需求。 |

---

## 5. 下一步

当前已完成:

```text
Step 1. 与上游文档的关系声明
Step 2. 本仓定位与边界
Step 3. 背景与问题定义
Step 4. 目标与非目标
Step 5. 用户与角色
Step 6. 使用方与依赖
Step 7. 核心能力闭环
Step 8. 用户故事
Step 9. 功能需求
Step 10. 业务规则与边界约束
Step 11. 数据需求与数据归属
Step 12. 接口与依赖
Step 13. 非功能需求
Step 14. 验收标准
Step 15. 风险与待确认事项
Step 16. 需求追溯矩阵
Step 17. 正式整理为 `00-需求文档.md`
```

需求校准状态:

```text
Step 1~Step 17 已完成。
```

后续建议:

- 可进入 `01-架构设计.md` 校准流程。
- 后续文档必须阅读本文和 `design-calibration/00_req_step_01_upstream_relation.md` 中被正式文档引用的中间产物。
- 不得绕过本文已收敛的 process / method-library / work / governance / artifact / runtime / identity / conversation / workspace 边界。
