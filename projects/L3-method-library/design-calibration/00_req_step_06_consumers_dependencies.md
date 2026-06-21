# L3-method-library 00 需求 Step 6: 使用方与依赖

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 6 章“使用方与依赖”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 使用方与依赖 |
| 输出文件 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md`;`需求文档书写规范.md` §4.6 |
| 已读取前序输入 | yes:`00_req_step_02_position_boundary.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md` |
| 已读取项目输入 | yes:`architecture/仓库拆分方案.md`;`architecture/标准对齐全景图.md`;`architecture/开发路线图与优先级.md`;`product/六域模型.md`;`standards/子项目遵循规范清单.md`;旧 `00_req_step_06_consumers_dependencies.md` |
| 当前模式 | full-restart |
| 进入条件 | pass |
| next_allowed_action | Step 6 已完成,允许文档级 flow 进入 Step 7。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | pass | 进入全局依赖裁剪思考。 |
| 模块 1 全局依赖裁剪:先思考 | done | 当前仓相关边识别 | pass | 进入模块 1 写入。 |
| 模块 1 全局依赖裁剪:再写入 | done | 本仓依赖裁剪表 | pass | 进入模块 2 思考。 |
| 模块 2 内部仓依赖:先思考 | done | 输入 / 输出能力关系 | pass | 进入模块 2 写入。 |
| 模块 2 内部仓依赖:再写入 | done | 内部仓依赖表 | pass | 进入模块 3 思考。 |
| 模块 3 外部系统依赖:先思考 | done | 是否存在正式外部依赖 | pass | 进入模块 3 写入。 |
| 模块 3 外部系统依赖:再写入 | done | 外部依赖结论 | pass | 进入模块 4 思考。 |
| 模块 4 依赖类型分类:先思考 | done | compile/runtime/event 分类 | pass | 进入模块 4 写入。 |
| 模块 4 依赖类型分类:再写入 | done | 类型分类表 / 禁止依赖表 / ASCII 图 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 冲突 / 可保留事实 / 废弃项 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 6 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 待确认事项 | pass | 允许进入 Step 7。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 6 的影响 |
|---|---|---|
| `需求文档书写规范.md` §4.6 | 本章必须输出内部仓依赖、外部系统依赖、依赖裁剪表、类型分类表、禁止依赖表和必要的裁剪图;不得写接口名、DTO、事件 schema。 | 所有关系只写能力级协作。 |
| `全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可进入 package dependency;运行期依赖和事件协作依赖必须明确标注。 | 必须避免把 process / identity / runtime 等消费关系写成源码依赖。 |
| `00_req_step_04_goals_non_goals.md` | 本仓排除流程执行、成员状态、治理裁决、外部能力注册、交易和 UI 执行。 | marketplace / governance / UI 等关系不能被误写成当前核心闭环前置。 |
| `00_req_step_05_users_roles.md` | Step 5 已把下游消费抽象成系统角色。 | 本 Step 再具体到仓际依赖,但不写人类角色。 |
| `architecture/仓库拆分方案.md` / `全局依赖矩阵` | `L3-method-library` 编译期依赖 `L0-core`,通过 `L0-bus` 进行事件协作,按需对外提供 method / role / process template 定义。 | 作为依赖裁剪的基线。 |
| `product/六域模型.md` / `标准对齐全景图.md` | process、identity、runtime、member-images、UI、governance、marketplace 等会消费不同方法资产语义。 | 需要区分核心主链、外围增强和待确认关系。 |

---

## 3. 整体模块骨架

