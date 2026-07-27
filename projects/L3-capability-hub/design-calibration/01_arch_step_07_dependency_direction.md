# L3-capability-hub 01 架构 Step 7: 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、本轮 Step 5 内部语义结构、Step 6 运行承载视角和全局依赖裁剪规则重新推导依赖方向;旧 `01-架构设计.md` §7 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 7 依赖方向与层间约束 |
| 输出文件 | `design-calibration/01_arch_step_07_dependency_direction.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 7;`架构设计书写规范.md` §4.8 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_06_consumers_dependencies.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §7 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 7;`L3-method-library` Step 7;`L0-sdk` Step 7 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 6 进入 Step 7 |
| next_allowed_action | Step 7 已完成,等待用户确认后进入 Step 8。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入内部依赖角色思考。 |
| 内部依赖角色:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入内部依赖角色写入。 |
| 内部依赖角色:再写入 | done | 依赖方向图 / 层间约束表 | pass | 进入跨仓依赖裁剪思考。 |
| 跨仓依赖裁剪:先思考 | done | 本仓相关边识别 / 类型判断 | pass | 进入跨仓依赖裁剪写入。 |
| 跨仓依赖裁剪:再写入 | done | 裁剪表 / 分类表 / 禁止依赖表 / ASCII 图 | pass | 进入依赖倒置边界思考。 |
| 依赖倒置边界:先思考 | done | 外部能力正式边界接入口径 | pass | 进入依赖倒置边界写入。 |
| 依赖倒置边界:再写入 | done | 依赖倒置结论 | pass | 进入架构单元依赖规则思考。 |
| 架构单元依赖规则:先思考 | done | 按 Step 5 单元逐个判断依赖规则 | pass | 进入架构单元依赖规则写入。 |
| 架构单元依赖规则:再写入 | done | 架构单元依赖规则表 / 停审记录 | pass | 进入跨依赖边界审计。 |
| 跨依赖边界审计 | done | 反向依赖 / 类型误判 / 实现名词污染审计 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 8。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 7 必须输出层次划分、依赖方向、层间约束、依赖倒置、按架构单元组织的依赖规则、本仓依赖裁剪表、类型分类表、禁止依赖表、依赖裁剪图、停审和跨边界审计。 | 本 Step 不能只给一张依赖图,还必须做跨仓裁剪和架构单元停审。 |
| `standards/document/架构设计书写规范.md` §4.8 | 依赖方向图主语是架构责任层 / 依赖角色,不是代码目录、运行单元、子域对象、协议对象或部署对象。 | 图和表必须使用核心语义、正式承接、外部接缝、派生辅助、技术承载等责任角色。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可进入 package dependency;运行期和事件协作依赖不得写成源码依赖;单仓必须输出裁剪表、类型分类表、禁止依赖表和裁剪图。 | 本仓必须区分 `L0-core` 编译期、`L0-bus` 事件协作、外部 MCP / A2A / API 运行期来源和下游运行期消费。 |
| `standards/document/设计文档讨论中间产物规范.md` | 每个模块先思考后写入,并记录 gate_status 和 next_allowed_action。 | 本文件保留模块级状态,正式 `01` 暂不回填。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 依赖规则不得诱发后续实现端私造 schema、port、状态、lookup 或跨仓 ownership。 | 本 Step 只定义架构依赖方向,不声明具体接口、持久化读写面、事件 payload 或 implementation boundary。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_05_bounded_context_subdomains.md` | 内部语义结构已分为五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用。 | Step 7 不重写子域,只给这些架构单元加依赖规则。 |
| `01_arch_step_06_container_deployment.md` | 运行承载已分为同步入口、异步协作、后台维护、access truth 承载、受控消费 / 追溯派生承载和外部运行边界。 | Step 7 不把这些运行单元当依赖层主语,但要承接 truth / 派生承载分离。 |
| `00_req_step_06_consumers_dependencies.md` | 提供本仓需求层依赖裁剪基线,尤其是 compile/runtime/event 分类和禁止源码依赖。 | 跨仓依赖裁剪必须与需求层分类一致。 |
| `00_req_step_10_business_rules_boundaries.md` | `BR-CH-001~037` 钉住 identity、registry、descriptor、governance seam、method relation、formal exposure 和边界红线。 | 禁止依赖表必须覆盖 execution、secret、cost、governance truth、method body、SDK client、marketplace、observability 等边界。 |
| `00_req_step_11_data_ownership.md` | 数据归属已区分 truth / snapshot / ref / forbidden body。 | 依赖方向必须防止 snapshot / ref / derived / forbidden body 反向进入核心 truth。 |
| `00_req_step_12_interfaces_dependencies.md` | 对外能力边界只到能力级,不写 API、DTO、event schema、handler、service、repository、outbox 或重试。 | 依赖倒置只能写正式边界接入,不能写接口名或 adapter 实现。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §7 | historical material | 只审计旧 `api -> application -> domain -> infra`、`SecretStore`、`ProviderRegistry`、`CapabilityQuery`、`CostSink` 等实现分层和旧依赖口径。 |
| `L1-governance` Step 7 | reference material | 参考核心语义、编排承接、外部接缝、派生辅助、技术承载和跨仓裁剪粒度。 |
| `L3-method-library` Step 7 | reference material | 参考 full-restart 下按架构单元做依赖规则和旧材料审计的方式。 |
| `L0-sdk` Step 7 | reference material | 参考 SDK exposure / client boundary 不被源码依赖污染的写法。 |

---

## 3. 整体模块骨架

Step 7 只回答依赖方向和层间约束,不重写上下文、子域、运行承载、数据所有权、一致性策略、通信协议或技术选型。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 内部依赖角色 | 本仓内部有哪些架构责任层 / 依赖角色,允许怎样依赖。 | 不写代码目录、模块、handler、repository、port、运行单元或部署组件。 | 依赖方向图、层间约束表。 |
| 跨仓依赖裁剪 | 哪些全局依赖边进入本仓架构主链,类型是什么,哪些被裁剪。 | 不复制 27 仓总矩阵,不把 runtime/event 写成 package dependency。 | 裁剪表、类型分类表、禁止依赖表、ASCII 图。 |
| 依赖倒置边界 | 外部输入、条件型依据和下游消费如何通过正式边界接入。 | 不写接口名、事件名、DTO、topic、SDK 方法或适配器实现。 | 依赖倒置结论。 |
| 架构单元依赖规则 | Step 5 的每个架构单元允许依赖什么、禁止依赖什么。 | 不重划子域,不定义对象字段、状态机、表或测试切口。 | 架构单元依赖规则表 / 停审记录。 |
| 跨依赖边界审计 | 是否存在反向依赖、依赖类型误判、实现名词污染和候选关系升级。 | 不用后续概要设计替本 Step 补口。 | 审计表。 |
| 旧材料差异审计 | 旧依赖方向哪些可保留,哪些必须废弃。 | 不继承旧 Draft 状态、旧实现接口名或旧技术承载口径。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 8。 | 不提前通过数据所有权门禁。 | 自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 7 completed_stop_review | pass | 依赖方向图、层间约束、跨仓裁剪、依赖倒置、架构单元依赖规则、跨边界审计、旧材料审计和自检均完成。 | `wait_user_review_to_step_08` |

