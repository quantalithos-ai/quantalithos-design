# L3-method-library 01 架构 Step 3: 职责边界

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 基于 2026-06-15 新版 `00-需求文档.md`、本轮 Step 1 需求基线和 Step 2 架构目标/约束重新推导职责边界;旧 Step 3 只作后置差异审计。
> 正式产物: `projects/L3-method-library/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 职责边界 |
| 输出文件 | `design-calibration/01_arch_step_03_responsibility_boundary.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 3;`架构设计书写规范.md` 4.4 |
| 已读取项目台账 | yes:`project_execution_ledger.md`;`01_architecture_calibration_flow.md` |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`00_req_step_02_position_boundary.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_15_risks_open_questions.md` |
| 当前模式 | full-restart |
| 本 Step 模块骨架 | done |
| 进入条件 | pass |
| next_allowed_action | Step 3 已完成,允许文档级 flow 进入 Step 4。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入正职责思考。 |
| 正职责:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入正职责写入。 |
| 正职责:再写入 | done | 本仓正式承担职责表 | pass | 进入非职责思考。 |
| 非职责:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入非职责写入。 |
| 非职责:再写入 | done | 本仓明确不做职责表 | pass | 进入易混淆职责思考。 |
| 易混淆职责:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入易混淆职责写入。 |
| 易混淆职责:再写入 | done | 易混淆职责表 | pass | 进入边界红线思考。 |
| 边界红线:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入边界红线写入。 |
| 边界红线:再写入 | done | 边界红线清单 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 允许进入 Step 4。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 3 要明确做什么、不做什么、易混淆职责和边界红线。 | 本 Step 只收职责归属,不重画系统上下文图,不展开子域、数据矩阵或接口协议。 |
| `standards/document/架构设计书写规范.md` | 4.4 固定职责边界表和边界红线清单,类型只允许“做 / 不做 / 易混淆职责”。 | 本 Step 表格必须使用三类类型,说明列只写职责归因或边界原因。 |
| `standards/document/设计文档讨论中间产物规范.md` | 当前 Step 必须先思考后写入,并保留恢复门禁。 | 本文件保留模块级状态,正式 01 暂不回填。 |
| `standards/document/设计文档编写通则.md` | 职责边界需要提前收束可追溯决策。 | 每条职责必须能回指需求基线、目标约束或边界规则。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 设计结论不得制造多真相源或隐式跨仓 ownership。 | 本 Step 必须防止将相邻仓运行职责写成本仓职责。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | Step 1 已确认 ARB-ML-001~012、AHC-ML-001~010、ARR-ML-001~010。 | 职责边界只能从这些基线、硬约束和风险口径推导。 |
| `01_arch_step_02_goals_constraints.md` | Step 2 已收敛七项架构目标、十项不可变约束、八项阶段取舍和九项非目标。 | 职责边界必须承接定义真相、Definition vs Use、版本稳定、受控消费、追溯和外围隔离。 |
| `00_req_step_02_position_boundary.md` | 本仓定位为方法资产定义、版本发布与分发语义真相仓,并排除流程执行、身份、治理裁决、能力注册、交易和 UI。 | 正职责与非职责必须围绕“定义源 vs 使用/执行方”区分。 |
| `00_req_step_10_business_rules_boundaries.md` | BR-ML-001~022 钉住定义真相、禁止串仓、显式变化、相邻仓边界、治理/审计约束。 | 职责表和红线必须覆盖 process、identity、governance、capability-hub、marketplace、UI、artifact 边界。 |
| `00_req_step_11_data_ownership.md` | 数据归属区分真相、快照、引用、禁止保存正文。 | 本 Step 只借用归属线索,不得展开数据所有权矩阵或字段。 |
| `00_req_step_15_risks_open_questions.md` | Qualification/CapabilityDefinition、MethodPlugin/Configuration、marketplace、AIPolicy override、ViewProfile 高级匹配、governance 强依赖、artifact 核心消费等仍挂起。 | 待确认项不得作为确定核心职责写入。 |

### 2.3 后置差异审计输入

| 文档 | 本 Step 用途 | 状态 |
|---|---|---|
| 旧 `01_arch_step_03_responsibility_boundary.md` | 审计旧做/不做/易混淆职责中哪些可从新版 00 和 Step 1/2 重新推导。 | read before rewrite |
| `projects/L3-method-library/01-架构设计.md` | 审计旧正式 01 中职责边界是否包含旧对象、技术、同步或验收口径。 | read |
| `domain/method-library/README.md` | 审计旧 MethodContent、Plugin、Configuration、RPC、事件和表结构是否反推职责。 | deferred |