| 模块 | 要回答的问题 | 输出 | 不输出 |
|---|---|---|---|
| 模块 1:全局依赖裁剪 | 从总依赖矩阵中裁剪哪些本仓相关关系? | 本仓依赖裁剪表。 | 不复制 27 仓总表。 |
| 模块 2:内部仓依赖 | 本仓依赖谁、向谁提供能力、是否闭环前置、失效影响是什么? | 内部仓依赖表。 | 不写接口、事件、DTO、主链步骤或数据归属。 |
| 模块 3:外部系统依赖 | 当前是否存在正式外部系统前置? | 外部依赖结论。 | 不继承旧 PG / 对象存储 / RPC 假设。 |
| 模块 4:依赖类型分类 | 关系分别是编译期、运行期还是事件协作?哪些禁止依赖必须写清? | 类型分类表、禁止依赖表、裁剪图。 | 不把 runtime/event 写成 package dependency。 |

---

## 4. 模块思考记录

### 4.1 模块 1:全局依赖裁剪

问题回答:

- 总矩阵中本仓的直接编译期依赖是 `L0-core`。
- 本仓通过 `L0-bus` 做事件协作,但事件名和 payload 留到后续接口与设计阶段。
- 关键下游消费关系包括 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`。
- `L0-sdk`、`L5-console`、`L6-marketplace`、`L4-observability`、`L1-governance` 等关系存在,但不能都写成当前核心主链前置。

诊断:

- 把 process 消费模板定义写成源码依赖会违反全局依赖规则。
- 把 marketplace 交易写成主链会违反 Step 4 非目标。
- 把 governance Gate 裁决写成必然前置会提前进入治理流程和接口方案。

取舍:

- 当前主链纳入 `L0-core`、`L0-bus` 和四个关键下游消费方。
- governance、marketplace、console、observability、artifact 等进入待确认或外围关系,不作为本 Step 核心前置。

### 4.2 模块 2:内部仓依赖

问题回答:

- 输入依赖为 `L0-core` 与 `L0-bus`。
- 输出能力为向 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 提供方法资产定义语义。
- 这些输出能力是 Definition vs Use 分离能否成立的关键。

诊断:

- `L1-governance` 与 AIPolicy 和发布裁决有关,但裁决执行不是本仓目标。
- `L1-artifact` 与 WorkProductDefinition 可能相关,但当前全局矩阵没有明确主链边,先作为待确认。

取舍:

- 内部仓依赖表只列当前主链依赖。
- 待确认关系进入裁剪表和待确认事项。

### 4.3 模块 3:外部系统依赖

问题回答:

- 当前阶段没有需要纳入主链的正式外部系统依赖。
- 旧 README 中的 PostgreSQL、对象存储、内容校验脚本属于实现或配置假设。

诊断:

- 如果把数据库或对象存储写成外部系统依赖,会把实现方案提前带入需求。

取舍:

- 明确写当前阶段无正式外部系统依赖。
- 外部 package 存储、生态分发和 marketplace 交易如需进入,后续 Step 再裁定。

### 4.4 模块 4:依赖类型分类

问题回答:

- `L0-core` 是编译期依赖。
- `L0-bus` 是事件协作依赖。
- `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 是运行期消费关系。

诊断:

- 运行期消费最容易被误写为 Cargo path dependency,必须在禁止依赖表中明确排除。

取舍:

- 类型分类表只列当前主链关系。
- 禁止依赖表覆盖最容易串线的 runtime/event 关系。

---

## 5. 旧材料差异审计

| 旧材料 | 审计结论 |
|---|---|
| 旧 `00_req_step_06_consumers_dependencies.md` | 旧依赖裁剪方向可审计,但旧完成状态不继承;本轮重新按当前全局依赖规则写表。 |
| `projects/L3-method-library/README.md` | 可保留下游 process、identity、member-service/governance/marketplace 等线索;不能继承 PG、对象存储、目录结构、RPC/infra 和完整依赖清单。 |
| `domain/method-library/README.md` §11 | 可保留 Template 内容源、RoleDefinition 内容源、AIPolicy 定义源、ViewProfile 消费、marketplace 分发通道等边界线索;RPC、事件、表、时序和权限实现不进入本 Step。 |