---

## 5. 模块思考记录

### 5.1 内部依赖角色:先思考

问题回答:

- 本仓依赖方向应保护 `Capability access 核心语义角色`,也就是 identity、registry、descriptor、governance seam、body-free method relation、formal exposure、change / consumer impact 等 access truth。
- 外部 MCP / A2A / API 来源、governance、method-library、runtime、tools、SDK、console、marketplace、observability 只能通过 `外部接缝角色` 和 `Capability access 正式承接角色` 进入。
- 受控消费视图、搜索 / 浏览 / 导出、审计摘要、consumer impact 和对账维护属于 `派生消费辅助角色`,只能依赖核心 truth,不得反写真相。
- 存储、事件协作、索引、缓存、导出材料、技术产品和配置属于 `技术承载角色`,只能服从正式承载契约,不得决定业务语义。
- `L0-core` 的共享契约是唯一编译期来源;`L0-bus` 是事件协作主干,不能被写成业务 truth 或核心源码依赖。

诊断:

- 旧 §7 的 `api / application / domain / infra` 是代码层或概要设计层,不是架构依赖角色。
- 旧 `domain(Registry / Contract / Access / Cost)` 把新版已经废弃的 Provider Contract、Access Decision 和 Cost Accounting 带回核心。
- 旧 `infra(Postgres / KMS/Vault / bus / external protocol adapters)` 把技术产品和外部协议适配器提前写成核心依赖,会导致 Step 8 数据所有权串线。
- 旧 `SecretStore / ProviderRegistry / CapabilityQuery / CostSink` 是实现接口名,不是 Step 7 的架构层间约束。

取舍:

- 使用五类抽象依赖角色:`外部接缝角色`、`Capability access 正式承接角色`、`Capability access 核心语义角色`、`派生消费辅助角色`、`技术承载角色`。
- 用“边界接入”和“允许依赖”表达关系。
- 不写 adapter、port、repository、handler、service、database、KMS、outbox、cache 或 provider client 名词。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用架构责任层 / 依赖角色 | pass | 使用外部接缝、正式承接、核心语义、派生辅助、技术承载。 |
| 是否避免运行单元和代码层 | pass | 未用 sync entry、worker、repository、handler、service 等作为依赖图主语。 |
| 是否保护核心 access truth | pass | 依赖箭头朝向被保护的核心语义。 |
| 是否可进入“内部依赖角色:再写入” | pass | 可形成依赖方向图和层间约束表。 |

### 5.2 内部依赖角色:再写入

#### 5.2.1 依赖方向图

```text
+==============================================================+
|              L3-capability-hub 依赖边界                      |
|                                                              |
|   外部接缝角色                                               |
|   +-------------------------------+                          |
|   | 外部来源 / 治理方法 / 消费接缝 |                          |
|   +---------------+---------------+                          |
|                   | 边界接入                                  |
|                   v                                          |
|        +-------------------------------+                     |
|        | Capability access 正式承接角色 |                     |
|        +----------+-------------+------+                     |
|                   |             |                            |
|                   | 允许依赖    | 允许依赖                   |
|                   v             v                            |
|        +----------------+  +-------------------------------+ |
|        | 核心语义角色   |  | 派生消费辅助角色              | |
|        | access truth   |  | view / trace / export         | |
|        +----------------+  +---------------+---------------+ |
|                   ^                         | 允许依赖        |
|                   |                         |                |
|                   +-------------------------+                |
|                                                              |
|   技术承载角色                                               |
|   +-------------------------------+                          |
|   | truth / derived / event support|                          |
|   +-------------------------------+                          |
|                                                              |
+==============================================================+
```

图示说明:

- 外部接缝角色只表达外部能力、相邻仓和消费方通过正式边界进入,不代表 API、event、SDK、worker 或 adapter。
- `Capability access 正式承接角色` 可以依赖核心语义角色、派生消费辅助角色和技术承载角色,但不能把外部运行事实直接送入核心。
- 派生消费辅助角色围绕核心 access truth 存在,只能依赖核心语义或正式摘要 / 引用,不得成为第二 access truth。
- 技术承载角色只承载正式状态、派生材料和事件协作支撑,不能反向决定核心语义边界。
- 该图不表达调用顺序、运行拓扑、事件传播、代码层依赖或部署结构。

#### 5.2.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 外部接缝角色 | 允许边界接入到 Capability access 正式承接角色。 | 禁止直接依赖核心语义角色、派生消费辅助角色或技术承载角色的内部细节。 | 外部来源、governance、method-library、runtime、tools、SDK、console、marketplace 和 observability 必须先被正式承接,不能打穿核心。 |
| Capability access 正式承接角色 | 允许依赖核心语义角色、派生消费辅助角色、技术承载角色和外部接缝输入的正式结果。 | 禁止拥有独立 capability access truth;禁止绕过核心语义直接采纳外部正文、下游运行状态或查询结果。 | 该角色负责把外部输入和内部核心连接起来,但不重新定义 identity、registry、descriptor、seam、relation 或 exposure。 |
| Capability access 核心语义角色 | 允许依赖本仓内部已收敛的核心规则和正式摘要 / 引用语义。 | 禁止依赖外部系统正文、下游运行状态、UI 入口、marketplace 交易、governance approval、method body、provider runtime、KMS、cost、技术承载实现细节。 | 核心语义必须保持最稳定,保护 capability access truth、formal exposure 和变化追溯边界。 |
| 派生消费辅助角色 | 允许依赖核心语义角色、授权范围、正式外部摘要 / 引用和技术承载角色。 | 禁止替代核心语义成为 access truth;禁止保存 forbidden body、下游执行状态、交易履约事实或观测正文。 | consumer view、搜索、浏览、导出、追溯读取和审计摘要只以派生 / 摘要 / 引用形态存在。 |
| 技术承载角色 | 允许被正式承接角色和派生消费辅助角色依赖,承载 access truth、派生材料和事件协作支撑。 | 禁止反向规定核心语义、状态词表、跨仓边界、业务规则、governance seam 或 method relation 含义。 | 技术承载是支撑条件,不是 capability access truth 边界的来源。 |

