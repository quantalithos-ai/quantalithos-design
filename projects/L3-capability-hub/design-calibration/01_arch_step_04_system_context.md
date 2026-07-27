# L3-capability-hub 01 架构 Step 4: 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md` 与 `01_arch_step_01~03` 推导系统上下文;旧 README 和旧 `01-架构设计.md` 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 系统边界与上下文 |
| 输出文件 | `design-calibration/01_arch_step_04_system_context.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 4;`架构设计书写规范.md` §4.5 与 ASCII 图规则 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;正式 `00-需求文档.md` §2 / §6 / §7 / §10 / §11 / §12 / §15 |
| 已读取需求中间产物 | yes:`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_15_risks_open_questions.md`;`00_req_step_16_traceability_matrix.md` |
| 已读取历史输入 | yes:`README.md`;旧 `01-架构设计.md` §4~§6 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 4;`L3-method-library` Step 4;`L0-sdk` Step 4 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 3 进入 Step 4 |
| next_allowed_action | Step 4 已完成,等待用户确认后进入 Step 5。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入上下文对象裁剪思考。 |
| 上下文对象裁剪:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入上下文对象裁剪写入。 |
| 上下文对象裁剪:再写入 | done | 正式上下文对象分层表 | pass | 进入输入 / 依赖上下文思考。 |
| 输入 / 依赖上下文:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入输入 / 依赖上下文写入。 |
| 输入 / 依赖上下文:再写入 | done | 输入 / 依赖上下文表项 | pass | 进入输出 / 消费上下文思考。 |
| 输出 / 消费上下文:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入输出 / 消费上下文写入。 |
| 输出 / 消费上下文:再写入 | done | 输出 / 消费上下文表项 | pass | 进入图和失效口径思考。 |
| 图和失效口径:先思考 | done | 图对象裁剪 / 降级口径 | pass | 进入图和失效口径写入。 |
| 图和失效口径:再写入 | done | 系统上下文图 / 上下游表 / 边界说明 / 降级表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 5。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 4 输出系统上下文图、上下游与输入 / 输出面表、边界说明,并回答正式上游、正式下游、输入面、输出面和依赖失效口径。 | 本 Step 只表达系统级上下文关系,不展开内部职责、子域、容器、数据矩阵、接口协议或实现依赖。 |
| `standards/document/架构设计书写规范.md` §4.5 | 图中只允许出现本仓、内部仓、外部系统、外部能力和入口系统;关系类型只写输入、输出、依赖。 | 图中不画角色、文档来源、接口名、事件名、DTO、数据库、handler、service 或运行顺序。 |
| `架构设计书写规范.md` ASCII 图规则 | 系统上下文图以本仓为中心,关键输入 / 依赖在上方,关键输出 / 消费在下方,关键对象建议 3~7 个。 | 主图必须收缩关键对象,不把所有候选消费方和历史技术设施都塞入图中。 |
| `设计文档讨论中间产物规范.md` | Step 产物必须保留先思考再写入的过程、结构化中间产物和停审门禁。 | 本文件保留模块级判断,正式 `01-架构设计.md` 仍不得修改。 |
| `设计文档编写通则.md` | 系统边界必须承接上游需求、职责边界和依赖裁剪。 | 上下文对象必须能回指 Step 1~3 和正式 `00`,不得由旧材料反推。 |
| `设计真相源闭环与可落码性标准.md` | 不得用图或表暗示未闭口 schema、port、状态、存储、evidence 或 implementation boundary。 | 本 Step 只写对象和能力面,把 API / DTO / event / state / storage / boundary 后移。 |
| `全局项目依赖关系与裁剪规则.md` | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;其余按运行期、事件、ref、summary 或消费边界表达。 | 系统上下文必须区分编译期基础、事件协作、运行期外部能力、相邻仓 relation 和下游消费。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已确认本仓是外部 MCP / A2A / API capability identity、registry、adapter descriptor 的能力接入真相仓。 | 图中央必须是 capability access truth owner,不是运行网关、provider 平台、KMS、cost 或 marketplace。 |
| `01_arch_step_02_goals_constraints.md` | 已确认架构目标为 access truth、identity / registry、descriptor、governance seam、method relation、formal exposure、变化追溯和外围隔离。 | 系统上下文必须覆盖这些主线的外部对象和消费对象。 |
| `01_arch_step_03_responsibility_boundary.md` | 已收束做 / 不做 / 易混淆职责与红线。 | 上下文关系不得把 execution、provider runtime、secret、cost、governance truth、method body、SDK client 或 marketplace listing 写成本仓职责。 |
| 正式 `00-需求文档.md` §6 | `L0-core`、`L0-bus`、外部 MCP / A2A / API、`L1-governance`、`L2-runtime`、`L2-tools`、`L0-sdk`、`L3-method-library` 等依赖已裁剪。 | Step 4 可从这些依赖中筛选正式上下文对象。 |
| 正式 `00-需求文档.md` §11 | 数据归属分为 truth / snapshot / ref / forbidden body。 | 上下文表的输入 / 输出面只能表达 truth、ref、safe summary、consumer view 等边界,不能写正文迁移。 |
| 正式 `00-需求文档.md` §12 | 能力级接口与依赖只表达变更、查询、事件输出、事件输入和后台任务边界,不写协议。 | Step 4 表中只能写能力面,不能写 `QueryCapabilities`、event name、RPC、DTO 或 handler。 |
| 正式 `00-需求文档.md` §15 | governance seam、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、外围接缝和 API / DTO / state / boundary 未闭口。 | 未闭口项可作为边界说明或降级口径,不得在系统上下文中提前定形。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| `projects/L3-capability-hub/README.md` | historical material | 保留 MCP / A2A / API 能力池和治理联动线索;废弃 runtime 必经 hub、provider key、cost、KMS、marketplace listing、LLM routing 等上下文主线。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | historical material | 只审计旧系统上下文图、KMS/Vault、providers、marketplace、QueryCapabilities、Cost Accounting、PostgreSQL/cache/outbox 等冲突。 |
| `L1-governance` Step 4 | reference material | 参考正式上下文对象、输入 / 输出面、依赖失效降级和旧材料诊断的密度。 |
| `L3-method-library` Step 4 | reference material | 参考主图对象裁剪、表中补足条件 / 外围上下文的写法。 |
| `L0-sdk` Step 4 | reference material | 参考 SDK exposure 与下游消费关系的系统上下文写法。 |

---

## 3. 整体模块骨架

Step 4 只回答本仓在全局系统中的正式上下文位置,不展开内部限界上下文、子域、容器、数据所有权矩阵、通信方式、协议 schema、状态机、存储、技术选型或实现依赖方向。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 上下文对象裁剪 | 哪些外部系统、内部仓、外部能力或入口系统构成本仓正式上下文对象。 | 不按功能项或角色列对象,不把历史技术设施画入图。 | 正式上下文对象分层表。 |
| 输入 / 依赖上下文 | 本仓从哪些对象接收正式输入面或基础依赖。 | 不写调用协议、event 名、DTO、字段或同步 / 异步机制。 | 输入 / 依赖上下文表项。 |
| 输出 / 消费上下文 | 本仓向哪些对象提供正式输出面或消费边界。 | 不替下游设计消费缓存、SDK client、UI、runtime loop 或 marketplace listing。 | 输出 / 消费上下文表项。 |
| 图和失效口径 | 如何用主图表达关键对象;依赖不可用时如何不破坏 truth 边界。 | 不写 SLA、重试、fallback、cache、outbox、provider failover 或运维降级方案。 | 系统上下文图、上下游表、边界说明、降级表。 |
| 旧材料差异审计 | 旧系统上下文哪些可保留,哪些必须废弃或后移。 | 不继承旧图、旧四子域、旧外部依赖或旧技术组件。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 5。 | 不提前通过限界上下文与子域划分门禁。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 上下文对象裁剪:先思考

问题回答:

- `L3-capability-hub` 在全局系统中的位置是 L3 能力接入真相仓,位于外部 MCP / A2A / API 能力来源与 runtime、tools、SDK、governance、method-library 和产品 / 生态消费之间。
- 正式上游和依赖对象应包括 `L0-core`、`L0-bus`、外部 MCP / A2A / API 来源、`L1-governance`、`L3-method-library`。
- 正式下游和消费对象应包括 `L2-runtime`、`L2-tools`、`L0-sdk`,以及条件 / 外围消费方 `L5-console`、`L6-marketplace`、`L4-observability`。
- 主图不能超过关键对象数量,因此应把 `L0-core / L0-bus`、`L2-runtime / L2-tools` 等语义相近对象在图中收缩,再在表中展开。
- secret / KMS / Vault、finance / billing、external provider runtime、marketplace transaction、observability store、PostgreSQL、cache、outbox 等相关但不构成当前正式上下文对象;它们只能作为后续配置、横切、技术选型或 historical risk。

诊断:

- 旧系统上下文图把 runtime / tools / external developers、providers、KMS/Vault、marketplace 和本仓内部 `MCP Registry / A2A Directory / Provider Contract / Cost Accounting` 放在同一层,混淆正式上下文对象、内部子域、运行设施和历史职责。
- 旧图中的 `providers Anthropic etc` 容易把外部 API 来源误读为 provider runtime 或 LLM routing;新版必须用“外部 MCP / A2A / API 来源”表达接入对象,不表达调用执行。
- 旧图中的 KMS/Vault 和 cost accounting 会把 secret 平台和财务账本重新画入系统主线,与 Step 2 / Step 3 非目标冲突。
- `L3-method-library` 和 `L1-governance` 必须进入上下文边界,但只能作为 method asset ref / governance result ref / safe summary 的关系对象,不能被画成本仓内部模块。

取舍:

- 主图采用 1 个中心仓 + 6 个关键上下文对象: `L0-core / L0-bus`、外部 MCP / A2A / API 来源、`L1-governance`、`L3-method-library`、`L2-runtime / L2-tools`、`L0-sdk`。
- `L5-console`、`L6-marketplace`、`L4-observability` 不进入主图,但进入上下游表和边界说明,避免候选 / 外围关系视觉上升级为核心依赖。
- secret / KMS / Vault、finance / billing、external provider runtime 和历史技术设施不进入系统上下文对象表,只在 excluded / historical audit 中说明。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只选择正式上下文对象 | pass | 主图对象均为内部仓、外部能力或正式消费边界。 |
| 是否避免角色和文档来源 | pass | 未把用户角色、README、旧文档、需求章节画入图。 |
| 是否避免实现设施 | pass | 未把 PostgreSQL、cache、outbox、KMS/Vault、provider client 作为主图对象。 |
| 是否可进入“上下文对象裁剪:再写入” | pass | 可转成正式上下文对象分层表。 |

### 4.2 上下文对象裁剪:再写入

| 对象 / 对象组 | 图中处理 | 上下文定位 | 当前边界 |
|---|---|---|---|
| `L0-core` | 与 `L0-bus` 收缩为关键基础对象 | 共享契约、基础引用和跨仓一致性基线来源 | 唯一内部编译期依赖候选;不让本仓自定义跨仓基础契约。 |
| `L0-bus` | 与 `L0-core` 收缩为关键基础对象 | 能力接入事实变化的事件协作通道 | 只做协作通道,不拥有 access truth。 |
| 外部 MCP / A2A / API 来源 | 主图关键输入 / 依赖对象 | 外部能力接入对象来源 | 提供接入对象语境,不代表本仓执行外部调用或拥有 provider runtime。 |
| `L1-governance` | 主图关键相邻仓 | governance result ref / policy result ref / safe summary 的正式接缝 | 本仓不生成 approval、Policy effective fact 或 shared_rules truth。 |
| `L3-method-library` | 主图关键相邻仓 | method asset ref 和 body-free relation 的定义来源边界 | 本仓不保存 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本。 |
| `L2-runtime` / `L2-tools` | 主图关键输出 / 消费对象 | 执行侧和工具侧消费 formal exposure、descriptor 与 consumer view | 本仓不拥有 runtime loop、tools execution、provider lookup、allow / deny enforcement。 |
| `L0-sdk` | 主图关键输出 / 入口对象 | 官方客户端封装服务端能力边界的消费方 | 本仓拥有服务端 exposure boundary,不拥有 SDK client、package 或 language binding。 |
| `L5-console` | 表中外围入口对象 | 管理体验和只读浏览候选入口 | 不进入核心闭环前置,不拥有 UI / console 状态 truth。 |
| `L6-marketplace` | 表中外围消费对象 | 只读生态发现候选消费方 | 不拥有 listing、transaction、pricing、fulfillment。 |
| `L4-observability` | 表中外围协作对象 | 观测 / 审计 safe summary 和 ref 的消费 / 协作方 | 不拥有本仓业务 truth;本仓不拥有 log、trace、metric、alert、audit store。 |

### 4.3 输入 / 依赖上下文:先思考

问题回答:

- `L0-core` 提供共享契约、基础引用和跨仓一致性基线,是 capability identity、registry 引用和跨仓 access fact 表达的基础。
- `L0-bus` 提供变化协作边界,但其关系是事件协作而不是 business source truth。
- 外部 MCP / A2A / API 来源提供被识别、登记、描述和治理接缝引用的接入对象语境;本仓不因此拥有外部系统正文、认证协议或 provider runtime。
- `L1-governance` 提供 governance result ref / policy result ref / allowed safe summary,并可能接收能力接入反馈线索;本仓不得补造 approval 或 Policy。
- `L3-method-library` 提供 method asset ref / 定义来源边界,本仓只建立 body-free relation,不得复制 method body。

诊断:

- 如果把外部 MCP / A2A / API 写成“provider execution dependency”,后续容器和交互会自然加入 retry、failover、routing 和 invocation result。
- 如果把 `L1-governance` 写成“policy cache / whitelist source”,旧 QueryCapabilities 与 Policy 30s 会回流。
- 如果把 `L3-method-library` 写成源码或正文依赖,会破坏 method asset truth owner。

取舍:

- 输入 / 依赖对象全部写成能力面和 ref / summary 边界,不写接口名或协议。
- `secret / KMS / Vault` 不作为 Step 4 正式上下文对象;secret ref 和 safe summary 只作为后续数据 / 横切 / 配置边界继续审计。
- 外部 provider runtime / failover backend 不进入输入 / 依赖上下文,避免执行职责回流。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖关键上游 | pass | `L0-core`、`L0-bus`、外部来源、governance、method-library 均覆盖。 |
| 是否保护 truth owner | pass | 每个输入均限定为契约、协作、ref、safe summary 或外部来源语境。 |
| 是否避免协议 / DTO | pass | 未写 API path、event name、RPC、schema、字段或状态。 |
| 是否可进入“输入 / 依赖上下文:再写入” | pass | 可转成上下游表项。 |

### 4.4 输入 / 依赖上下文:再写入

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、基础引用和跨仓一致性基线 | capability identity、registry 引用和 access fact 需要稳定基础表达;本仓不得自造 L0 契约。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 能力接入事实变化的协作通道 | 变化输出和外部变化输入通过协作边界表达;bus 不拥有 access truth。 |
| 外部 MCP / A2A / API 来源 | 输入 / 依赖 | 来源 | 外部能力接入对象、能力类型和外部连接语境 | 这些对象支撑 identity、registry 和 descriptor,但本仓不执行外部调用。 |
| `L1-governance` | 输入 / 输出 | 治理依赖 | governance result ref、policy result ref、允许 safe summary 和能力接入反馈线索 | 本仓维护 seam relation,不拥有 approval、Policy effective fact 或 shared_rules truth。 |
| `L3-method-library` | 输入 / 输出 | 来源 / 消费 | method asset ref 与 capability-method body-free relation 语境 | 本仓维护 relation truth,不保存 method body 或 definition source truth。 |

### 4.5 输出 / 消费上下文:先思考

问题回答:

- `L2-runtime` 和 `L2-tools` 是最主要执行 / 工具侧消费者,消费 capability identity、registry、adapter descriptor、formal exposure、controlled consumer view 和变化感知;它们不得反写 access truth。
- `L0-sdk` 消费服务端 formal exposure boundary,并封装官方 client;本仓不拥有 SDK client、language package 或 local candidate。
- `L5-console` 可以作为管理入口和只读浏览体验消费本仓事实,但 UI 状态不属于本仓系统上下文主链。
- `L6-marketplace` 只可能只读消费生态发现摘要或 ref,不得把 listing / transaction / pricing / fulfillment 写成本仓输出 truth。
- `L4-observability` 可以消费能力变化、安全摘要或审计友好输出,但本仓不拥有物理观测存储。

诊断:

- 下游消费对象容易让 `controlled consumer view` 变成 runtime allow / deny decision;Step 4 必须写清 consumer view 是输出面,不是 truth owner。
- SDK exposure 容易被误写成 SDK client 设计;Step 4 只表达服务端能力边界被 SDK 消费。
- Console / marketplace / observability 是相关但外围,不能因为它们会消费数据就成为核心上下文图对象。

取舍:

- 主图只保留 `L2-runtime / L2-tools` 和 `L0-sdk` 两个关键消费组。
- 表中列出 `L5-console`、`L6-marketplace`、`L4-observability`,并明确外围 / 只读 / safe summary 口径。
- 不写下游具体读取方式、缓存方式、事件订阅方式或测试证据格式。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖主要下游 | pass | runtime、tools、SDK 三个主消费面覆盖。 |
| 是否记录外围消费 | pass | console、marketplace、observability 在表中记录但不进主图。 |
| 是否防止消费反写 | pass | 每类消费均声明不得反向定义 access truth。 |
| 是否可进入“输出 / 消费上下文:再写入” | pass | 可转成上下游表项。 |

### 4.6 输出 / 消费上下文:再写入

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L2-runtime` | 输出 / 输入 | 消费 | formal exposure、controlled consumer view、descriptor 摘要、变化感知和消费影响反馈 | Runtime 消费正式接入事实,不拥有 runtime execution、provider lookup 或 allow / deny enforcement truth。 |
| `L2-tools` | 输出 / 输入 | 消费 | MCP / A2A / API 能力接入事实、formal exposure、受控消费边界和工具侧反馈线索 | Tools 消费能力接入事实,不拥有 tool execution truth 或工具结果正文。 |
| `L0-sdk` | 输出 | 入口 / 消费 | 服务端 formal exposure boundary、只读消费语义和 SDK exposure 边界 | SDK 封装官方 client,但 SDK client、多语言 package 和 developer experience 不归本仓。 |
| `L5-console` | 输出 | 入口 | 管理入口、只读浏览和人工维护体验候选 | Console 消费或显化 access truth,不拥有 UI 状态或产品工作流 truth。 |
| `L6-marketplace` | 输出 | 消费 | 只读生态发现摘要或 marketplace ecosystem object ref 候选 | Marketplace 只读发现不得变成 listing、交易、定价、购买或履约 truth。 |
| `L4-observability` | 输入 / 输出 | 来源 / 消费 | 业务变化摘要、安全摘要、observability / audit ref 和审计友好输出候选 | Observability 可消费摘要或提供引用,但 log、trace、metric、alert、audit store 不归本仓。 |