---

## 3. 整体模块骨架

Step 3 只回答职责归属,不画系统上下文、不划分限界上下文、不定义容器、数据所有权矩阵、通信方式、接口协议或实现机制。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 正职责 | 本仓在方法资产定义源方面正式承担什么。 | 不写创建、发布、查询、同步、导出等功能动作。 | “做”职责表。 |
| 非职责 | 哪些相邻仓职责明确不属于本仓。 | 不替相邻仓设计自己的架构。 | “不做”职责表。 |
| 易混淆职责 | 哪些概念看起来相关但必须显式分层。 | 不写事件、DTO、repository、状态机或数据字段。 | “易混淆职责”表。 |
| 边界红线 | 哪些行为绝不能隐式发生。 | 不写校验代码、测试脚本或实现机制。 | 边界红线清单。 |
| 旧材料差异审计 | 旧职责方向哪些可保留,哪些必须废弃或挂起。 | 不继承旧 completed 状态或旧技术口径。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 4。 | 不提前通过系统上下文门禁。 | 自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 3 completed | pass | 做 / 不做 / 易混淆职责和边界红线已完成,旧材料差异审计和自检通过。 | 更新 flow 与项目台账,进入 Step 4 系统边界与上下文。 |

---

## 5. 模块思考记录

### 5.1 正职责:先思考

问题回答:

- 本仓正式承担的是方法资产定义源职责,不是方法资产 CRUD、发布流程、同步流程或旧对象清单。
- 正职责必须围绕 Step 2 的架构目标成立:定义真相、Definition vs Use、正式版本稳定、下游受控消费、变化追溯与一致性保护。
- 从 Step 11 数据归属看,本仓确实拥有方法资产定义、身份目录、正式化版本、关系语义、分发语义、追溯依据和证据线索等需求层真相。
- 从 Step 15 风险看,Qualification/CapabilityDefinition、MethodPlugin/Configuration、marketplace 等未闭口项不能写成当前核心职责。

诊断:

- “创建/发布/查询/导出/同步”是功能或交互动作,不能直接作为职责项。
- “RoleDefinition、ProcessTemplate、AIPolicy、ViewProfile”可以作为职责线索,但职责层应抽象成“方法资产定义真相承载”,避免在 Step 3 变成对象清单。
- 外部治理结论、标准来源、artifact 或 marketplace 语义只能以摘要或引用边界承接,不能被写成外部正文或相邻仓 truth 的拥有职责。
- 分发语义是本仓职责,但 marketplace 交易履约不是本仓职责;二者必须在正职责阶段就分开。

取舍:

- 正职责收敛为八项:定义真相、身份目录、正式版本、定义性关系、分发语义、变更追溯、受控消费支撑、外部摘要/引用边界。
- 不把外围增强写入核心职责;仅用“外部摘要或引用边界承接”保留可接入位置。
- 不写实现机制、状态、事件、协议、数据字段或技术栈。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成职责归属 | pass | 只表达本仓正式承担的结构性职责。 |
| 是否避免功能项 | pass | 未写创建、发布、查询、同步或导出。 |
| 是否保留待确认项 | pass | 未把 Qualification、MethodPlugin、marketplace 写成核心职责。 |
| 是否可进入“正职责:再写入” | pass | 可转成“做”职责表。 |

### 5.2 正职责:再写入

| 职责项 | 类型 | 说明 |
|---|---|---|
| 方法资产定义真相承载 | 做 | 这是本仓存在的核心职责,否则方法资产会散落到消费仓或文档约定。 |
| 方法资产身份与目录语义承载 | 做 | 没有稳定身份和目录语义,版本、消费和追溯都没有锚点。 |
| 方法资产正式化与版本语义承载 | 做 | 正式版本边界由本仓定义,否则下游正式引用无法稳定。 |
| 方法资产定义性关系承载 | 做 | 方法资产之间的定义性关联需要在定义源处保持一致。 |
| 方法资产分发语义承载 | 做 | 本仓可作为资产包或分发语义来源,但不承担 marketplace 交易。 |
| 方法资产变更与追溯依据承载 | 做 | 正式化、版本语义变化和影响消费的变化需要可追溯来源。 |
| 正式方法资产受控消费支撑 | 做 | 本仓为下游按边界消费提供结构前提,但不迁入下游运行真相。 |
| 外部依据摘要或引用边界承接 | 做 | governance、标准、artifact 或 marketplace 等外部语义只能以摘要或引用支撑本仓定义语境。 |

