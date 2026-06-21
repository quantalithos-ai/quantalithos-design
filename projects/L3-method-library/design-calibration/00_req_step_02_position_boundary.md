# L3-method-library 00 需求 Step 2: 本仓定位与边界

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 2 章“本仓定位与边界”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 本仓定位与边界 |
| 输出文件 | `design-calibration/00_req_step_02_position_boundary.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md`;`需求文档书写规范.md` §4.2 |
| 已读取前序输入 | yes:`00_req_step_01_upstream_relation.md` |
| 已读取项目输入 | yes:`projects/README.md`;`architecture/仓库拆分方案.md`;`architecture/标准对齐全景图.md`;`standards/子项目遵循规范清单.md`;`projects/L3-method-library/README.md` |
| 当前模式 | full-restart |
| 进入条件 | pass |
| next_allowed_action | Step 2 已完成,允许文档级 flow 进入 Step 3。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | pass | 进入模块 1 思考。 |
| 模块 1 一句话定义:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入模块 1 写入。 |
| 模块 1 一句话定义:再写入 | done | 定位候选与收敛结论 | pass | 进入模块 2 思考。 |
| 模块 2 非职责边界:先思考 | done | 排除职责判断 | pass | 进入模块 2 写入。 |
| 模块 2 非职责边界:再写入 | done | 非职责结论 | pass | 进入模块 3 思考。 |
| 模块 3 混淆对象:先思考 | done | 相邻仓 / 概念识别 | pass | 进入模块 3 写入。 |
| 模块 3 混淆对象:再写入 | done | 边界对象列表 | pass | 进入模块 4 思考。 |
| 模块 4 单独成仓原因:先思考 | done | 独立性判断 | pass | 进入模块 4 写入。 |
| 模块 4 单独成仓原因:再写入 | done | 单独成仓结论 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 冲突 / 可保留事实 / 废弃项 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 2 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 待确认事项 | pass | 允许进入 Step 3。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 2 的影响 |
|---|---|---|
| `00_req_step_01_upstream_relation.md` | Step 1 已确认本仓承接 L3 方法能力层的 method-library 主题,旧材料只作差异审计。 | Step 2 可以从上游来源进入仓级定位,但不能重新定义上游方法论。 |
| `standards/document/需求文档书写规范.md` §4.2 | 本章固定为边界声明表 + 一段 2~4 句边界说明;不得展开使用方与依赖、核心能力、功能、规则、数据归属或接口。 | 本 Step 只写定位和混淆边界,不写依赖矩阵和功能清单。 |
| `projects/README.md` | `L3-method-library` 是正式 27 仓之一,属于 L3 方法能力层 / 运行时能力型项目。 | 本仓定位应突出“能力如何被上下游使用”,但不在本 Step 展开使用方。 |
| `architecture/仓库拆分方案.md` | L3 方法能力层包含 `capability-hub` 与 `method-library`;`method-library` 是方法库 / SPEM Method Content 服务端载体。 | 一句话定义应围绕方法资产定义源,而不是通用内容仓。 |
| `architecture/标准对齐全景图.md` | 本仓主要对齐 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ADR-0009 ViewProfile。 | 可用于定位中的“方法资产”语义,但不能展开资产类型清单。 |
| `standards/子项目遵循规范清单.md` §4.2 | ML1~ML6 约束 Method Content、ProcessTemplate、Role image_variant、AIPolicy 和分发格式。 | 这些支撑“方法资产定义与发布分发语义”,但具体规则留到后续 Step。 |
| `projects/L3-method-library/README.md` | 旧 README 含方法库、技术栈、核心职责、依赖、目录、种子数据和开放问题。 | 只作差异审计;技术栈、目录、种子数据不得继承。 |

---

## 3. 整体模块骨架

| 模块 | 要回答的问题 | 输出 | 不输出 |
|---|---|---|---|
| 模块 1:一句话定义 | 本仓最短定位是什么? | 仓级一句话定义。 | 不列对象字段、接口、事件或实现路径。 |
| 模块 2:非职责边界 | 本仓明确不承担哪些相邻职责? | 非职责排除句。 | 不写业务规则表、验收项或数据归属细目。 |
| 模块 3:混淆对象 | 最容易与本仓串线的仓、层、能力或概念是什么? | 边界对象列表。 | 不展开依赖关系和数据归属矩阵。 |
| 模块 4:单独成仓原因 | 为什么不能并入相邻仓? | 单独成仓原因。 | 不展开架构选型对比、技术栈或实施计划。 |

---

## 4. 模块思考记录

