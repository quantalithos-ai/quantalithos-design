# L3-method-library 00 需求 Step 6: 使用方与依赖

> 状态: completed
> 创建日期: 2026-06-14
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 6 章“使用方与依赖”

---

## 0. Step 内计划

| 模块 | 状态 | 产物 | 完成门禁 |
|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | 已读取本 Step 必读输入。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | 已先建骨架。 |
| 全局依赖裁剪思考 | done | 当前仓相关边识别 | 未复制 27 仓总矩阵。 |
| 全局依赖裁剪写入 | done | 本仓依赖裁剪表 | 每条关系有类型和裁剪理由。 |
| 内部仓依赖思考 | done | 输入 / 输出能力关系 | 未写接口名、事件名或主链步骤。 |
| 内部仓依赖写入 | done | 内部仓依赖表 | 能力级描述、闭环前置和失效影响清楚。 |
| 外部系统依赖思考 | done | 是否存在正式外部依赖 | 不继承旧技术栈 / 存储假设。 |
| 外部系统依赖写入 | done | 外部依赖结论 | 当前阶段无正式外部系统依赖。 |
| 依赖类型分类思考 | done | compile/runtime/event 分类 | 运行期和事件协作不写成 package dependency。 |
| 依赖类型分类写入 | done | 类型分类表 / 禁止依赖表 / ASCII 图 | 符合全局裁剪规则固定格式。 |
| 旧材料差异审计 | done | 冲突 / 可保留事实 / 废弃项 | 旧材料未直接继承。 |
| 自检与停审 | done | 自检表 / 待确认事项 | 达到本 Step 门禁。 |

---

## 1. 必读文档

### 1.1 公共规范

| 文档 | 读取结论 |
|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | Step 6 必须输出仓际能力关系、闭环前置、失效后果、依赖裁剪表、依赖类型分类表、禁止依赖表和依赖裁剪图。 |
| `standards/document/需求文档书写规范.md` | 4.6 只写能力级协作关系,不得写角色说明、核心能力步骤、用户故事、功能、规则、数据归属、接口签名、DTO 或事件 schema。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可进入 package dependency;运行期依赖和事件协作依赖必须明确标注,不得写成 Cargo/path dependency。 |
| `projects/L3-method-library/design-calibration/00_req_step_02_position_boundary.md` | 本仓是方法资产定义、版本发布与分发语义真相仓,不拥有相邻仓运行真相。 |
| `projects/L3-method-library/design-calibration/00_req_step_04_goals_non_goals.md` | 本仓目标排除流程执行、成员状态、治理裁决、外部能力注册、交易、UI 执行、外部正文和认证鉴权。 |
| `projects/L3-method-library/design-calibration/00_req_step_05_users_roles.md` | Step 5 已把具体仓际关系排除出角色章节,本 Step 专门处理仓际协作。 |

### 1.2 本 Step 专用输入

| 文档 | 读取结论 |
|---|---|
| `architecture/仓库拆分方案.md` | `quantalithos-method-library` 是 SPEM Method Content 服务端载体,发布方法资产事件;仓间矩阵显示 L3 method-library 依赖 L0-core,并通过 L0-bus 事件协作。 |
| `architecture/标准对齐全景图.md` | process 执行 Template 但 Template 定义在 method-library;RoleDefinition、ViewProfile、AIPolicy 和 Role->image mapping 都形成跨仓消费语义。 |
| `architecture/开发路线图与优先级.md` | N3 方法能力层要求 method-library 先产出“怎么做”资产,并提示 process 与 method-library 依赖要提早对齐。 |
| `product/六域模型.md` | 身份域引用 RoleDefinition,过程域引用 ProcessTemplate/Method Content,治理域引用 AIPolicy,UI 层消费 ViewProfile;这些是能力级协作线索,不是接口 schema。 |
| `standards/子项目遵循规范清单.md` | ID2、PR1、MS5、ML1~ML6 提供 identity/process/member-images/method-library 的边界线索。 |

---

## 2. 整体模块骨架

Step 6 拆为五个模块:

| 模块 | 输出 | 不输出 |
|---|---|---|
| 全局依赖裁剪 | 从总依赖矩阵中裁剪本仓相关关系。 | 不复制 27 仓总表。 |
| 内部仓依赖 | 本仓依赖谁、向谁提供能力、是否闭环前置、失效影响。 | 不写接口、事件、DTO、主链步骤或数据归属。 |
| 外部系统依赖 | 当前是否存在正式外部系统前置。 | 不继承旧 PG / 对象存储 / RPC 假设。 |
| 依赖类型分类 | 编译期 / 运行期 / 事件协作分类和禁止依赖。 | 不把 runtime/event 写成 package dependency。 |
| 裁剪图 | 当前仓相关依赖子图。 | 不表达调用顺序、功能流程或事件传播时序。 |