### 4.7 图和失效口径:先思考

问题回答:

- 主图应以 `L3-capability-hub` 为中心,上方放基础输入 / 依赖和外部能力来源,左右放 governance / method-library 关系边界,下方放主要消费边界。
- 关系类型只能写输入、输出、依赖;图中不得写查询、变更、事件输出、事件输入、后台任务、订阅、RPC 或 API 名。
- 依赖失效口径应围绕 truth owner:基础契约缺失时不自造类型;外部来源不可用时不补造能力事实;governance 不可用时不自造 approval;method-library 不可用时不复制正文;下游不可用时不改变 formal exposure。

诊断:

- 如果失效口径写成旧 SLA / retry / cache / failover,会提前进入容器、运行时或 NFR 细节。
- 如果治理不可用时写“last-known-good capability cache”,会把 Policy truth 和 runtime decision 带回本仓。
- 如果外部 API 不可用时写 provider failover,会把 provider runtime 写回 Step 4。

取舍:

- 失效口径使用“挂起、标记 unresolved、延迟消费、保留现有 truth、不得补造相邻 truth”的架构边界语言。
- 不写缓存策略、重试次数、fallback、SLA 或恢复机制。
- 图后说明按规范保留 2~5 条,并补标准句。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 图对象数量是否受控 | pass | 1 个中心仓 + 6 个关键上下文对象。 |
| 图关系是否只写三类 | pass | 只使用输入、输出、依赖和输入 / 输出。 |
| 是否包含失效口径 | pass | 已按对象给出 truth-preserving 降级口径。 |
| 是否可进入“图和失效口径:再写入” | pass | 可形成结构化中间产物。 |