| 旧口径 | 为什么不能在 Step 6 继承 | 后续处理 |
|---|---|---|
| method_library.* 事件清单 | Step 6 只写事件协作依赖类型,不写事件名或 schema。 | Step 12。 |
| ResolveViewProfile / GetContent 等 RPC | Step 6 不写接口名。 | Step 12。 |
| PostgreSQL + 对象存储 | 实现 / 配置假设,不是需求层正式外部系统依赖。 | 架构 / 配置阶段。 |
| marketplace 上架 / 购买 / 订阅 | Step 4 已把 marketplace 交易流程列为非目标。 | Step 12 / Step 15。 |

---

## 6. 结构化中间产物

### 6.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、基础引用和跨仓一致性基线 | 是 | 本仓无法稳定表达可被下游长期引用的方法资产身份和公共契约。 |
| 输入 | `L0-bus` | 方法资产变化的事件协作通道 | 是 | 下游只能依赖运行期查询或手工同步,方法资产变化难以形成平台级协作信号。 |
| 输出 | `L1-process` | 过程模板、任务和方法定义来源 | 是 | process 容易把 Template 定义写成本地真相,Definition vs Use 分离失效。 |
| 输出 | `L1-identity` | 角色定义等身份语义来源 | 是 | identity 容易重复保存角色定义正文或自行 hardcode 角色语义。 |
| 输出 | `L2-runtime` | 运行时需要消费的方法、角色和过程模板语义 | 是 | runtime 的执行语境缺少统一方法资产来源,容易退化为运行时本地约定。 |
| 输出 | `L2-member-images` | Role 到 image variant 的定义来源 | 是 | member image 构建会 hardcode 角色镜像映射,破坏方法资产定义源边界。 |

### 6.2 外部系统依赖表

当前阶段,`L3-method-library` 无需要纳入需求主链的正式外部系统依赖。旧材料中出现的数据库、对象存储、内容校验脚本、外部 package 存储或 marketplace 交易系统,当前均不得作为 Step 6 的正式外部系统前置;若后续需要,必须在对应能力、接口或配置 Step 中重新收束。

### 6.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L3-method-library` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 本仓需要共享契约和基础引用作为跨仓方法资产身份基线。 |
| `L0-bus` | `L3-method-library` 通过 `L0-bus` 发布方法资产事件 | 协作方 | 事件协作 | 是 | 方法资产变化需要成为平台级协作信号,但不形成业务仓源码依赖。 |
| `L1-process` | `L1-process` 运行期消费 `L3-method-library` 的模板 / 方法定义 | 被依赖方 | 运行期 | 是 | process 执行 Template,Template 定义归本仓,该边界是 Definition vs Use 分离的核心。 |
| `L1-identity` | `L1-identity` 按需消费 method 能力边界 | 被依赖方 | 运行期 | 是 | identity 只应持有角色定义引用或快照,不应拥有方法资产定义正文。 |
| `L2-runtime` | `L2-runtime` 运行期消费 `L3-method-library` 能力 | 被依赖方 | 运行期 | 是 | runtime 需要方法、角色和模板语义形成执行上下文,但不拥有定义真相。 |
| `L2-member-images` | `L2-member-images` 运行期消费 `L3-method-library` role/image mapping | 被依赖方 | 运行期 | 是 | Role -> image variant 来源归本仓,避免镜像仓 hardcode 角色映射。 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1/L2/L3/L4 API | 被依赖方 | 运行期 | 否 | SDK 暴露方式属于后续接口/产品接入问题,不阻塞当前方法资产定义主链。 |
| `L5-console` | `L5-console` 经 SDK 消费 L1/L2/L3/L4 管理 API | 被依赖方 | 运行期 | 否 | 管理界面是体验入口,不属于本仓定义真相成立的前置。 |
| `L6-marketplace` | `L6-marketplace` 运行期消费 method / tool / role 发布审核能力并按需发布生态资产事件 | 协作方 | 运行期 / 事件协作 | 否 | marketplace 交易和生态分发已在 Step 4 排为非目标;后续仅按资产来源边界审计。 |
| `L4-observability` | `L4-observability` 通过 `L0-bus` 消费 tap / audit material | 协作方 | 事件协作 | 否 | 观测和审计材料重要,但当前 Step 不把横切观测写成方法资产定义主链。 |
| `L1-governance` | AIPolicy 或发布正式化可能涉及 governance,但总矩阵未给出本仓对 governance 的直接运行期前置 | 协作方候选 | 运行期 / 事件协作候选 | 否 | Gate 决策和策略执行已排为非目标;AIPolicy 定义消费边界需在后续 Step 再裁定。 |
| `L1-artifact` | WorkProductDefinition 可能影响 artifact 语义,但总矩阵未给出直接 method-library 运行期边 | 协作方候选 | 运行期候选 | 否 | Artifact 正文和生命周期不归本仓;WorkProductDefinition 是否进入当前消费主链后续再裁定。 |
| `L3-capability-hub` | 同属 L3,但职责分别是方法资产与外部能力注册 | 相邻仓 | 无直接依赖 | 否 | 方法资产和外部能力注册不能合并,当前不建立直接依赖。 |