---

## 3. 模块思考记录

### 3.1 全局依赖裁剪

问题回答:

- 总矩阵中 `L3-method-library` 的编译期依赖是 `L0-core`。
- 总矩阵中 `L3-method-library` 的事件协作依赖通过 `L0-bus` 发布方法资产事件。
- 多个仓运行期消费 method-library 的定义能力,其中 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 与当前目标最直接。
- `L0-sdk`、`L5-console`、`L6-marketplace`、`L4-observability` 等关系存在,但当前 Step 不应全部拉入核心主链。

诊断:

- 如果把 `process` 消费模板定义写成编译期依赖,会违反全局裁剪规则。
- 如果把 `marketplace` 的交易分发写入主链,会违反 Step 4 非目标。
- 如果把 `governance` 的 Gate 裁决作为本仓必然前置,会提前进入治理流程和接口协作,当前只能作为后续边界候选。

取舍:

- 当前主链只纳入能直接支撑“方法资产定义源成立并被关键下游消费”的关系。
- 治理、artifact、marketplace、console、observability 等关系保留为后续章节审计或外围/非主链关系,不在本 Step 写成核心前置。

### 3.2 内部仓依赖

问题回答:

- 输入依赖: `L0-core` 提供共享契约基线;`L0-bus` 提供事件协作通道。
- 输出能力: method-library 向 process 提供模板/方法定义来源,向 identity 提供角色定义来源,向 runtime 提供方法/角色/模板定义语义,向 member-images 提供 role/image mapping 来源。
- 部分输出关系是当前主链的候选前置,部分只是外围协作或后续阶段。

诊断:

- `L1-governance` 与 AIPolicy、Gate 决策有关,但本轮 Step 4 已把治理裁决列为非目标;因此本 Step 不把治理决策写成闭环前置。
- `L1-artifact` 与 WorkProductDefinition 有潜在消费关系,但全局矩阵没有 method-library -> artifact 的直接运行期边;先作为待确认关系。

取舍:

- 内部仓依赖表只列正式进入当前文档主链的内部关系。
- 待确认或外围关系进入裁剪表 / 待确认事项,不写成主链前置。

### 3.3 外部系统依赖

问题回答:

- 当前阶段没有需要纳入主链的正式外部系统依赖。
- 旧 README 中的 PostgreSQL、对象存储、Python 内容校验等属于实现或配置假设,不是需求层正式外部系统依赖。

诊断:

- 如果把存储、数据库、对象存储或外部工具写成本 Step 外部依赖,会把实现方案提前带入需求。

取舍:

- 明确写“当前阶段无正式外部系统依赖”。
- 外部内容包、分发格式或 marketplace 生态关系后续如需进入,必须先在 Step 7/12/15 收束。

### 3.4 依赖类型分类

问题回答:

- `L0-core` 是编译期依赖。
- `L0-bus` 是事件协作依赖,不是业务仓源码依赖。
- `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 对本仓是运行期消费关系。
- SDK、UI、marketplace、observability 的关系不应在当前主链中造成源码依赖。

诊断:

- 运行期消费很容易被误写成 `Cargo.toml` path dependency,需要在禁止依赖表明确排除。

取舍:

- 类型分类表只列进入当前文档主链的依赖。
- 禁止依赖表覆盖最容易误写的 runtime/event 关系。

---

## 4. 旧材料差异审计

### 4.1 已审计旧材料

| 旧材料 | 审计结论 |
|---|---|
| `projects/L3-method-library/README.md` | 可保留下游有 process、identity、member-service、governance、marketplace 等线索;不能继承 PG、对象存储、目录结构、RPC/infra 和完整依赖清单。 |
| `projects/L3-method-library/00-需求文档.md` §10 / §3 | 可保留“只定义、不执行”“下游建立本地索引”的边界方向;不能继承旧事件名、E2E 流程、P0 下游同步表或接口细节。 |
| `domain/method-library/README.md` §11 | 可保留 method-library 是 Template 内容源、identity 持有引用、governance 运行规则引用、UI 消费 ViewProfile、marketplace 是分发通道等边界线索;RPC、事件、表、时序和权限实现不进入本 Step。 |

### 4.2 不能继承的旧口径

| 旧口径 | 为什么不能在 Step 6 继承 | 后续处理 |
|---|---|---|
| `method_library.*.published` 事件清单 | Step 6 只写事件协作依赖类型,不写事件名或 schema。 | Step 12。 |
| `ResolveViewProfile`、`GetContent` 等 RPC | Step 6 不写接口名。 | Step 12。 |
| `process / identity / governance 开发者` 作为用户 | Step 5 已裁定这不是角色;Step 6 写仓际关系。 | 当前 Step 只写关联仓。 |
| `PostgreSQL + 对象存储` | 实现/配置假设,不是需求层正式外部系统依赖。 | 架构 / 配置阶段再裁定。 |
| `marketplace 上架 / 购买 / 订阅` | Step 4 已把 marketplace 交易流程列为非目标,当前不进主链。 | Step 12 / Step 15 后续审计。 |

---

## 5. 结构化中间产物

### 5.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、基础引用和跨仓一致性基线 | 是 | 本仓无法稳定表达可被下游长期引用的方法资产身份和公共契约。 |
| 输入 | `L0-bus` | 方法资产变化的事件协作通道 | 是 | 下游只能依赖运行期查询或手工同步,方法资产变化难以形成平台级协作信号。 |
| 输出 | `L1-process` | 过程模板、任务和方法定义来源 | 是 | process 容易把 Template 定义写成本地真相,Definition vs Use 分离失效。 |
| 输出 | `L1-identity` | 角色定义等身份语义来源 | 是 | identity 容易重复保存角色定义正文或自行 hardcode 角色语义。 |
| 输出 | `L2-runtime` | 运行时需要消费的方法、角色和过程模板语义 | 是 | runtime 的执行语境缺少统一方法资产来源,容易退化为运行时本地约定。 |
| 输出 | `L2-member-images` | Role 到 image variant 的定义来源 | 是 | member image 构建会 hardcode 角色镜像映射,破坏方法资产定义源边界。 |

### 5.2 外部系统依赖表

当前阶段,`L3-method-library` 无需要纳入需求主链的正式外部系统依赖。旧材料中出现的数据库、对象存储、内容校验脚本、外部 package 存储或 marketplace 交易系统,当前均不得作为 Step 6 的正式外部系统前置;若后续需要,必须在对应能力、接口或配置 Step 中重新收束。

### 5.3 本仓依赖裁剪表

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
| `L1-governance` | 产品/架构材料显示治理可引用 AIPolicy 或参与发布裁决,但总矩阵未给出本仓对 governance 的直接运行期依赖 | 协作方 | 运行期 / 事件协作候选 | 否 | Gate 决策和策略执行已排为非目标;AIPolicy 定义消费边界需在后续 Step 7/10/12 再裁定。 |
| `L1-artifact` | 产品/旧材料显示 WorkProductDefinition 可能影响 artifact 语义,但总矩阵未给出直接 method-library 运行期边 | 协作方候选 | 运行期候选 | 否 | Artifact 正文和生命周期不归本仓;WorkProductDefinition 是否进入当前消费主链后续再裁定。 |
| `L3-capability-hub` | 总矩阵中 method-library 与 capability-hub 同属 L3,但职责分别是方法资产与外部能力注册 | 相邻仓 | 无直接依赖 | 否 | 方法资产和外部能力注册不能合并,当前不建立直接依赖。 |

### 5.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享契约、基础引用和跨仓一致性基线。 | 01/03/07 后续设计与实施计划。 |
| 事件协作依赖 | `L0-bus` | 通过事件协作通道发布方法资产变化信号。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L1-process` | 向 process 提供过程模板、任务和方法定义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L1-identity` | 向 identity 提供角色定义等身份语义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L2-runtime` | 向 runtime 提供方法、角色和过程模板语义。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L2-member-images` | 向 member-images 提供 Role -> image variant 定义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |

### 5.5 本仓禁止依赖表

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

### 5.6 依赖裁剪图

#### 依赖裁剪图: L3-method-library

```text
+----------------------+
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
     |      |     +--------------------+
     |      |                          |
     |      | [runtime]                | [runtime]
     |      v                          v
     |   L1-process              L1-identity
     |
     | [runtime]
     v
  L2-runtime
     |
     | [runtime]
     v
  L2-member-images

L3-method-library
     |
     | [event]
     v
  L0-bus
```

图示说明:

- 本图只展示 `L3-method-library` 当前需求主链相关依赖边,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可以进入 package dependency。
- `[runtime]` 和 `[event]` 不得写成 package dependency。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件传播顺序。

### 5.7 本章结论

当前阶段,`L3-method-library` 的主依赖集中在 `L0-core` 的共享契约、`L0-bus` 的事件协作通道,以及 process、identity、runtime、member-images 对方法资产定义语义的运行期消费。marketplace、console、observability、governance、artifact 等关系仍然重要,但在本 Step 只作为外围或待确认协作关系记录,不得提前写成本仓核心闭环前置或源码依赖。

---

## 6. 回填草稿

### 6. 使用方与依赖

> 校准来源:
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_06_consumers_dependencies.md` 的“结构化中间产物”“旧材料差异审计”和“回填草稿”小节,了解本章依赖如何从全局基线裁剪。

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

当前阶段,`L3-method-library` 无需要纳入需求主链的正式外部系统依赖。旧材料中出现的数据库、对象存储、内容校验脚本、外部 package 存储或 marketplace 交易系统,当前均不得作为本章的正式外部系统前置;若后续需要,必须在对应能力、接口或配置 Step 中重新收束。