### 4.8 图和失效口径:再写入

#### 4.8.1 系统上下文图

```text
+----------------------------+       +----------------------------+
| L0-core / L0-bus          |       | External MCP / A2A / API   |
| shared and event base     |       | capability sources         |
+-------------+--------------+       +--------------+-------------+
              |                                     |
              | 输入 / 依赖                         | 输入 / 依赖
              v                                     v

+----------------------------+   +----------------------------+   +----------------------------+
| L1-governance              |<->| L3-capability-hub          |<->| L3-method-library          |
| governance result seam     |   | capability access truth    |   | method asset relation      |
+----------------------------+   +-------------+--------------+   +----------------------------+
                                                |
                                                | 输出
                                                v
                         +----------------------+----------------------+
                         |                                             |
                         v                                             v
              +----------+-------------+                 +-------------+----------+
              | L2-runtime / L2-tools  |                 | L0-sdk                |
              | execution consumers    |                 | SDK exposure consumer |
              +------------------------+                 +-----------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L3-capability-hub` 位于外部能力来源、governance、method-library 与下游执行 / 工具 / SDK 消费之间,中心职责是 capability access truth。
- `L0-core / L0-bus` 是共享契约和事件协作基础,不是本仓业务 truth 的替代来源。
- 外部 MCP / A2A / API 是接入对象来源,不是 provider runtime、retry / failover、secret 或生产请求 / 响应正文来源。
- `L1-governance` 与 `L3-method-library` 是正式接缝对象,分别通过治理结果引用 / 安全摘要和 body-free method relation 协作。
- `L2-runtime`、`L2-tools` 与 `L0-sdk` 是主要消费边界,不得反向定义 identity、registry、descriptor、seam、relation 或 formal exposure。