### 5.3 跨仓依赖裁剪:先思考

问题回答:

- 本仓在全局依赖基线中的直接确定关系是:`L0-core` 编译期依赖、`L0-bus` 事件协作依赖、外部 MCP / A2A / API 运行期外部能力来源、`L2-runtime` / `L2-tools` 运行期消费、`L0-sdk` 运行期封装 L3 服务端能力。
- `L1-governance` 是 governance result / policy result seam 的运行期 / 事件协作相邻关系,进入当前架构主链,但只能作为正式结果引用、safe summary 或能力反馈线索协作,不能把 approval execution、Policy truth 或 shared_rules truth 移入本仓。
- `L3-method-library` 是 capability-method body-free relation 的相邻边界,当前仍判定为无直接依赖 / 关系边界,不进入源码或正文依赖主链。
- `L5-console`、`L6-marketplace`、`L4-observability` 与本仓有关,但只作为候选消费、只读发现、审计友好摘要或外围管理关系记录,不得成为 capability access truth 的前置依赖。
- secret / KMS / Vault、finance / billing、raw provider billing、external provider runtime / failover / retry / routing / quota 是边界外或后续候选,不进入当前主链。

诊断:

- 最容易失控的是把 `L2-runtime` / `L2-tools` 消费 capability access fact 写成双向源码依赖,从而把 execution truth、tool result 或 provider invocation 带回本仓。
- 第二个风险是把 `L1-governance` seam 写成治理审批执行或 Policy cache,导致 capability registry / whitelist 反向定义 governance truth。
- 第三个风险是把 `L3-method-library` relation 写成 method body 同步或源码依赖,导致方法资产定义 truth 串仓。
- 第四个风险是把 SDK exposure 写成 `L0-sdk` client 包依赖,或把 marketplace / console / observability 读取需求写成核心 truth 前置。
- `L0-bus` 是事件协作主干,不是本仓业务源码依赖,也不是 event schema / outbox / relay 的实现承诺。

取舍:

- 当前依赖裁剪只保留本仓相关边,不复制 27 仓总矩阵。
- 只允许 `L0-core` 进入编译期依赖讨论;其余运行期 / 事件协作 / 关系边界不得写入 package dependency。
- `L1-governance` 和 `L3-method-library` 均按外部正式接缝 / relation 边界进入,不形成 truth 合并。
- 下游消费方只消费正式 access truth 或派生 view,不得反写核心。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否识别本仓相关全局边 | pass | 覆盖 `L0-core`、`L0-bus`、外部 MCP / A2A / API、`L1-governance`、`L2-runtime`、`L2-tools`、`L0-sdk` 和 relation / 候选关系。 |
| 是否区分依赖类型 | pass | 已区分编译期、运行期、事件协作、无直接依赖 / 关系边界和候选关系。 |
| 是否避免全矩阵复制 | pass | 只裁剪 `L3-capability-hub` 相关依赖边。 |
| 是否避免旧材料回流 | pass | KMS、Cost、Provider Contract、Access Decision、QueryCapabilities、marketplace listing 等不进入主链。 |
| 是否可进入“跨仓依赖裁剪:再写入” | pass | 可形成裁剪三表和 ASCII 图。 |

### 5.4 跨仓依赖裁剪:再写入

#### 5.4.1 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L3-capability-hub` 编译期依赖 `L0-core`。 | 依赖方 | 编译期 | 是 | 本仓需要共享契约、基础引用和跨仓一致性基线表达 capability identity、registry、descriptor、ref 和 access truth。 |
| `L0-bus` | `L3-capability-hub` 通过 `L0-bus` 发布能力事件。 | 协作方 | 事件协作 | 是 | capability access fact 变化需要成为平台级协作信号,但 bus 不拥有本仓业务 truth,也不得写成业务仓源码依赖。 |
| 外部 MCP / A2A / API | `L3-capability-hub` 运行期依赖外部 MCP / A2A / API 集成。 | 依赖方 | 运行期 | 是 | 外部能力是 identity、registry 和 adapter descriptor 的接入对象来源;本仓只登记、描述和建立接缝,不执行 provider runtime。 |
| `L1-governance` | Governance 通过运行期 / 事件协作与 capability-hub 交换能力约束和能力反馈线索。 | 协作方 | 运行期 / 事件协作 | 是 | governance seam 是本仓目标之一;但 approval execution、Policy effective fact 和 shared_rules truth 归 `L1-governance`。 |
| `L2-runtime` | `L2-runtime` 运行期消费 `L3-capability-hub` 能力。 | 被依赖方 | 运行期 | 是 | runtime 是正式能力接入事实的主要执行侧消费者;本仓不拥有 runtime execution、agent loop、provider invocation 或执行结果。 |
| `L2-tools` | `L2-tools` 运行期消费 `L3-capability-hub` MCP / A2A 能力。 | 被依赖方 | 运行期 | 是 | tools 是工具侧消费者;本仓不拥有 tool execution、tool result 或工具运行配置 truth。 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1 / L2 / L3 / L4 API。 | 被依赖方 | 运行期 | 是 | SDK exposure boundary 是本仓对外服务端边界之一;SDK client、language binding 和 package 归 `L0-sdk`。 |
| `L3-method-library` | 同属 L3,全局职责分别为方法资产定义与外部能力注册。 | 相邻仓 / relation 边界 | 无直接依赖 | 否 | 本仓只保留 capability-method body-free relation,不依赖 method-library 源码、method body 或定义 truth。 |
| `L5-console` | `L5-console` 经 SDK 消费 L1 / L2 / L3 / L4 管理 API。 | 下游候选 | 运行期候选 | 否 | 管理入口不是 capability access truth 成立前置;后续只能经 SDK / 管理边界读取或发起受控管理动作。 |
| `L6-marketplace` | `L6-marketplace` 运行期消费 method / tool / role 发布审核能力并按需发布生态资产事件。 | 下游候选 / 协作方 | 运行期 / 事件协作候选 | 否 | marketplace listing、transaction、pricing、fulfillment 和 marketplace registry truth 是非目标;后续最多只读发现或引用。 |
| `L4-observability` | `L4-observability` 通过 `L0-bus` 消费 tap / audit material。 | 协作候选 | 事件协作候选 | 否 | observability 是横切观测和审计材料系统,不拥有 capability registry、descriptor 或 access trace truth。 |
| secret / KMS / Vault | 旧材料写作外部依赖,全局矩阵未给出本仓正式业务依赖边。 | 外部基础设施候选 | 运行期候选 | 否 | 本仓不做 secret 平台;后续仅允许 secret ref / safe summary / 安全基础设施接缝,不保存 secret 正文。 |
| finance / billing / raw provider billing | 旧材料写作 Cost Accounting,全局矩阵未给出本仓正式业务依赖边。 | 外部 / 横切候选 | 运行期 / 事件协作候选 | 否 | cost / billing / provider 原始账单是非目标,不得成为 capability access truth 或 registry 边界。 |