#### 6.3 本仓依赖裁剪表

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
| `L1-governance` | 产品/架构材料显示治理可引用 AIPolicy 或参与发布裁决,但总矩阵未给出本仓对 governance 的直接运行期依赖 | 协作方 | 运行期 / 事件协作候选 | 否 | Gate 决策和策略执行已排为非目标;AIPolicy 定义消费边界需在后续 Step 7/10/12 再裁定。 |
| `L1-artifact` | 产品/旧材料显示 WorkProductDefinition 可能影响 artifact 语义,但总矩阵未给出直接 method-library 运行期边 | 协作方候选 | 运行期候选 | 否 | Artifact 正文和生命周期不归本仓;WorkProductDefinition 是否进入当前消费主链后续再裁定。 |
| `L3-capability-hub` | 总矩阵中 method-library 与 capability-hub 同属 L3,但职责分别是方法资产与外部能力注册 | 相邻仓 | 无直接依赖 | 否 | 方法资产和外部能力注册不能合并,当前不建立直接依赖。 |

#### 6.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享契约、基础引用和跨仓一致性基线。 | 01/03/07 后续设计与实施计划。 |
| 事件协作依赖 | `L0-bus` | 通过事件协作通道发布方法资产变化信号。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L1-process` | 向 process 提供过程模板、任务和方法定义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L1-identity` | 向 identity 提供角色定义等身份语义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L2-runtime` | 向 runtime 提供方法、角色和过程模板语义。 | 01/03/05/07 后续设计、测试和实施计划。 |
| 运行期依赖 | `L2-member-images` | 向 member-images 提供 Role -> image variant 定义来源。 | 01/03/05/07 后续设计、测试和实施计划。 |

#### 6.5 本仓禁止依赖表

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

#### 6.6 依赖裁剪图: L3-method-library

```text
+----------------------+
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
     |      |     +--------------------+
     |      |                          |
     |      | [runtime]                | [runtime]
     |      v                          v
     |   L1-process              L1-identity
     |
     | [runtime]
     v
  L2-runtime
     |
     | [runtime]
     v
  L2-member-images

L3-method-library
     |
     | [event]
     v
  L0-bus
```

图示说明:

- 本图只展示 `L3-method-library` 当前需求主链相关依赖边,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可以进入 package dependency。
- `[runtime]` 和 `[event]` 不得写成 package dependency。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件传播顺序。

---

## 7. 自检与停审

### 7.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否裁剪总依赖矩阵 | 通过 | 只裁剪本仓相关关系,未复制全 27 仓总表。 |
| 是否明确输入依赖和输出能力 | 通过 | 已列 `L0-core`、`L0-bus` 输入及 process/identity/runtime/member-images 输出。 |
| 是否区分依赖类型 | 通过 | 已分为编译期、运行期、事件协作。 |
| 是否避免 runtime/event 写成 package dependency | 通过 | 禁止依赖表明确排除源码级依赖误写。 |
| 是否说明外部系统依赖 | 通过 | 当前阶段无正式外部系统依赖。 |
| 是否避免角色、主链步骤、接口和数据归属 | 通过 | 未写角色说明、用户故事、接口名、事件名、DTO、数据项或实现组织。 |
| 是否可进入 Step 7 | 通过 | 使用方与依赖已能支撑核心能力闭环讨论。 |

### 7.2 待确认事项

| 编号 | 事项 | 当前状态 | 后续落点 |
|---|---|---|---|
| REQ-S6-OPEN-001 | `L1-governance` 对 AIPolicy 定义消费和发布裁决是否进入当前核心主链。 | 当前不进入主链,只保留为后续候选。 | Step 7 / Step 10 / Step 12 / Step 15。 |
| REQ-S6-OPEN-002 | `L1-artifact` 是否正式消费 WorkProductDefinition。 | 当前不进入主链,因全局矩阵未给直接边。 | Step 7 / Step 11 / Step 12 / Step 15。 |
| REQ-S6-OPEN-003 | `L0-sdk` 和 `L5-console` 是否作为当前管理体验前置。 | 当前不进入主链。 | Step 8 / Step 12 / Step 14 / Step 15。 |
| REQ-S6-OPEN-004 | marketplace 资产来源边界是否进入当前阶段外围增强。 | 当前不进入主链,交易为非目标。 | Step 7 / Step 12 / Step 15。 |

### 7.3 进入下一步条件

已满足进入 Step 7 的条件:

- 本仓输入依赖、输出能力和闭环前置关系已明确。
- 每条进入主链的关系已标注依赖类型。
- 运行期和事件协作关系未被误写成编译期源码依赖。
- Step 6 未把角色、接口细节、事件名、核心能力步骤或数据归属混入依赖章节。