#### 4.8.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、基础引用和跨仓一致性基线 | capability identity、registry 引用和 access fact 需要稳定基础表达;本仓不得自造 L0 契约。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 能力接入事实变化的协作通道 | 变化输出和外部变化输入通过协作边界表达;bus 不拥有 access truth。 |
| 外部 MCP / A2A / API 来源 | 输入 / 依赖 | 来源 | 外部能力接入对象、能力类型和外部连接语境 | 这些对象支撑 identity、registry 和 descriptor,但本仓不执行外部调用。 |
| `L1-governance` | 输入 / 输出 | 治理依赖 | governance result ref、policy result ref、允许 safe summary 和能力接入反馈线索 | 本仓维护 seam relation,不拥有 approval、Policy effective fact 或 shared_rules truth。 |
| `L3-method-library` | 输入 / 输出 | 来源 / 消费 | method asset ref 与 capability-method body-free relation 语境 | 本仓维护 relation truth,不保存 method body 或 definition source truth。 |
| `L2-runtime` | 输出 / 输入 | 消费 | formal exposure、controlled consumer view、descriptor 摘要、变化感知和消费影响反馈 | Runtime 消费正式接入事实,不拥有 runtime execution、provider lookup 或 allow / deny enforcement truth。 |
| `L2-tools` | 输出 / 输入 | 消费 | MCP / A2A / API 能力接入事实、formal exposure、受控消费边界和工具侧反馈线索 | Tools 消费能力接入事实,不拥有 tool execution truth 或工具结果正文。 |
| `L0-sdk` | 输出 | 入口 / 消费 | 服务端 formal exposure boundary、只读消费语义和 SDK exposure 边界 | SDK 封装官方 client,但 SDK client、多语言 package 和 developer experience 不归本仓。 |
| `L5-console` | 输出 | 入口 | 管理入口、只读浏览和人工维护体验候选 | Console 消费或显化 access truth,不拥有 UI 状态或产品工作流 truth。 |
| `L6-marketplace` | 输出 | 消费 | 只读生态发现摘要或 marketplace ecosystem object ref 候选 | Marketplace 只读发现不得变成 listing、交易、定价、购买或履约 truth。 |
| `L4-observability` | 输入 / 输出 | 来源 / 消费 | 业务变化摘要、安全摘要、observability / audit ref 和审计友好输出候选 | Observability 可消费摘要或提供引用,但 log、trace、metric、alert、audit store 不归本仓。 |