### 4.1 模块 1:一句话定义

问题回答:

- 本仓不是通用内容库,而是 L3 方法能力层中承载方法资产定义、发布身份和分发语义的仓。
- 上游材料使用 Method Content、方法库、方法资产、ProcessTemplate、AIPolicy、ViewProfile 等词,共同指向“方法资产定义源”。
- Step 2 可以说“真相仓”,但不能展开具体真相数据分类,否则会进入 Step 11。

诊断:

- 如果只写“方法库”,会过于像静态模板仓。
- 如果写成“提供 CRUD / seed / event”,会滑入功能和实现。
- 如果列出完整 MethodContent 子类,会抢占 Step 4、Step 7 和 Step 11。

取舍:

- 采用“方法资产定义、版本发布与分发语义的真相仓”作为一句话定义。
- 不在定义句中列出 RoleDefinition、TaskDefinition、WorkProductDefinition 等细项。

### 4.2 模块 2:非职责边界

问题回答:

- 本仓不执行流程,不管理成员身份,不做治理裁决,不注册外部能力,不处理 marketplace 交易,不做 UI 渲染。
- 这些排除项用于防止后续需求把相邻仓职责提前混入本仓。

诊断:

- AIPolicy 容易与 governance 的策略执行混淆。
- RoleDefinition 容易与 identity 的成员身份和能力画像混淆。
- ProcessTemplate 容易与 process 的运行时实例混淆。
- 资产分发格式容易与 marketplace 的上架、购买和交易体验混淆。

取舍:

- Step 2 只保留仓级排除句。
- 具体下游消费、事件、同步、查询和分发能力推迟到 Step 6、Step 9、Step 12。

### 4.3 模块 3:混淆对象

问题回答:

- 最容易混淆的相邻仓是 `L1-process`、`L1-identity`、`L1-governance`、`L3-capability-hub`、`L6-marketplace`。
- 最容易混淆的概念是“方法定义”和“运行时使用”。

诊断:

- `L1-process` 使用模板,但不应成为模板定义源。
- `L1-identity` 引用角色定义,但不应保存方法定义正文。
- `L1-governance` 执行或裁决策略,但不应替代方法库成为 AIPolicy 定义来源。
- `L3-capability-hub` 管理外部能力、MCP/A2A 和 provider,不等同于方法资产定义。
- `L6-marketplace` 管理生态交易或分发体验,不应拥有方法资产定义真相。

取舍:

- 边界对象列表只列对象,不展开混淆原因。
- 混淆原因写入说明文字,依赖关系留到 Step 6。

### 4.4 模块 4:单独成仓原因

问题回答:

- 方法资产需要被 process、identity、governance、member-images、console、marketplace 等下游稳定引用。
- 如果把定义并入任一消费仓,定义真相会被运行时实例、成员状态、治理执行或交易流程绑死。
- 本仓独立存在的核心理由是把“方法定义”从“运行时使用 / 成员状态 / 治理裁决 / 外部能力注册 / 交易体验”中分离出来。

诊断:

- 并入 process 会让模板定义和流程执行状态混在一起。
- 并入 identity 会让角色定义和成员身份生命周期混在一起。
- 并入 governance 会让策略定义和策略裁决结果混在一起。
- 并入 marketplace 会让资产定义被交易流程牵引。

取舍:

- 单独成仓原因只写定义源独立性。
- 不在 Step 2 展开发布流程、依赖方向、事件流或技术选型。

---

## 5. 旧材料差异审计

| 旧材料 | 审计结论 |
|---|---|
| `projects/L3-method-library/README.md` | 可保留“Method Content 存储与分发”“L3 方法能力层”和主要标准对齐方向;不能继承技术栈、目录结构、依赖清单、种子数据、RPC/infra 暗示。 |
| 旧 `00_req_step_02_position_boundary.md` | 旧文件方向大体可作为差异线索,但本轮必须重新收敛并更新台账 / flow 状态;不能直接当作完成状态。 |
| `projects/L3-method-library/00-需求文档.md` | 本 Step 不继承旧 P0、MethodContent 清单、下游同步或事件闭环;这些属于后续 Step。 |

| 旧口径 | 为什么不能在 Step 2 继承 | 后续处理 |
|---|---|---|
| Rust / PostgreSQL / 对象存储 | Step 2 不写技术栈和存储。 | 架构 / 配置 / 实施阶段再裁定。 |
| Marketplace 上架 / 下载 | Step 2 只做仓级边界;交易和生态分发体验需与 marketplace 边界另行讨论。 | Step 6 / Step 12 / Step 15 按需裁定。 |
| MethodContent 具体子类和初始种子数据 | Step 2 不写功能范围、数据归属或验收指标。 | Step 4 / Step 7 / Step 11 / Step 14 重审。 |
| role_definition.published 等事件说法 | Step 2 不写事件或接口。 | Step 12 后续按能力边界重审。 |