#### 5.4.2 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、基础引用、错误 / metadata / trace 上下文等共享契约表达 capability access truth。 | `01` Step 10 / `03-详细设计.md` / `07-实施计划.md` |
| 事件协作依赖 | `L0-bus` | 发布 / 协作 capability access fact 变化,接收外部变化线索,但不让 bus 拥有业务 truth。 | `01` Step 9 / Step 10 / `03-详细设计.md` / `05-测试方案.md` |
| 运行期依赖 | 外部 MCP / A2A / API | 将外部能力作为接入对象、来源语境和 adapter descriptor 目标;不拥有 provider runtime。 | `01` Step 9 / Step 10 / Step 12 / `02-概要设计.md` |
| 运行期 / 事件协作依赖 | `L1-governance` | 消费 / 引用治理结论或 policy 结果,提供能力接入反馈线索,维护 governance seam relation。 | `01` Step 8 / Step 9 / Step 12 / `03-详细设计.md` |
| 运行期依赖 | `L2-runtime` | 向 runtime 提供正式能力接入事实、formal exposure、controlled consumer view 和变化感知边界。 | `01` Step 8 / Step 9 / Step 12 / `05-测试方案.md` |
| 运行期依赖 | `L2-tools` | 向 tools 提供 MCP / A2A / API 能力接入事实和受控消费边界。 | `01` Step 8 / Step 9 / Step 12 / `05-测试方案.md` |
| 运行期依赖 | `L0-sdk` | 提供可被 SDK 封装的服务端能力边界、受控消费语义和 SDK exposure handoff。 | `01` Step 9 / Step 12 / `03-详细设计.md` / `07-实施计划.md` |
| 无直接依赖 / 关系边界 | `L3-method-library` | 只保存 body-free method asset ref / relation,不消费 method body 或源码实现。 | `01` Step 8 / Step 9 / Step 11 / Step 12 |
| 候选运行期 / 事件协作 | `L5-console`、`L6-marketplace`、`L4-observability` | 只读消费、管理入口、生态发现或审计摘要候选,不得成为核心前置。 | `01` Step 12 / Step 13 / Step 14 / Step 15 |

#### 5.4.3 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L3-capability-hub -> L2-runtime / L2-tools` 源码级依赖 | 会把 runtime execution、tool execution、agent loop、provider 调用结果、工具状态或执行配置混入 capability access truth。 | 通过运行期服务边界、受控消费视图、变化事件或 SDK / 正式查询边界协作。 |
| `L2-runtime / L2-tools -> L3-capability-hub` 源码级实现依赖 | 消费 capability access fact 不等于链接本仓业务实现,否则 execution 仓和 access truth 仓形成强耦合。 | 通过运行期能力边界、SDK 封装、正式快照 / 引用 / 查询边界消费。 |
| `L3-capability-hub -> L1-governance` approval execution / Policy truth 依赖 | 会把 governance approval、Policy effective fact、shared_rules 和决策真相写成本仓 truth。 | 本仓只保存 governance result ref、policy result ref、允许摘要或 seam relation。 |
| `L1-governance -> L3-capability-hub` 用 whitelist / registry cache 定义 Policy truth | 会让 capability registry、cache 或 allowlist 反向成为治理真相源。 | Governance 拥有正式治理结论;Capability Hub 反馈能力线索并消费治理结果引用。 |
| `L3-capability-hub -> L3-method-library` 源码 / method body 依赖 | 会把 Method Content、TaskDefinition、ProcessTemplateDef、AIPolicyDef、RoleDefinition 等方法资产正文并入能力仓。 | 只保存 body-free method asset ref / relation,方法资产正文由 `L3-method-library` 持有。 |
| `L3-capability-hub -> L0-sdk` 编译期或客户端实现依赖 | 会把 SDK client、language binding、package candidate、developer experience 写成本仓职责。 | 本仓提供服务端 exposure boundary;SDK 通过运行期边界封装。 |
| `L3-capability-hub -> 外部 MCP / A2A / API` 执行网关 / provider runtime 依赖 | 会把外部调用、重试、路由、failover、quota、provider runtime 和 invocation result 写成本仓 truth。 | 本仓只登记、描述、审查和建立接缝;执行由 runtime / tools / provider adapter 边界处理。 |
| `L3-capability-hub -> KMS / Vault` 作为核心 truth 依赖 | 会把 secrets 平台和密钥生命周期管理变成本仓主线。 | 后续仅可保存 secret ref / safe summary,具体密钥管理归边界外系统。 |
| `L3-capability-hub -> finance / billing / raw provider billing` | 会把成本、账单、provider 原始账单和 CostRecord 写成能力接入 truth。 | 若后续需要,通过观测 / 财务摘要或事件协作候选处理,不进入当前主链。 |
| `L3-capability-hub -> L6-marketplace` listing / transaction 依赖 | marketplace 上架、定价、交易、订单、结算和履约不是本仓职责。 | marketplace 只读消费能力可发现线索或引用,交易 truth 留在 `L6-marketplace`。 |
| `L3-capability-hub -> L4-observability` store / audit truth 依赖 | observability store、trace、metric、audit log 正文不能定义 capability registry 或 access trace truth。 | 通过审计友好摘要、事件协作或 ref 交接,不保存观测正文。 |
| 派生消费辅助角色 -> Capability access 核心语义角色 反写 | consumer view、搜索、导出、审计摘要和 impact summary 可重建且可滞后,不能成为第二 truth。 | 派生结构只能从核心 truth 读取并可重建,变更必须回到正式承接角色。 |
| 技术承载角色 -> 核心语义角色 反向定义 | 存储、缓存、搜索、消息、outbox、provider client 或配置不能决定业务语义和状态词表。 | 技术承载服从核心规则与正式承载契约。 |