#### 4.8.3 依赖失效降级口径

| 对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | 共享契约、基础引用或跨仓一致性基线不可用 | 不得自行补造基础 ID、错误、trace、引用或契约语义;相关正式变更应挂起或标记 unresolved。 |
| `L0-bus` | 事件协作通道不可用 | 已成立的 access truth 不因协作通道失效而改变;变化传播、外部感知和消费通知可延迟,不得让 bus 成为 truth 写源。 |
| 外部 MCP / A2A / API 来源 | 外部来源不可访问、语境不足或对象不可验证 | 新建或更新 identity / registry / descriptor 应保持草稿、候选或 unresolved;不得用 provider runtime、URL 或临时配置补造正式能力事实。 |
| `L1-governance` | governance result ref 或 safe summary 暂不可解析 | 依赖治理结果的 formal exposure / visibility 进入 pending 或 unresolved;不得由 access review fact、本地目录状态或缓存替代 approval / Policy truth。 |
| `L3-method-library` | method asset ref 暂不可解析 | capability-method relation 变更或读取应挂起、标记引用未闭合或降级为不可解释;不得复制 method body 或 definition source truth。 |
| `L2-runtime` / `L2-tools` | 下游执行或工具消费不可用 | 只影响消费、反馈或影响摘要;不得因此改变本仓 formal exposure、registry 或 descriptor truth。 |
| `L0-sdk` | SDK 封装或客户端消费不可用 | 服务端 exposure boundary 仍归本仓;SDK client、language package 或 local candidate 不得反向定义能力边界。 |
| `L5-console` / `L6-marketplace` | 管理入口、只读生态发现或产品入口不可用 | 只影响外围体验或生态发现;不得阻塞 C-CH-1~C-CH-5 核心闭环,也不得生成 listing / UI 状态 truth。 |
| `L4-observability` | 观测、审计消费或外部引用不可用 | 本仓保留 access traceability 和 safe summary 边界;不接管 log、trace、metric、alert、audit store 或 cost ledger 正文。 |