### 5.3 非职责:先思考

问题回答:

- 本仓明确不承担相邻仓的运行职责,包括流程执行、成员身份、治理执行、外部能力接入、marketplace 交易、UI 渲染、artifact 正文和认证鉴权。
- 这些事项不是“当前阶段先不做”的本仓能力,而是已经由需求边界和业务规则排除的外部职责。
- 非职责必须写成职责归属判断,不能替相邻仓设计它们自己的系统上下文、数据模型或接口。

诊断:

- 如果把 ProcessInstance、成员生命周期、Gate 执行、provider 注册或交易履约写入本仓职责,会直接打穿 Definition vs Use。
- 如果只写“暂不支持”,后续 Step 4/5/8/9 会把这些外部职责当作可延期的本仓子域或数据。
- artifact、archive、证据文件和外部文档正文尤其容易借 WorkProductDefinition 进入本仓,必须在职责层排除。

取舍:

- 非职责收敛为八项,覆盖 process、identity、governance、capability-hub、marketplace、UI、artifact 和 auth/security 边界。
- 不把 Qualification / CapabilityDefinition、MethodPlugin / MethodConfiguration 这类待确认或外围增强项写入非职责,它们已由 Step 2 的取舍处理。
- 不写相邻仓实现方式、交互方式、数据字段或状态机。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成明确排除职责 | pass | 每项都回答本仓不承担什么。 |
| 是否与阶段取舍区分 | pass | 没有把待确认本仓范围写成非职责。 |
| 是否避免替相邻仓设计 | pass | 未写相邻仓内部架构、接口或数据。 |
| 是否可进入“非职责:再写入” | pass | 可转成“不做”职责表。 |

### 5.4 非职责:再写入

| 职责项 | 类型 | 说明 |
|---|---|---|
| 流程执行和 ProcessInstance 状态 | 不做 | 该职责属于 `L1-process` / runtime,进入本仓会打穿 Definition vs Use。 |
| 成员身份、成员生命周期和成员实际角色状态 | 不做 | 该职责属于 `L1-identity` 或成员相关仓,本仓只定义方法语义。 |
| 治理裁决、Gate 执行和 policy enforce | 不做 | 该职责属于 `L1-governance`,本仓最多承接结论摘要或依据引用。 |
| 外部工具、MCP、A2A、provider 注册和访问裁决 | 不做 | 该职责属于 `L3-capability-hub` 及治理协作边界。 |
| marketplace 定价、订单、购买、结算、安装和履约 | 不做 | 交易与商业履约属于 `L6-marketplace`,本仓只可作为定义或分发语义来源。 |
| UI 渲染、会话、组件状态和交互执行 | 不做 | 体验执行属于 UI/console,本仓只定义可被消费的视图策略语义。 |
| artifact、证据文件、archive 或外部文档正文生命周期 | 不做 | 正文和制品生命周期属于相邻仓或外部系统,本仓不得保存正文真相。 |
| 认证登录、权限系统和操作主体鉴权实现 | 不做 | 这些属于身份、安全或治理边界,不属于方法资产定义职责。 |

### 5.5 易混淆职责:先思考

问题回答:

- 最容易混淆的不是完全无关事项,而是“定义语义”和“运行使用”同时出现的交界点。
- RoleDefinition、ProcessTemplate、AIPolicy、ViewProfile、WorkProductDefinition、MethodPlugin / MethodConfiguration、下游消费影响都与本仓相关,但它们的运行、执行、交易、渲染或正文生命周期不属于本仓。
- 易混淆职责需要说明分界,不需要在本 Step 给出接口、对象字段、事件或状态转换。

诊断:

- RoleDefinition 容易被误解为成员实际角色状态;后者属于 identity / 成员状态。
- ProcessTemplate 和 TaskDefinition 容易被误解为流程执行实例;后者属于 process/runtime。
- AIPolicy 容易被误解为 governance 执行;本仓只能定义方针语义,不能执行裁决。
- ViewProfile 容易被误解为 UI 渲染规则;本仓只能定义策略语义。
- WorkProductDefinition 容易被误解为 artifact 正文;本仓只定义产物语义。
- MethodPlugin / MethodConfiguration 容易被误解为 marketplace 交易包;本仓只保留资产包或方法集组织语义。

