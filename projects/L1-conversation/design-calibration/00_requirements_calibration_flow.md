# L1-conversation 需求文档校准工作台

> 对应文档: `projects/L1-conversation/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 创建日期: 2026-05-31
> 当前目标: 按最新需求 SOP 校准 `L1-conversation`，并允许它依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity` 结论。

---

## 1. 本轮校准原则

- `L1-conversation` 可以依赖已经稳定的 `L0-core`、`L0-bus`、`L0-sdk` 和 `L1-identity` 设计结论，不重新定义 ID、Error、Event、TraceContext、SDK client、成员身份或角色生命周期。
- `L1-conversation` 是对话真相域，不是 Chat UI、Workspace 聚合视图、Bridges 外部平台适配、Runtime LLM 推理或 Governance 决策系统。
- 旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入，不能直接视为新版需求基线。
- 本轮先按 Step 逐个生成中间产物，最后在 Step 17 删除旧 `00-需求文档.md` 并按新文件标准重建正式需求文档。
- 每个 Step 必须独立落盘、独立更新本文状态，不合并 Step。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `L0-core` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游，承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `L0-bus` | 已完成 `00`~`07` 深度校准 | 作为事件协作上游，承接发布、订阅、ack、retry、dead-letter、replay、tap 和报告证据口径 |
| `L0-sdk` | 已完成 `00`~`07` 深度校准 | 作为 L5/L6 与外部调用方默认接入方式，后续接口需求应考虑 SDK 封装边界 |
| `L1-identity` | 已完成深度校准 | 作为成员引用、actor、角色和生命周期来源，不在 conversation 内重建身份真相 |
| `product/六域模型.md` | 旧全局领域模型 | 作为 Conversation 是六域之一、一等聚合根和事件协作规则的产品 / 领域输入 |
| `domain/conversation/README.md` | 旧对话域详细设计 | 作为候选事实、术语和风险来源，不高于新版需求结论 |
| 旧 `L1-conversation` 文档 | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |

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
| Step 10 | 业务规则与边界约束 | 已完成 | `design-calibration/00_req_step_10_rules_boundary_constraints.md` |
| Step 11 | 数据需求与数据归属 | 已完成 | `design-calibration/00_req_step_11_data_requirements_ownership.md` |
| Step 12 | 接口与依赖 | 已完成 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| Step 13 | 非功能需求 | 已完成 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| Step 14 | 验收标准 | 已完成 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| Step 15 | 风险与待确认事项 | 已完成 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| Step 16 | 需求追溯矩阵 | 已完成 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| Step 17 | 正式整理为 `00-需求文档.md` | 已完成 | `design-calibration/00_req_step_17_formal_document_assembly.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-001 | 是否从旧版 `00-需求文档.md` 直接局部修补 | 否。旧文档作为输入，正式文档在 Step 17 删除旧文件后按新文件标准重建。 |
| D-002 | `L1-conversation` 是否重新定义身份 / actor / role | 否。成员、actor、角色和生命周期来源于 `L1-identity` 与 `L0-core` 引用。 |
| D-003 | `L1-conversation` 是否拥有 Chat UI 或 Workspace 视图 | 否。Conversation 拥有对话真相，Chat / Workspace 只能消费或聚合。 |
| D-004 | `L1-conversation` 是否实现 LLM 推理或 AI member runtime | 否。它只记录、查询、推送对话事实，不跑 agent loop。 |
| D-005 | `domain/conversation/README.md` 是否作为权威详细设计直接继承 | 否。它是历史草案和候选事实来源，不高于新版需求 SOP 与稳定 L0/L1 上游。 |
| D-006 | `L1-conversation` 的一句话定位 | 定位为平台对话真相仓，而不是 Chat UI、Workspace 聚合视图、Bridges 适配、Runtime 推理或 Governance / Artifact / Identity 真相仓。 |
| D-007 | Step 3 的问题主线 | 问题主线收敛为“缺少统一对话真相域会导致协作可见性、跨端消费和审计追溯失真”，不把实时推送、四形态、AG-UI 或性能指标写成问题主线。 |
| D-008 | Step 4 的目标口径 | 目标写成对话真相域的状态、边界和能力范围；Chat UI、Workspace 聚合、Bridges 适配、Runtime 推理、Governance / Artifact / Identity 真相和 Observability / Archive 全局能力均为非目标。 |
| D-009 | Step 5 的角色口径 | 角色按人类协作、AI 协作、系统记录、审计 / 维护和开发消费分类；Chat / Workspace / Bridges / Governance / Artifact 等仓际关系不写成角色，后移到 Step 6。 |
| D-010 | Step 6 的依赖口径 | `L0-core` 是唯一编译期依赖，`L0-bus` 是事件协作主干，`L1-identity` 是基础 actor / participant 前置；`L1-work` 是项目型对话前置；Chat / Workspace / Bridges / Runtime / Observability / Archive 是使用方或协作方，不拥有 Conversation 真相。 |
| D-011 | Step 7 的核心能力闭环 | Conversation 的核心闭环是“对话空间与参与范围确立 -> 多来源协作事实追加沉淀 -> 授权视野下稳定消费 -> 关键跨域事实引用显化 -> 历史追溯与复盘”；实时推送、全文检索、外部平台同步和大规模容量优化属于外围增强或后续步骤。 |
| D-012 | Step 8 的用户故事口径 | 用户故事按角色目标组织,并逐条映射到 Step 7 闭环节点或外围增强能力；Chat / Workspace / Bridges / Runtime 不作为故事主体,旧故事中的接口、事件、延迟和验收细节后移。 |
| D-013 | Step 9 的功能需求口径 | 功能需求按业务能力归并为 5 项核心闭环能力和 3 项外围增强能力；不沿用旧 Turn kind、Conversation kind、StreamEvents、事件转 Turn 等对象 / 协议 / 事件式功能名。 |
| D-014 | Step 10 的规则口径 | 业务规则按不变量、禁止行为、显式变化、边界约束、治理约束和审计约束收敛；规则保护 Conversation 真相边界,不写实现校验、接口约束、数据库约束、事件 schema 或异常码。 |
| D-015 | Step 11 的数据归属口径 | Conversation 拥有对话空间、参与 / 可见范围、对话事实历史、对话内显化记录和追溯上下文；成员、项目、治理、产物、外部平台、trace / audit material、归档对象等只作为快照或引用；相邻仓正文不得保存。 |
| D-016 | Step 12 的接口与依赖口径 | 接口只写能力级接口面,使用查询接口、变更接口、事件输入、事件输出、后台任务接口等正式类型；依赖边界使用定义来源、治理结论、下游消费、外部能力等正式类型,并保留 Step 6 的编译期 / 运行期 / 事件协作判断。 |
| D-017 | Step 13 的非功能口径 | 非功能需求按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类逐项检查；当前不制造缺少负载依据的吞吐 / 延迟数字,而以可判断口径保护核心对话真相闭环。 |
| D-018 | Step 14 的验收口径 | 验收标准按核心能力闭环、功能能力、规则 / 边界、数据归属、非功能五类收口；一票否决只用于核心闭环不成立、边界串线、数据归属越界、授权失效、关键变化不可追溯等整体不应通过的情况。 |
| D-019 | Step 15 的风险与待确认口径 | 已关闭分歧不重复写成待确认；风险只保留会影响正式需求稳定性的边界风险,待确认事项只保留会影响后续架构、详细设计、测试或实施展开的问题。 |
| D-020 | Step 16 的追溯口径 | 追溯矩阵以功能需求为主轴连接核心闭环、用户故事、业务规则、数据归属和验收标准；当前未发现孤儿功能、孤儿核心规则、孤儿验收项或新增未确认项。 |

---

## 5. 下一步

当前已完成 Step 1、Step 2、Step 3、Step 4、Step 5、Step 6、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 13、Step 14、Step 15 和 Step 16。

下一步已完成:

```text
Step 17. 整理正式文档
```

Step 17 重点:

- 已删除旧 `projects/L1-conversation/00-需求文档.md`,并按新文件标准重建正式需求文档。
- 正式文档已按章节引用对应 `design-calibration` 中间产物,并引导读者继续阅读对应章节。
- 正式文档只整理已确认结论,不新增需求、不新增规则、不新增接口细节。
- 已检查标题层级、章节顺序、术语、引用和格式一致性。

后续可进入:

```text
01-架构设计校准
```