#### 4.8.4 边界说明结论

`L3-capability-hub` 的系统上下文围绕“外部能力来源输入、基础契约与事件协作、治理 / 方法关系接缝、下游正式消费”四类关系展开。主图只保留能决定 capability access truth 成立和被正式消费的关键对象;`L5-console`、`L6-marketplace`、`L4-observability` 作为外围入口、只读发现或审计协作记录在表中,但不成为核心闭环前置。secret / KMS / Vault、finance / billing、external provider runtime、PostgreSQL、cache、outbox 和旧 Provider Contract / Cost Accounting 只作为历史冲突或后续配置 / 技术候选,不构成当前系统上下文主语。本章只定义系统边界和输入 / 输出面,不定义接口名、事件名、DTO、状态、存储、容器或实现依赖。

---

## 5. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| README “能力池 / MCP / A2A / Provider 接入” | 外部能力需要统一接入语境、identity、registry 和 descriptor。 | 把 MCP、A2A、Provider、LLM routing、cost、secret、policy 和 runtime 调用合并成统一执行入口。 | 重裁为外部 MCP / A2A / API 来源输入和 capability access truth 中心。 |
| 旧 `01` §4 系统上下文图 | runtime / tools、governance、providers、marketplace 都可能与本仓存在上下文关系。 | 图中把 KMS/Vault、providers、marketplace、cost、Policy-aware query 和本仓内部旧子域混画。 | 主图仅保留关键正式对象;外围消费放表中;技术设施和旧职责后移或废弃。 |
| 旧 `MCP Registry / A2A Directory` | MCP / A2A 类能力需要接入身份和注册目录。 | 将 protocol 类别直接当内部子域或外部执行上下文。 | 后续 Step 5 从 capability access truth 推导内部语义结构,不继承旧协议子域。 |
| 旧 `Provider Contract` | 外部 API / provider API surface 需要接入描述。 | API key、quota、route、cost、failover、retry、provider runtime 被并入上下文。 | 重裁为外部 API 来源和 adapter descriptor 边界;secret / runtime / cost 不入系统上下文主线。 |
| 旧 `QueryCapabilities / Access Decision` | 下游 runtime / tools 需要消费正式能力边界。 | QueryCapabilities、allow / deny、policy cache、runtime provider lookup 作为系统上下文主线。 | 重裁为 formal exposure 和 controlled consumer view 输出面;不代表执行裁决。 |
| 旧 `Cost Accounting / CostRecord` | 外部能力可能存在成本审计背景。 | cost record、billing、finance ledger、cost event 成为 capability-hub 上下文和职责。 | 作为 historical conflict;不进入系统上下文对象或能力面。 |
| 旧 KMS/Vault 外部依赖 | descriptor 需要保护 secret 边界。 | KMS / Vault、key management、secret lifecycle 作为本仓主上下文。 | 后续只允许 secret ref / safe summary 审计;Step 4 不画入主图或表。 |
| 旧 PostgreSQL / cache / outbox / cost worker | 可作为后续技术选型历史线索。 | 技术设施提前成为系统上下文和容器结论。 | 后续 Step 6 / 10 / 12 重新论证,当前不作为系统上下文对象。 |