#### 5.4.4 依赖裁剪图: L3-capability-hub

```text
Global baseline
  |
  | crop only L3-capability-hub related edges
  v
+------------------------+
| L3-capability-hub     |
| capability access     |
+-----------+------------+
            |
            | [compile]
            v
        L0-core

L3-capability-hub
            |
            | [event]
            v
          L0-bus

L3-capability-hub
            |
            | [runtime]
            v
External MCP / A2A / API systems

L1-governance
            ^
            | [runtime/event]
            v
L3-capability-hub

L2-runtime / L2-tools
            |
            | [runtime]
            v
L3-capability-hub

L0-sdk
            |
            | [runtime]
            v
L3-capability-hub

L3-method-library
            |
            | [relation only, no direct dependency]
            v
L3-capability-hub
```

图示说明:

- 本图只展示 `L3-capability-hub` 相关依赖边,不展示全 27 仓。
- `[compile]` 仅适用于 `L0-core`;`[runtime]`、`[event]` 和 relation only 不得写成 package dependency。
- 箭头表达依赖 / 消费 / 协作 / relation 方向,不表达调用顺序、事件传播时序、部署结构或实现流程。
- `L3-method-library` 只作为 body-free relation 边界出现,不表示 method body、定义源码或运行期强依赖进入本仓。
- `L5-console`、`L6-marketplace`、`L4-observability`、KMS / Vault 和 finance / billing 当前只作为候选或边界外审计对象,不进入主图。

#### 5.4.5 path dependency 判定结论

| 关联项目 | 依赖类型 | 是否允许写入 `Cargo.toml` / package dependency | 当前处理 |
|---|---|---|---|
| `L0-core` | 编译期依赖 | 是 | 后续可作为唯一内部 path dependency 候选继续展开。 |
| `L0-bus` | 事件协作依赖 | 否 | 只保留事件协作边界,不得写成业务源码依赖。 |
| 外部 MCP / A2A / API | 运行期外部依赖 | 否 | 只作为接入对象来源和 descriptor 目标。 |
| `L1-governance` | 运行期 / 事件协作 | 否 | 通过 governance result ref / safe summary / seam relation 协作。 |
| `L2-runtime` | 运行期消费 | 否 | 消费本仓 formal exposure / controlled consumer view,不得链接本仓实现。 |
| `L2-tools` | 运行期消费 | 否 | 消费本仓能力接入事实,不得链接本仓实现。 |
| `L0-sdk` | 运行期消费 / 封装 | 否 | SDK 消费服务端边界,本仓不依赖 SDK client。 |
| `L3-method-library` | 无直接依赖 / relation only | 否 | 只保留 body-free relation,不消费源码或正文。 |
| `L5-console` / `L6-marketplace` / `L4-observability` | 候选运行期 / 事件协作 | 否 | 后续按只读消费、管理、生态或观测边界再裁剪。 |

### 5.5 依赖倒置边界:先思考

问题回答:

- 外部能力来源、治理结果、方法资产、下游消费、SDK exposure、观测 / 生态 / 安全候选都必须倒置到正式边界,不能直接进入核心语义。
- 核心语义只声明自己需要稳定引用、safe summary、关系语义、formal exposure 和 change traceability,不依赖外部实现、协议、源码、事件名或存储形态。
- 倒置边界不能写成接口名、port 名、adapter 名、DTO 名、event name 或 repository 名;本 Step 只写架构依赖红线。

诊断:

- 如果把外部 MCP / A2A / API 写成 provider adapter interface,会提前进入概要 / 详细设计,并可能把 execution gateway 带回本仓。
- 如果把 governance seam 写成 Policy adapter 或 approval client,会把 approval truth 合并进 Capability Hub。
- 如果把 method relation 写成 method-library client 或 method snapshot schema,会造成 method body 或定义字段提前闭口。
- 如果把 SDK exposure 写成 SDK client dependency,会让服务端 truth 依赖客户端封装。

取舍:

- 使用“正式接缝 / 引用 / safe summary / relation / controlled view / event collaboration boundary”表达倒置。
- 倒置目标是保护核心语义和 truth ownership,不是定义接口实现。
- 所有边界细化后移到 Step 8 数据所有权、Step 9 关键交互、Step 10 技术选型、Step 11 取舍和 Step 12 横切关注点继续承接。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否识别需要倒置的外部来源 | pass | 外部能力、governance、method、runtime/tools、SDK、observability、marketplace、KMS、finance 均已覆盖。 |
| 是否避免实现接口名 | pass | 未写 port、adapter、DTO、event name、repository 或 handler。 |
| 是否保护核心语义 | pass | 外部对象只能通过正式承接角色进入。 |
| 是否可进入“依赖倒置边界:再写入” | pass | 可形成依赖倒置结论表。 |

### 5.6 依赖倒置边界:再写入

| 需要倒置的依赖 | 倒置方式 | 保护目标 |
|---|---|---|
| 外部 MCP / A2A / API 来源 | 只通过外部来源引用、接入对象语境和 descriptor 约束摘要进入正式承接角色。 | 防止 provider runtime、外部协议正文、调用结果、retry / failover / route / quota 进入核心。 |
| `L1-governance` governance result / policy result | 核心只保存 governance result ref、policy result ref、allowed safe summary 或 seam relation,外部结论变化经正式边界承接。 | 防止 approval execution、Policy effective fact、shared_rules truth 或 whitelist refresh 进入本仓。 |
| `L3-method-library` method asset | 核心只保存 method asset ref 和 body-free relation,不保存方法正文、定义源码或版本正文。 | 防止 Method Content、TaskDefinition、ProcessTemplateDef、AIPolicyDef 等定义 truth 串仓。 |
| `L2-runtime` / `L2-tools` 消费需求 | 下游只消费 formal exposure、controlled consumer view、descriptor 摘要和变化感知,反馈只作为影响摘要或线索。 | 防止 execution truth、tool result、provider lookup、runtime cache 或 allow / deny decision 反写核心。 |
| `L0-sdk` official exposure | SDK 通过服务端正式边界封装能力,本仓只提供 exposure boundary 和可封装语义。 | 防止 SDK client、language binding、package candidate 或 developer experience 定义服务端 truth。 |
| `L0-bus` 事件协作 | 事件协作只承接 access fact 变化输出和外部变化输入线索。 | 防止 event topic、payload、outbox、relay 或消息产品定义核心语义。 |
| `L5-console` 管理入口 | 管理入口只能经受控管理边界和 SDK / 服务端能力边界进入正式承接角色。 | 防止 UI 状态、操作体验、筛选条件或临时查询成为 access truth。 |
| `L6-marketplace` 生态发现 | 只允许只读发现摘要、marketplace object ref 或后续审计接缝。 | 防止 listing、transaction、pricing、fulfillment 或 marketplace registry truth 进入本仓。 |
| `L4-observability` 观测 / 审计 | 只允许 audit ref、observability safe summary 或审计友好摘要交接。 | 防止 log、trace、metric、alert、audit store 正文反向定义 capability access truth。 |
| secret / KMS / Vault | 只允许 secret ref、secret handling safe summary 和安全边界引用。 | 防止 provider key、token、password、private key、KMS / Vault truth 或 secret lifecycle 入仓。 |
| finance / billing / raw provider billing | 只允许后续候选摘要或外部事件背景,当前不进入主链。 | 防止 CostRecord、账单、成本归因或 provider 原始账单变成本仓 truth。 |
| 存储 / 缓存 / 搜索 / 导出 / outbox | 技术机制服从正式承载契约,不得作为核心依赖主语。 | 防止技术产品、cache snapshot、search index、export artifact 或 outbox 反向规定业务语义。 |