### 6.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享契约、基础引用和跨仓一致性基线。 | 01/03/07 后续设计与实施计划。 |
| 事件协作依赖 | `L0-bus` | 通过事件协作通道发布方法资产变化信号。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L1-process` | 向 process 提供过程模板、任务和方法定义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L1-identity` | 向 identity 提供角色定义等身份语义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L2-runtime` | 向 runtime 提供方法、角色和过程模板语义。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L2-member-images` | 向 member-images 提供 Role -> image variant 定义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |

### 6.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-process -> L3-method-library` 源码级依赖 | process 运行期消费模板定义,不能因为消费关系直接依赖本仓源码。 | 运行期能力边界 / SDK / 正式查询或快照边界。 |
| `L1-identity -> L3-method-library` 源码级依赖 | identity 只引用或消费角色定义语义,不得把方法资产定义正文并入身份仓。 | 运行期能力边界 / 快照 / 引用。 |
| `L2-member-images -> L3-method-library` 源码级依赖 | member-images 消费 role/image mapping,不应 hardcode 或链接本仓业务实现。 | 运行期能力边界 / 构建输入快照。 |
| `L3-method-library -> L1-process` 反向定义依赖 | 本仓定义模板,不能依赖 process 的运行时实例或执行索引来成立定义真相。 | 只保留运行期消费方向,执行状态归 process。 |
| `L3-method-library -> L1-identity` 反向成员状态依赖 | 本仓不拥有成员生命周期或成员具备哪些角色的状态。 | 只引用必要的公共主体/审批语义,成员状态归 identity。 |
| `L3-method-library -> L1-governance` 策略执行依赖 | 本仓不执行治理裁决或 policy enforce。 | 治理结论通过正式治理边界/事件协作进入,具体规则后续裁定。 |
| `L3-method-library -> L6-marketplace` 交易依赖 | marketplace 交易、订单、结算不是本仓目标。 | marketplace 通过正式资产来源/分发边界消费,交易留在 marketplace。 |
| `L3-method-library -> L4-observability` 直接真相写入 | observability 是横切观测,不能成为方法资产真相存储。 | 通过 `L0-bus` / audit material / telemetry 边界协作。 |

### 6.6 依赖裁剪图

#### 依赖裁剪图: L3-method-library

```text
----------------------+
| L0-core             |
+----------+-----------+
           |
           | [compile]
           v
+----------------------+
| L3-method-library    |
| method asset source  |
+----+------+-----+----+
     |      |     |
     |      |     | [runtime]
     |      |     v
     |      |  L2-member-images
     |      |
     |      | [runtime]
     |      v
     |   L2-runtime
     |
     | [runtime]
     +-----------------> L1-process
     |
     | [runtime]
     +-----------------> L1-identity

L3-method-library
     |
     | [event]
     v
L0-bus
```