---

## 6. 结构化中间产物

### 6.1 系统上下文图

```text
+----------------------------+       +----------------------------+
| L0-core / L0-bus          |       | External MCP / A2A / API   |
| shared and event base     |       | capability sources         |
+-------------+--------------+       +--------------+-------------+
              |                                     |
              | 输入 / 依赖                         | 输入 / 依赖
              v                                     v

+----------------------------+   +----------------------------+   +----------------------------+
| L1-governance              |<->| L3-capability-hub          |<->| L3-method-library          |
| governance result seam     |   | capability access truth    |   | method asset relation      |
+----------------------------+   +-------------+--------------+   +----------------------------+
                                                |
                                                | 输出
                                                v
                         +----------------------+----------------------+
                         |                                             |
                         v                                             v
              +----------+-------------+                 +-------------+----------+
              | L2-runtime / L2-tools  |                 | L0-sdk                |
              | execution consumers    |                 | SDK exposure consumer |
              +------------------------+                 +-----------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L3-capability-hub` 位于外部能力来源、governance、method-library 与下游执行 / 工具 / SDK 消费之间,中心职责是 capability access truth。
- `L0-core / L0-bus` 是共享契约和事件协作基础,不是本仓业务 truth 的替代来源。
- 外部 MCP / A2A / API 是接入对象来源,不是 provider runtime、retry / failover、secret 或生产请求 / 响应正文来源。
- `L1-governance` 与 `L3-method-library` 是正式接缝对象,分别通过治理结果引用 / 安全摘要和 body-free method relation 协作。
- `L2-runtime`、`L2-tools` 与 `L0-sdk` 是主要消费边界,不得反向定义 identity、registry、descriptor、seam、relation 或 formal exposure。

### 6.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、基础引用和跨仓一致性基线 | capability identity、registry 引用和 access fact 需要稳定基础表达;本仓不得自造 L0 契约。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 能力接入事实变化的协作通道 | 变化输出和外部变化输入通过协作边界表达;bus 不拥有 access truth。 |
| 外部 MCP / A2A / API 来源 | 输入 / 依赖 | 来源 | 外部能力接入对象、能力类型和外部连接语境 | 这些对象支撑 identity、registry 和 descriptor,但本仓不执行外部调用。 |
| `L1-governance` | 输入 / 输出 | 治理依赖 | governance result ref、policy result ref、允许 safe summary 和能力接入反馈线索 | 本仓维护 seam relation,不拥有 approval、Policy effective fact 或 shared_rules truth。 |
| `L3-method-library` | 输入 / 输出 | 来源 / 消费 | method asset ref 与 capability-method body-free relation 语境 | 本仓维护 relation truth,不保存 method body 或 definition source truth。 |
| `L2-runtime` | 输出 / 输入 | 消费 | formal exposure、controlled consumer view、descriptor 摘要、变化感知和消费影响反馈 | Runtime 消费正式接入事实,不拥有 runtime execution、provider lookup 或 allow / deny enforcement truth。 |
| `L2-tools` | 输出 / 输入 | 消费 | MCP / A2A / API 能力接入事实、formal exposure、受控消费边界和工具侧反馈线索 | Tools 消费能力接入事实,不拥有 tool execution truth 或工具结果正文。 |
| `L0-sdk` | 输出 | 入口 / 消费 | 服务端 formal exposure boundary、只读消费语义和 SDK exposure 边界 | SDK 封装官方 client,但 SDK client、多语言 package 和 developer experience 不归本仓。 |
| `L5-console` | 输出 | 入口 | 管理入口、只读浏览和人工维护体验候选 | Console 消费或显化 access truth,不拥有 UI 状态或产品工作流 truth。 |
| `L6-marketplace` | 输出 | 消费 | 只读生态发现摘要或 marketplace ecosystem object ref 候选 | Marketplace 只读发现不得变成 listing、交易、定价、购买或履约 truth。 |
| `L4-observability` | 输入 / 输出 | 来源 / 消费 | 业务变化摘要、安全摘要、observability / audit ref 和审计友好输出候选 | Observability 可消费摘要或提供引用,但 log、trace、metric、alert、audit store 不归本仓。 |

### 6.3 依赖失效降级口径