取舍:

- 易混淆职责收敛为七项,覆盖 role、template/task、AI policy、view profile、work product、plugin/configuration、消费影响。
- 不把这些事项拆成对象清单或子域清单,避免提前进入 Step 5。
- 不继承旧 README 的 RPC、事件、发布 Gate、fingerprint 或 marketplace 端到端流程。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否说明定义 / 使用分界 | pass | 每项都围绕定义源和运行使用分离。 |
| 是否避免对象字段和接口 | pass | 未写字段、RPC、event、repository 或 DTO。 |
| 是否覆盖主要串线点 | pass | role、process、governance、UI、artifact、marketplace、下游状态均覆盖。 |
| 是否可进入“易混淆职责:再写入” | pass | 可转成“易混淆职责”表。 |

### 5.6 易混淆职责:再写入

| 职责项 | 类型 | 说明 |
|---|---|---|
| RoleDefinition 与成员实际角色状态边界 | 易混淆职责 | 本仓可定义角色等方法语义,但成员是否具备某角色属于 identity / 成员状态。 |
| ProcessTemplate / TaskDefinition 与流程执行边界 | 易混淆职责 | 本仓可定义模板和任务语义,但执行实例、活动状态和编排属于 process/runtime。 |
| AIPolicy 定义与治理执行边界 | 易混淆职责 | 本仓可定义 AI 方针或目标语义,但裁决、enforce 和 Gate 执行属于 governance。 |
| ViewProfile 定义与 UI 渲染边界 | 易混淆职责 | 本仓可定义视图策略语义,但字段渲染、页面状态和交互执行属于体验层。 |
| WorkProductDefinition 与 artifact 正文边界 | 易混淆职责 | 本仓可定义 work product 语义,但 artifact、证据和 archive 正文生命周期不归本仓。 |
| MethodPlugin / MethodConfiguration 与 marketplace 交易边界 | 易混淆职责 | 本仓可保留资产包或方法集组织语义,但交易、安装和履约不归本仓。 |
| 下游消费影响摘要与下游运行状态边界 | 易混淆职责 | 本仓可保留一致性保护所需摘要候选,但不能拥有下游运行真相。 |

### 5.7 边界红线:先思考

问题回答:

- 边界红线应表达“绝不能隐式发生”的行为,用于保护后续上下文、数据、交互和依赖设计不串线。
- 红线必须覆盖真相源漂移、相邻运行职责回流、未正式化消费、隐式正式化、静默覆盖、源码级拥有和旧材料污染。
- 红线不是校验规则、接口错误码、事件协议或测试断言。

诊断:

- 若不写真相源漂移红线,下游仓可能在 Step 4/9 被画成第二定义源。
- 若不写隐式正式化和静默覆盖红线,正式版本稳定会在后续状态和交互设计中失去保护。
- 若不写旧材料污染红线,旧 README 的 RPC、事件、表结构、缓存和 marketplace 流程会继续反推架构。

取舍:

- 红线保留七条,覆盖职责边界最容易被突破的点。
- 不展开每条红线的落码机制。
- 不把未来 Step 的门禁写成具体测试脚本。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否表达不可隐式发生行为 | pass | 每条红线均为边界禁止项。 |
| 是否覆盖正式化和版本稳定 | pass | 未正式化消费、隐式正式化和静默覆盖均覆盖。 |
| 是否避免实现机制 | pass | 未写接口、事件、状态机、测试脚本或代码规则。 |
| 是否可进入“边界红线:再写入” | pass | 可转成边界红线清单。 |

### 5.8 边界红线:再写入

- 不得把方法资产定义真相迁移到 process、identity、runtime、member-images、governance、marketplace、UI 或 artifact。
- 不得把流程执行状态、成员状态、治理执行、外部能力注册、交易履约、UI 渲染或 artifact / archive 正文作为方法资产定义成立条件。
- 不得让未正式化或仍处于调整语境的方法资产成为正式消费依据。
- 不得通过读取、引用、同步或运行时使用隐式触发正式化。
- 不得用下游本地约定静默覆盖正式方法资产版本语义。
- 不得把运行期消费关系、事件协作关系或生态分发关系写成源码级拥有关系。
- 不得从旧 API、事件、fingerprint、snapshot、outbox、P95、目录结构或技术栈反推职责边界。

---

## 6. 旧材料差异审计

### 6.1 可保留方向