依赖边界说明:

`L3-capability-hub` 的依赖倒置核心是让外部来源、相邻仓结论、下游消费和技术承载都服从本仓 access truth 的正式边界。核心语义只依赖稳定引用、正式摘要、关系语义和已确认的内部规则,不依赖外部实现和下游运行状态。运行期和事件协作关系会在后续交互、数据所有权和技术选型中细化,但不得被提前改写为源码依赖或核心 truth 来源。

### 5.7 架构单元依赖规则:先思考

问题回答:

- Step 5 已把内部语义结构分为五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用;Step 7 必须给每个单元定义依赖规则,但不能重划子域。
- 核心子域之间存在语义依附,但依赖方向必须保护 identity / registry / descriptor / seam / exposure 的 truth 轴,不得让支撑、影子或下游消费反向定义核心。
- 支撑子域可以依赖核心 truth 和正式外部摘要 / 引用,不得独立生成第二 access truth。
- 本地影子层只能被核心 / 支撑通过正式承接读取,不能成为写源或外部 truth owner 的替代品。

诊断:

- `正式暴露与受控消费语义` 最容易被下游 runtime / tools / SDK 查询需求反向塑形,必须明确它依赖核心 truth 而不是消费端状态。
- `派生维护与消费快照语义` 最容易从 search / export / QueryCapabilities 退化为第二 truth,必须禁止反写。
- `治理与方法外部引用` 最容易吞入 governance / method body,必须维持 ref / safe summary / relation only。
- `安全与敏感边界引用` 最容易滑成 KMS / Vault 子域,必须只作为引用和摘要边界。

取舍:

- 架构单元依赖规则按 Step 5 单元逐项列出,每项给出允许依赖、禁止依赖、外部接入 / 倒置边界和停审结论。
- 对同类本地影子结构保持粒度,避免后续实现 agent 误以为可自行补 schema / port。
- 不在本 Step 定义字段、状态机、接口协议、数据一致性、测试切口或 implementation boundary。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否逐架构单元判断 | pass | 五个核心、四个支撑、五类本地影子均进入规则表。 |
| 是否避免重划子域 | pass | 沿用 Step 5 单元名称和类型。 |
| 是否明确禁止依赖 | pass | 每个单元均有禁止边界和倒置方式。 |
| 是否可进入“架构单元依赖规则:再写入” | pass | 可形成规则表和停审记录。 |

### 5.8 架构单元依赖规则:再写入

#### 5.8.1 核心子域依赖规则

| 架构单元 | 允许依赖 | 禁止依赖 | 外部接入 / 倒置边界 | 停审 |
|---|---|---|---|---|
| 能力身份语义 | 允许依赖 `L0-core` 共享契约、外部来源引用和本仓 identity 不变量。 | 禁止依赖 URL、provider 名、runtime config、SDK client、marketplace listing、外部认证状态或 provider runtime。 | 外部 MCP / A2A / API 只能作为来源引用和身份风险线索进入。 | pass |
| 注册目录语义 | 允许依赖能力身份语义、接入描述摘要、governance seam 状态引用和内部目录生命周期规则。 | 禁止依赖 allowlist、runtime cache、availability bit、marketplace listing、搜索索引或下游查询结果。 | 下游消费和管理入口只能通过正式承接角色提出变更或读取派生视图。 | pass |
| 接入描述语义 | 允许依赖能力身份、注册目录、外部来源引用、secret ref / safe summary 和 descriptor 内部约束规则。 | 禁止依赖 Provider Contract、secret 正文、quota、route、cost、failover、retry、provider runtime、invocation result。 | 外部协议和敏感材料必须倒置为 ref / safe summary / constraint summary。 | pass |
| 治理与方法关系语义 | 允许依赖身份、目录、描述、governance result ref / safe summary 和 method asset ref。 | 禁止依赖 approval execution、Policy truth、shared_rules、method body、definition source truth、process template body。 | Governance 和 method-library 只能通过 seam relation / body-free relation 进入。 | pass |
| 正式暴露与受控消费语义 | 允许依赖身份、目录、描述、治理 / 方法关系、正式可见性规则和内部 exposure 不变量。 | 禁止依赖 runtime allow / deny、QueryCapabilities、Policy cache、SDK client、tool result、consumer view 反写。 | runtime、tools、SDK 只能消费 formal exposure 和 controlled consumer view,不能定义它们。 | pass |

#### 5.8.2 支撑子域依赖规则

| 架构单元 | 允许依赖 | 禁止依赖 | 外部接入 / 倒置边界 | 停审 |
|---|---|---|---|---|
| 接入审查与风险解释语义 | 允许依赖能力身份、接入描述、安全与敏感边界引用、governance seam relation。 | 禁止替代 governance approval、认证授权、runtime 拦截、KMS / Vault truth 或 provider risk engine。 | 审查事实只解释本仓接入风险和职责分离,不审批能力使用。 | pass |
| 追溯与变化感知语义 | 允许依赖所有核心子域和正式 change / ref / summary。 | 禁止成为 observability store、audit log、event outbox、trace body 或 metrics store。 | 观测 / 审计只能通过 ref / summary / handoff 边界协作。 | pass |
| 派生维护与消费快照语义 | 允许依赖核心 access truth、正式摘要、授权范围和技术承载。 | 禁止创建或覆盖 identity、registry、descriptor、seam、relation、formal exposure;禁止保存 forbidden body。 | search、export、consumer view、impact summary 均可重建且不得反写真相。 | pass |
| 外围管理与发现语义 | 允许依赖核心 truth、派生消费快照、外部文档引用和候选发现摘要。 | 禁止拥有 UI 状态、console 操作 truth、marketplace listing / transaction、SDK client truth。 | console、marketplace、SDK 说明和候选发现都必须经外围边界进入。 | pass |