| 对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | 共享契约、基础引用或跨仓一致性基线不可用 | 不得自行补造基础 ID、错误、trace、引用或契约语义;相关正式变更应挂起或标记 unresolved。 |
| `L0-bus` | 事件协作通道不可用 | 已成立的 access truth 不因协作通道失效而改变;变化传播、外部感知和消费通知可延迟,不得让 bus 成为 truth 写源。 |
| 外部 MCP / A2A / API 来源 | 外部来源不可访问、语境不足或对象不可验证 | 新建或更新 identity / registry / descriptor 应保持草稿、候选或 unresolved;不得用 provider runtime、URL 或临时配置补造正式能力事实。 |
| `L1-governance` | governance result ref 或 safe summary 暂不可解析 | 依赖治理结果的 formal exposure / visibility 进入 pending 或 unresolved;不得由 access review fact、本地目录状态或缓存替代 approval / Policy truth。 |
| `L3-method-library` | method asset ref 暂不可解析 | capability-method relation 变更或读取应挂起、标记引用未闭合或降级为不可解释;不得复制 method body 或 definition source truth。 |
| `L2-runtime` / `L2-tools` | 下游执行或工具消费不可用 | 只影响消费、反馈或影响摘要;不得因此改变本仓 formal exposure、registry 或 descriptor truth。 |
| `L0-sdk` | SDK 封装或客户端消费不可用 | 服务端 exposure boundary 仍归本仓;SDK client、language package 或 local candidate 不得反向定义能力边界。 |
| `L5-console` / `L6-marketplace` | 管理入口、只读生态发现或产品入口不可用 | 只影响外围体验或生态发现;不得阻塞 C-CH-1~C-CH-5 核心闭环,也不得生成 listing / UI 状态 truth。 |
| `L4-observability` | 观测、审计消费或外部引用不可用 | 本仓保留 access traceability 和 safe summary 边界;不接管 log、trace、metric、alert、audit store 或 cost ledger 正文。 |

### 6.4 边界说明结论

`L3-capability-hub` 的系统上下文围绕“外部能力来源输入、基础契约与事件协作、治理 / 方法关系接缝、下游正式消费”四类关系展开。主图只保留能决定 capability access truth 成立和被正式消费的关键对象;`L5-console`、`L6-marketplace`、`L4-observability` 作为外围入口、只读发现或审计协作记录在表中,但不成为核心闭环前置。secret / KMS / Vault、finance / billing、external provider runtime、PostgreSQL、cache、outbox 和旧 Provider Contract / Cost Accounting 只作为历史冲突或后续配置 / 技术候选,不构成当前系统上下文主语。本章只定义系统边界和输入 / 输出面,不定义接口名、事件名、DTO、状态、存储、容器或实现依赖。

---

## 7. 回填草稿

正式 `01-架构设计.md` 后续 Step 16 装配时:

| 正式章节 | 回填来源 | 回填口径 |
|---|---|---|
| §5.1 系统上下文图 | 本文件 §6.1 | 直接整理系统上下文图和图示说明;不得加入接口名、事件名、运行组件或旧四子域。 |
| §5.2 上下游与输入 / 输出面表 | 本文件 §6.2 | 直接整理上下游表;若篇幅需要,可将外围对象标注为表中关系,不放入主图。 |
| §5.3 边界说明 | 本文件 §6.4 | 保留 3~5 句短文,说明主图裁剪和外围对象处理。 |
| §14 风险或 §12 横切关注点候选 | 本文件 §6.3 | 可摘录依赖失效降级口径,但不得改写成 SLA、重试、缓存或 provider failover。 |

不得在 Step 16 之外提前修改正式 `01-架构设计.md`。

---

## 8. 自检与停审

### 8.1 完成标准自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确本仓在全局系统中的位置 | pass | 本仓定位为 L3 capability access truth owner,位于外部能力来源、governance / method relation 和下游消费之间。 |
| 是否画出正式上下文对象图 | pass | 图中只出现本仓、内部仓、外部能力来源和正式消费对象。 |
| 是否解释上下游与输入 / 输出面 | pass | §6.2 表覆盖输入、依赖、输出、入口、外围消费和协作对象。 |
| 是否补充边界说明 | pass | §6.4 解释主图对象、外围对象和排除对象。 |
| 是否包含依赖失效口径 | pass | §6.3 按对象给出不破坏 truth owner 的降级口径。 |
| 是否避免内部结构 / 协议 / 实现细节 | pass | 未写限界上下文、子域、容器、API、DTO、event schema、state、storage、repository、outbox 或技术选型。 |
| 是否阻止旧材料回流 | pass | 旧 Provider Contract、Cost Accounting、KMS/Vault、QueryCapabilities、SLA、PostgreSQL/cache/outbox 均已作为 historical conflict 处理。 |

### 8.2 当前 blocker 判断

| blocker | 状态 | 判断 |
|---|---|---|
| 上游需求 blocker | none | 正式 `00`、Step 1~3 足以支撑系统上下文。 |
| 旧材料冲突 | not_blocking | 冲突已记录为 historical material,未作为新版上下文基线。 |
| 未闭口事项 | not_blocking_step_05 | governance seam 字段、method relation 摘要、descriptor 分类、SDK 交接、API / DTO / state / boundary 后续继续闭口,不阻塞 Step 5。 |

### 8.3 下一步门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 `系统边界与上下文` completed_stop_review |
| 当前正式文档 | `01-架构设计.md` 未修改;必须等 Step 16 装配 |
| next_allowed_action | `wait_user_review_to_step_05` |
| 下一步应读 | `架构设计讨论流程_SOP.md` Step 5;`架构设计书写规范.md` §4.6;本文件;`01_arch_step_01~03`;正式 `00-需求文档.md`;参考项目 Step 5 |

当前不需要提交 commit。