| 旧材料方向 | 审计结论 | 当前承接 |
|---|---|---|
| Method Content 存储与分发 | 可保留为职责方向 | 抽象为方法资产定义真相和分发语义职责,不继承旧存储实现。 |
| ProcessTemplate 源 | 可保留为定义职责 | 抽象为过程模板定义语义,不承接流程执行或运行状态。 |
| RoleDefinition / Role 到 image variant 语义 | 可保留为定义线索 | 抽象为角色等方法语义定义职责,不承接成员身份状态。 |
| AIPolicy 存储方向 | 可保留为定义线索 | 抽象为 AI 方针 / 目标定义职责,不承接治理裁决执行。 |
| ViewProfile 方向 | 可保留为定义线索 | 抽象为视图策略定义职责,不承接 UI 渲染执行。 |
| 版本管理和审计追溯 | 可保留为职责方向 | 抽象为正式版本语义与追溯依据职责,不继承 fingerprint、outbox 或 audit 字段。 |

### 6.2 必须废弃或挂起的旧口径

| 旧口径 | 处理方式 | 原因 |
|---|---|---|
| 旧 `01_arch_step_03_responsibility_boundary.md` 的 completed 状态 | 废弃 | 本轮 `01` 已全量重启,旧完成状态不能继承。 |
| 旧正式 `01-架构设计.md` 中 Step 4 之后的上下文、子域、容器、依赖、数据和交互结论 | 废弃 | 当前只完成 Step 3,后续章节必须按新 flow 重写。 |
| Rust、PostgreSQL、对象存储、Redis、目录结构和缓存策略 | 废弃 | 这些属于技术或实现组织,不是职责边界。 |
| RPC、Command、Query、Event、payload、outbox、fingerprint 或 snapshot 说法 | 废弃 | 职责边界层不定义接口、协议、事件、状态或数据字段。 |
| Qualification / CapabilityDefinition 作为已定核心职责 | 挂起 | 新版需求仍保持待确认;若纳入必须回写需求和架构链路。 |
| MethodPlugin / MethodConfiguration 作为核心前置 | 挂起 | 当前只作为外围增强或演进方向,不得改变核心职责红线。 |
| marketplace 上架、下载、购买或安装链路 | 废弃 | 交易和履约职责属于 `L6-marketplace`,本仓只保留分发语义或定义来源。 |
| Governance policy 发布 / Gate 执行链路 | 废弃 | 治理裁决和策略执行属于 `L1-governance`,本仓只保留方法方针定义和依据引用。 |
| Artifact 实例正文、证据文件正文或 archive 生命周期 | 废弃 | 本仓只保留 WorkProductDefinition 语义或引用边界,不拥有正文。 |

---

## 7. 自检与停审

### 7.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否列出本 Step 必读文档 | pass | 已列公共规范、本仓输入和后置差异审计输入。 |
| 是否先搭整体模块再逐模块推进 | pass | 已按正职责、非职责、易混淆职责、边界红线、旧材料审计、自检推进。 |
| 是否完成“先思考、再写入” | pass | 四个职责模块均包含思考记录和结构化写入。 |
| 是否形成职责边界表 | pass | 已按做 / 不做 / 易混淆职责输出。 |
| 是否形成边界红线清单 | pass | 已输出七条边界红线。 |
| 是否避免正式 01 正文写入 | pass | 未修改 `01-架构设计.md` 正式正文。 |
| 是否避免提前进入后续 Step | pass | 未画上下文图、未划分限界上下文、未定义容器、依赖、通信、技术选型或 ADR。 |
| 是否避免旧材料反推 | pass | 旧 01、旧 step 和旧 domain README 只作差异审计。 |
| 是否可进入 Step 4 | pass | 职责边界已足以支撑系统边界与上下文讨论。 |

### 7.2 下一步门禁

| 下一步 | gate_status | 进入条件 |
|---|---|---|
| Step 4 系统边界与上下文 | pass | 只能使用本 Step 的做 / 不做 / 易混淆职责和边界红线作为输入,不得从旧 Step 4 或旧正式 01 直接继承上下文图。 |
| 正式 `01-架构设计.md` 装配 | blocked | 必须等 Step 16 完成后统一装配。 |

---

## 8. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 3 completed | pass | 做 / 不做 / 易混淆职责、边界红线、旧材料差异审计和自检均完成。 | 更新 `01_architecture_calibration_flow.md` 与 `project_execution_ledger.md`,进入 Step 4。 |