#### 5.8.3 本地索引 / 投影 / 引用依赖规则

| 架构单元 | 允许依赖 | 禁止依赖 | 外部接入 / 倒置边界 | 停审 |
|---|---|---|---|---|
| 外部能力来源引用 | 允许保存外部 MCP / A2A / API source ref、外部标准 ref 和来源 safe summary。 | 禁止拥有外部协议正文、认证协议正文、provider runtime、请求 / 响应正文或外部产品 truth。 | 来源引用只能被身份、目录和描述语义读取,不得反向定义它们。 | pass |
| 治理与方法外部引用 | 允许保存 governance result ref、policy result ref、allowed safe summary、method asset ref。 | 禁止保存 approval、Policy effective fact、shared_rules、Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 正文。 | 只服务治理与方法关系语义,不得替代相邻仓 truth。 | pass |
| 安全与敏感边界引用 | 允许保存 secret ref、secret handling safe summary 和敏感边界引用。 | 禁止保存 provider API key、token、password、private key、KMS / Vault truth、secret lifecycle 正文。 | 安全材料必须通过 safe summary / ref 倒置进入接入描述和风险解释。 | pass |
| 下游消费与 SDK 引用 | 允许保存 runtime / tools / SDK consumer ref、downstream impact summary 和 SDK exposure consumer ref。 | 禁止保存 runtime execution、tool result、provider lookup、SDK client、language package、client cache truth。 | 下游只能影响派生视图和变化感知,不能反写 formal exposure。 | pass |
| 观测 / 生态 / 外部文档引用 | 允许保存 observability / audit ref、marketplace object ref、external standard / protocol / document ref。 | 禁止保存 log、trace、metric、alert、audit store、marketplace listing、transaction、pricing、fulfillment、外部文档正文。 | 只服务追溯、外围发现和审计友好摘要,不成为核心依赖。 | pass |

#### 5.8.4 架构单元依赖停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 核心子域是否仍保护 access truth | pass | identity、registry、descriptor、seam / relation、formal exposure 均未依赖下游执行、外部正文或技术机制。 |
| 支撑子域是否未形成第二 truth | pass | risk、trace、maintenance、consumer snapshot、peripheral discovery 均依赖核心 truth,不得反写。 |
| 本地影子层是否保持 ref / summary | pass | 外部来源、治理方法、安全敏感、下游 SDK、观测生态均只作为 ref / safe summary / projection。 |
| 运行期 / 事件协作是否未误写为 package dependency | pass | 除 `L0-core` 外均禁止写入源码依赖。 |
| 是否存在实现名词污染 | pass | 规则表未写 adapter、repository、handler、service、DTO、topic、outbox、DB、cache。 |
| 是否可进入跨依赖边界审计 | pass | 每个架构单元依赖规则已停审。 |

### 5.9 跨依赖边界审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在反向依赖 | pass | 下游 runtime / tools / SDK、派生 view、search / export、console / marketplace / observability 均不得反写核心 truth。 |
| 是否存在运行期通信误写 package dependency | pass | `L1-governance`、`L2-runtime`、`L2-tools`、`L0-sdk`、外部 MCP / A2A / API 均不是 package dependency。 |
| 是否存在事件协作误写业务源码依赖 | pass | `L0-bus` 只作为事件协作边界,不拥有业务语义和 event schema。 |
| 是否存在 relation 边界升级为源码 / 正文依赖 | pass | `L3-method-library` 保持 body-free relation,不进入源码或 method body 依赖。 |
| 是否存在 candidate 关系升级为主链依赖 | pass | `L5-console`、`L6-marketplace`、`L4-observability`、KMS / Vault、finance / billing 均只作候选或边界外审计。 |
| 是否存在 adapter / repository 名词误作架构规则 | pass | 本 Step 不写 port、adapter、repository、handler、service、DTO、topic、outbox。 |
| 是否存在 Step 8 数据所有权风险 | pass | 已明确 truth / derived / ref / forbidden body 方向,但具体数据归属和一致性仍留给 Step 8。 |
| 是否存在旧材料冲突未处理 | pass | 旧 Provider Contract、Cost、KMS、Access Decision、QueryCapabilities、Policy-aware query 均进入旧材料差异审计。 |

---

## 6. 旧材料差异审计

### 6.1 可保留方向

| 旧材料方向 | 审计结论 | 当前承接 |
|---|---|---|
| 外部 MCP / A2A / API 能力接入 | 可保留为外部接缝方向 | 通过外部能力来源引用、adapter descriptor 和正式承接角色进入,不承接 provider runtime。 |
| Registry / directory 管理线索 | 可保留为 registry 语义 | 重裁为注册目录语义和正式 access truth,不保留 allowlist / availability bit / marketplace listing。 |
| Governance 联动 | 可保留为 governance seam | 重裁为 governance result ref / safe summary / seam relation,不保留 approval execution 或 Policy truth。 |
| Runtime / tools 消费能力 | 可保留为下游消费关系 | 重裁为 formal exposure / controlled consumer view 消费,不保留 QueryCapabilities 或 provider lookup。 |
| SDK / console / marketplace / observability 线索 | 可保留为外围消费或审计候选 | 只作为 SDK exposure、管理入口、只读生态发现或审计摘要候选,不进入核心 truth 主链。 |

### 6.2 必须废弃或降级的旧口径