图示说明:

- 本图只展示 `L3-method-library` 当前 00 需求主链相关依赖边。
- `[compile]` 可进入 package dependency;`[runtime]` 和 `[event]` 不得写成 package dependency。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、事件传播时序或实现流程。
- `governance`、`marketplace`、`console`、`observability` 等关系暂不进入当前主链,后续按能力与接口边界审计。

---

## 7. 回填草稿

### 6. 使用方与依赖

> 校准来源:
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_06_consumers_dependencies.md` 的“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解本章依赖裁剪如何收敛。

#### 6.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、基础引用和跨仓一致性基线 | 是 | 本仓无法稳定表达可被下游长期引用的方法资产身份和公共契约。 |
| 输入 | `L0-bus` | 方法资产变化的事件协作通道 | 是 | 下游只能依赖运行期查询或手工同步,方法资产变化难以形成平台级协作信号。 |
| 输出 | `L1-process` | 过程模板、任务和方法定义来源 | 是 | process 容易把 Template 定义写成本地真相,Definition vs Use 分离失效。 |
| 输出 | `L1-identity` | 角色定义等身份语义来源 | 是 | identity 容易重复保存角色定义正文或自行 hardcode 角色语义。 |
| 输出 | `L2-runtime` | 运行时需要消费的方法、角色和过程模板语义 | 是 | runtime 的执行语境缺少统一方法资产来源,容易退化为运行时本地约定。 |
| 输出 | `L2-member-images` | Role 到 image variant 的定义来源 | 是 | member image 构建会 hardcode 角色镜像映射,破坏方法资产定义源边界。 |

#### 6.2 外部系统依赖

当前阶段,`L3-method-library` 无需要纳入需求主链的正式外部系统依赖。旧材料中出现的数据库、对象存储、内容校验脚本、外部 package 存储或 marketplace 交易系统,当前均不得作为 Step 6 的正式外部系统前置;若后续需要,必须在对应能力、接口或配置 Step 中重新收束。

---

## 8. 自检与停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确本仓向谁提供能力、依赖谁 | 通过 | 已列 `L0-core`、`L0-bus` 和四个关键下游消费关系。 |
| 是否区分内部仓依赖与外部系统依赖 | 通过 | 内部仓有表,外部系统明确为当前无正式主链依赖。 |
| 是否指出闭环前置和失效影响 | 通过 | 内部仓依赖表每条均有前置判断和失效影响。 |
| 是否区分依赖类型 | 通过 | 已按编译期、运行期、事件协作分类。 |
| 是否避免接口 / 事件细节 | 通过 | 未写接口签名、DTO、事件 schema 或具体事件名。 |
| 是否避免角色 / 主链步骤混写 | 通过 | 未写人类角色或能力闭环步骤。 |

### 8.1 待确认事项

| 编号 | 事项 | 当前状态 | 后续落点 |
|---|---|---|---|
| REQ-S6-OPEN-001 | `L1-governance` 是否作为方法资产正式化的条件型前置。 | 当前不写成核心前置。 | Step 7 / Step 10 / Step 12 / Step 15。 |
| REQ-S6-OPEN-002 | `L6-marketplace` 是否进入外围增强能力或后续阶段。 | 当前不写成主链前置。 | Step 7 / Step 12 / Step 15。 |
| REQ-S6-OPEN-003 | `L1-artifact` 是否需要消费 WorkProductDefinition 或方法资产关系语义。 | 当前作为候选关系。 | Step 7 / Step 11 / Step 12。 |

### 8.2 进入下一步条件

已满足进入 Step 7 的条件:

- 已明确本仓向哪些内部仓提供能力、依赖哪些内部仓前置能力。
- 已区分编译期、运行期和事件协作。
- 已说明当前无正式外部系统依赖。
- 未把角色说明、主链步骤、接口细节或数据归属混写进本章。