---

## 6. 结构化中间产物

### 6.1 边界声明表

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L3-method-library` 是 L3 方法能力层中负责方法资产定义、版本发布与分发语义的真相仓。 |
| 本仓不是什么 | 它不是流程执行仓,不是成员身份仓,不是治理裁决仓,不是外部能力注册仓,也不是 marketplace 交易或 UI 渲染仓。 |
| 边界对象列表 | 仓:`L1-process`;仓:`L1-identity`;仓:`L1-governance`;仓:`L3-capability-hub`;仓:`L6-marketplace`;概念:方法定义 / 运行时使用分离。 |
| 单独成仓原因 | 平台需要一个独立于运行时实例、成员状态、治理执行、外部能力注册和交易流程的方法资产定义源。 |

### 6.2 边界说明结论

`L3-method-library` 需要单独存在,因为平台的方法资产必须先作为可版本化、可发布、可分发的定义真相成立,再被相邻仓消费。它最容易与 `L1-process` 的执行实例、`L1-identity` 的成员身份、`L1-governance` 的治理裁决、`L3-capability-hub` 的外部能力注册以及 `L6-marketplace` 的交易分发混淆;这些边界如果不分开,后续需求会把“方法定义”误写成“运行时使用”或“交易体验”。

---

## 7. 回填草稿

### 2. 本仓定位与边界

> 校准来源:
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_02_position_boundary.md` 的“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解本章边界如何收敛。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L3-method-library` 是 L3 方法能力层中负责方法资产定义、版本发布与分发语义的真相仓。 |
| 本仓不是什么 | 它不是流程执行仓,不是成员身份仓,不是治理裁决仓,不是外部能力注册仓,也不是 marketplace 交易或 UI 渲染仓。 |
| 边界对象列表 | 仓:`L1-process`;仓:`L1-identity`;仓:`L1-governance`;仓:`L3-capability-hub`;仓:`L6-marketplace`;概念:方法定义 / 运行时使用分离。 |
| 单独成仓原因 | 平台需要一个独立于运行时实例、成员状态、治理执行、外部能力注册和交易流程的方法资产定义源。 |

`L3-method-library` 需要单独存在,因为平台的方法资产必须先作为可版本化、可发布、可分发的定义真相成立,再被相邻仓消费。它最容易与 `L1-process` 的执行实例、`L1-identity` 的成员身份、`L1-governance` 的治理裁决、`L3-capability-hub` 的外部能力注册以及 `L6-marketplace` 的交易分发混淆;这些边界如果不分开,后续需求会把“方法定义”误写成“运行时使用”或“交易体验”。

---

## 8. 自检与停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否能用 3~5 句话说清本仓定位 | 通过 | 边界声明表和短文字已覆盖定位、非职责、混淆对象和单独成仓原因。 |
| 是否明确本仓不是什么 | 通过 | 已排除流程执行、成员身份、治理裁决、外部能力注册、交易和 UI。 |
| 是否指出至少 2 个最易混淆边界 | 通过 | 已列 `process`、`identity`、`governance`、`capability-hub`、`marketplace` 和方法定义 / 运行时使用概念。 |
| 是否避免提前进入依赖和功能 | 通过 | 未写下游依赖矩阵、功能需求、事件、接口或发布流程。 |
| 是否避免实现细节 | 通过 | 未写技术栈、数据库、对象存储、目录、handler、repository、port 或 DTO。 |

### 8.1 待确认事项

| 编号 | 事项 | 当前状态 | 后续落点 |
|---|---|---|---|
| REQ-S2-OPEN-001 | AIPolicy 的定义源与 governance 执行 / 裁决边界如何表达。 | Step 2 只做仓级排除。 | Step 10 / Step 11 / Step 12 重审。 |
| REQ-S2-OPEN-002 | Marketplace 对方法资产包的上架、购买、分发体验是否进入当前 P0。 | Step 2 不裁定。 | Step 4 / Step 6 / Step 15 重审。 |

### 8.2 进入下一步条件

已满足进入 Step 3 的条件:

- 本仓定位与边界已收敛。
- 没有提前展开依赖、能力、功能、规则、数据或接口。
- 旧材料只作为差异审计输入,未直接继承完成状态。