| 旧口径 | 处理方式 | 原因 |
|---|---|---|
| `api -> application -> domain -> infra` 依赖图 | 废弃为 historical material | 这是代码层或概要 / 详细设计层,不是 Step 7 架构责任层 / 依赖角色。 |
| `domain(Registry / Contract / Access / Cost)` | 废弃 / 重裁 | `Contract`、`Access`、`Cost` 会把 Provider Contract、Access Decision、Cost Accounting 带回核心。 |
| `infra(Postgres / KMS/Vault / bus / external protocol adapters)` | 废弃 / 后移 | 技术产品和外部协议适配器不能作为架构依赖主语;存储 / 消息 / 安全机制后续再裁剪。 |
| `SecretStore` | 废弃为实现接口名 | 本仓不拥有 KMS / Vault truth 或 secret lifecycle;只允许 secret ref / safe summary。 |
| `ProviderRegistry` | 废弃为实现接口名 | provider registry 旧语义容易等同 provider runtime;新版只保留 capability registry truth。 |
| `CapabilityQuery` / `QueryCapabilities` | 废弃 / 降级为派生消费读取线索 | 查询结果不能成为 formal exposure truth 或 runtime allow / deny decision。 |
| `CostSink` / `CostRecord` | 废弃为非目标 | cost / billing / finance ledger 不归本仓。 |
| `Policy-aware capability exposure` / 白名单刷新 | 重裁为 governance seam + formal exposure | Policy truth 和 approval execution 归 governance,本仓只保存 seam relation 与正式 exposure。 |
| KMS / Vault、PostgreSQL、cache、outbox、provider adapters 作为已定依赖 | 后移 | 技术选型、配置和实现边界必须等后续 Step / 文档,当前不得作为依赖方向结论。 |

旧材料审计结论:旧 `01-架构设计.md` §7 只能作为冲突线索,不得作为新版依赖方向基线。新版 Step 7 以正式 `00`、架构 Step 1~6、全局依赖裁剪规则和本文件结构化结论为准。

---

## 7. 回填草稿

正式 `01-架构设计.md` 后续 Step 16 装配时,§8 `依赖方向与层间约束` 应按以下口径回填。当前不得直接修改正式 `01-架构设计.md`。

| 正式章节候选 | 回填来源 | 回填口径 |
|---|---|---|
| §8.1 依赖方向图 | 本文件 §5.2.1 | 使用五类依赖角色图,不得回填旧 `api / application / domain / infra` 图。 |
| §8.2 层间约束表 | 本文件 §5.2.2 | 写清外部接缝、正式承接、核心语义、派生辅助和技术承载的允许 / 禁止依赖。 |
| §8.3 本仓依赖裁剪表 | 本文件 §5.4.1 | 使用固定裁剪表,只保留本仓相关跨仓边。 |
| §8.4 本仓依赖类型分类表 | 本文件 §5.4.2 | 明确 `L0-core` 是唯一编译期依赖;runtime / event 不进入 package dependency。 |
| §8.5 本仓禁止依赖表 | 本文件 §5.4.3 | 覆盖 execution、governance truth、method body、SDK client、marketplace、observability、KMS、cost 和派生反写。 |
| §8.6 依赖裁剪图 | 本文件 §5.4.4 | 使用 `全局项目依赖关系与裁剪规则.md` §6 格式和依赖类型标注。 |
| §8.7 依赖倒置说明 | 本文件 §5.6 | 只写正式边界和保护目标,不写接口名或 adapter 实现。 |

正式回填时必须保留以下禁止项:

- 不写 API 路径、DTO、event schema、topic、handler、service、repository、outbox、adapter、port。
- 不把运行承载单元、代码目录、数据库、KMS / Vault、cache、搜索、provider client 写成依赖方向主语。
- 不把 consumer view、search、export、audit summary、runtime cache、SDK wrapper 或 marketplace listing 写成 access truth。
- 不修改 Step 8 数据所有权和一致性策略的未决空间。

---

## 8. 自检与停审

### 8.1 完成标准自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否列出本 Step 必读文档 | pass | 已列公共规范、本仓输入、历史输入和参考粒度。 |
| 是否先搭整体模块再逐模块推进 | pass | 已按内部依赖角色、跨仓裁剪、依赖倒置、架构单元规则、审计和自检推进。 |
| 是否完成“先思考、再写入” | pass | 内部依赖、跨仓裁剪、倒置边界、架构单元规则均包含思考记录和结构化写入。 |
| 是否形成依赖方向图 | pass | 已输出五类架构责任层 / 依赖角色图。 |
| 是否形成层间约束表 | pass | 已按固定列说明允许依赖、禁止依赖和保护目标。 |
| 是否形成本仓依赖裁剪表 | pass | 已使用全局裁剪固定表,只保留本仓相关依赖边。 |
| 是否形成依赖类型分类表 | pass | 已区分编译期、运行期、事件协作、无直接依赖 / relation 和候选关系。 |
| 是否形成禁止依赖表 | pass | 已覆盖源码依赖、truth 串仓、执行 / secret / cost / marketplace / observability / 派生反写等红线。 |
| 是否形成依赖裁剪 ASCII 图 | pass | 已按 §6 格式标注 `[compile]`、`[runtime]`、`[event]` 和 relation only。 |
| 是否按架构单元逐个定义依赖规则 | pass | 已覆盖五个核心子域、四个支撑子域和五类本地影子结构。 |
| 是否完成跨依赖边界审计 | pass | 已审计反向依赖、依赖类型误判、candidate 升级和实现名词污染。 |
| 是否避免正式 `01` 正文写入 | pass | 未修改 `01-架构设计.md` 正式正文。 |
| 是否避免提前进入后续 Step | pass | 未定义数据矩阵、通信协议、技术选型、部署参数、ADR 或 implementation boundary。 |

### 8.2 blocker 判断

| blocker | 状态 | 判断 |
|---|---|---|
| 上游需求 blocker | none | 正式 `00`、架构 Step 1~6 足以支撑依赖方向与层间约束。 |
| 旧材料冲突 | not_blocking | 冲突已记录为 historical material,未作为新版依赖方向基线。 |
| 未闭口事项 | not_blocking_step_08 | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK handoff、API / DTO / state / implementation boundary 后续继续闭口,不阻塞 Step 8。 |

### 8.3 下一步门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 `依赖方向与层间约束` completed_stop_review |
| 当前正式文档 | `01-架构设计.md` 未修改;必须等 Step 16 装配 |
| next_allowed_action | `wait_user_review_to_step_08` |
| 下一步应读 | `架构设计讨论流程_SOP.md` Step 8;`架构设计书写规范.md` §4.9;本文件;`01_arch_step_01~07`;正式 `00-需求文档.md`;`00_req_step_11_data_ownership.md`;参考项目 Step 8 |

当前不需要提交 commit。

---

## 9. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 7 completed_stop_review | pass | 依赖方向图、层间约束、跨仓裁剪、依赖倒置、架构单元依赖规则、跨边界审计、旧材料审计、回填草稿和自检均完成。 | `wait_user_review_to_step_08` |
