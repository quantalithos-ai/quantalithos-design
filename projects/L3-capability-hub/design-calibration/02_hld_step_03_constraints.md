# L3-capability-hub 02 概要 Step 3: 收稳约束条件

> 创建日期: 2026-07-08
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 只收稳会影响概要结构判断的硬约束;不重写需求 / 架构,不继承旧 `02` 的 ProviderContract、CapabilityDecision、CostRecord、KMS / Vault、QueryCapabilities、policy refresh、allow / deny 或 execution gateway 主线。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 收稳约束条件 |
| 输出文件 | `design-calibration/02_hld_step_03_constraints.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_01_upstream_boundary.md`;`design-calibration/02_hld_step_02_goals_scope.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 3;`概要设计书写规范.md` §4.3 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` 的 `02` Step 3 中间产物 |
| 旧材料处理 | 旧 `02-概要设计.md` 只作后置差异审计,不作为当前约束来源 |
| 进入条件 | pass |
| next_allowed_action | Step 3 已完成,等待用户确认后进入 Step 4。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | Step 3 输出结构 | pass | 进入上游承接约束思考。 |
| 上游承接约束:先思考 | done | 需求 / 架构已收稳边界判断 | pass | 进入上游承接约束写入。 |
| 上游承接约束:再写入 | done | 上游承接约束表 | pass | 进入数据归属约束思考。 |
| 数据归属 / forbidden body 约束:先思考 | done | truth / snapshot / ref / relation / forbidden body 判断 | pass | 进入数据归属约束写入。 |
| 数据归属 / forbidden body 约束:再写入 | done | 数据归属与禁止正文约束表 | pass | 进入接缝与依赖约束思考。 |
| 接缝与依赖约束:先思考 | done | governance / method / SDK / runtime / tools / 外围协作边界判断 | pass | 进入接缝与依赖约束写入。 |
| 接缝与依赖约束:再写入 | done | 接缝、依赖与消费边界约束表 | pass | 进入交互一致性约束思考。 |
| 交互 / 一致性 / 失败约束:先思考 | done | 同步 / 异步 / 后台、强一致 / 最终一致和显式失败判断 | pass | 进入交互约束写入。 |
| 交互 / 一致性 / 失败约束:再写入 | done | 交互、一致性和失败语义约束表 | pass | 进入表达深度与配置约束思考。 |
| 表达深度 / 配置 / 待确认约束:先思考 | done | 概要层不得下沉和 open question 保守承接口径 | pass | 进入表达深度约束写入。 |
| 表达深度 / 配置 / 待确认约束:再写入 | done | 表达深度、配置和待确认约束表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 差异审计表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 完成门禁 | pass | 等待用户确认 Step 4。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 3 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 3 | Step 3 只从上游输入、设计目标和非范围中提炼影响对象、接口、处理流或状态机的硬约束。 | 本 Step 不复述架构全文,不写泛化工程原则、数据库约束、部署约束或实现策略。 |
| `standards/document/概要设计书写规范.md` §4.3 | 正式约束表固定使用 `约束 / 作用范围 / 当前要求`,短文只说明层次边界。 | 本 Step 的主产物采用三列表,并保留 §3 回填草稿。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` | Step 1 已确认 `02` 只承接新版 `00/01`,旧 `02` 和 README 只作 historical material。 | 约束必须围绕 capability identity、registry、descriptor、governance seam、method relation、formal exposure / controlled consumer view 和 traceability / impact。 |
| `design-calibration/02_hld_step_02_goals_scope.md` | Step 2 已明确当前概要停在可实现结构骨架,排除 runtime execution、tools execution、governance truth、method body、SDK client、marketplace、secret / KMS、cost / billing 和 observability store。 | Step 3 必须把这些范围边界转成后续 Step 4~11 的门禁约束。 |
| `projects/L3-capability-hub/00-需求文档.md` | 正式需求已把本仓定义为外部 MCP / A2A / API capability access truth 仓,并通过 `C-CH-1~5`、`FR-CH-001~016`、业务规则、数据归属、接口依赖、NFR、验收和风险固定边界。 | 约束应覆盖 identity、registry、descriptor、governance / method seam、formal exposure、派生维护和 forbidden body。 |
| `projects/L3-capability-hub/01-架构设计.md` | 正式架构已收稳独立 capability access truth、formal intake boundary、truth / snapshot / ref / forbidden body、`L0-core` 唯一编译期依赖、同步 / 异步 / 后台分层和外围增强隔离。 | 约束必须能够直接指导代码主体框架、主要组成部分、对象、接口、flow、状态和配置影响判断。 |
| 旧 `projects/L3-capability-hub/02-概要设计.md` | 旧文档以 ProviderContract、CapabilityDecision、CostRecord、KMS / Vault、QueryCapabilities 和 execution gateway 组织概要主线。 | 只作为污染检查输入;旧对象名、旧查询名、旧指标和旧实现机制不得作为当前约束来源。 |

---

## 3. 整体模块骨架

| 模块 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 上游承接约束 | 把 `00/01` 已收稳的 truth owner、核心轴线、非目标和未闭口项转成概要结构约束。 | 不重开需求目标、架构职责边界或方案取舍。 |
| 数据归属 / forbidden body 约束 | 固定 truth、snapshot、ref、relation、derived view 和 forbidden body 的概要边界。 | 不定义完整对象字段、存储表、索引、repository 或持久化 schema。 |
| 接缝与依赖约束 | 固定 `L0-core` 编译期依赖、sibling 协作方式、governance seam、method relation、SDK exposure 和外围只读边界。 | 不定义 API / DTO / event payload / port trait / adapter 实现。 |
| 交互 / 一致性 / 失败约束 | 固定同步裁定、异步传播、后台派生和失败显式表达。 | 不写 outbox、retry、job schema、错误码或完整状态矩阵。 |
| 表达深度 / 配置 / 待确认约束 | 固定概要层深度、禁止配置化边界和 open question 保守处理口径。 | 不把配置 key、测试证据、验收门禁或实施 commit 边界写进 02。 |
| 旧材料差异 | 标记旧约束和旧对象主线不得继承的原因。 | 不从旧材料补当前缺口。 |

---

## 4. 模块思考记录

### 4.1 上游承接约束:先思考

问题回答:

- 本 Step 必须先把 `00/01` 已经收稳的核心不变量转成概要层硬约束:本仓是 capability access truth owner,核心轴线是 identity、registry、adapter descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view 和 traceability / impact。
- 这些约束直接影响后续代码主体如何切分、主要组成部分是否越权、对象是否属于本仓 truth、接口是否写成执行 / 治理 / SDK / marketplace 通道、处理流是否混入 runtime 或 tool execution。
- 概要设计不能把 Step 1 / Step 2 保留为待确认的 seam field、relation summary、descriptor taxonomy、secret safe summary、SDK handoff、外围只读接缝和量化指标直接定稿。

诊断:

- 旧 `02` 的“统一能力接入中心”叙事容易把 access、execution、provider contract、governance policy、secret、cost 和 query view 混成一个中心化平台。
- 新版 `00/01` 已经把“能力接入真相”和“执行 / 治理 / 方法正文 / 客户端 / 交易 / 观测”等边界切开,Step 3 必须把这些切口转成可审查的后续门禁。

取舍:

- 采用“会影响后续结构判断”的约束集合。
- 不采用旧对象名、旧查询名、旧 KMS / cost / policy refresh / allow-deny 主线作为约束。

### 4.2 上游承接约束:再写入

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 只承接当前 `00/01` 已收稳结论 | 全部后续 Step、正式装配、风险与待确认 | `02` 只把新版需求和架构转成可实现结构骨架,不得用旧 README、旧 `02/03/05/06` 或历史对象名补当前结论。 |
| capability access truth owner 必须保持独立 | 代码主体框架、主要组成部分、对象轮廓、处理流 | 后续结构必须围绕能力接入 truth 展开,不得被 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret / KMS、cost / billing 或 observability store 吸收。 |
| 核心轴线必须保持可分 | 主要组成部分、对象候选池、接口骨架、状态轮廓 | capability identity、capability registry、adapter descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view、traceability / impact 不得被合并成单一 ProviderContract、QueryCapabilities 或 execution gateway 主语。 |
| 未闭口事项不得在 Step 3 局部定稿 | 后续对象、接口、配置、风险台账 | governance seam 字段、method relation 摘要强度、descriptor taxonomy、secret safe summary、SDK handoff、外围只读接缝、量化目标和 implementation boundary 只能保守承接,不得伪装成已定契约。 |

### 4.3 数据归属 / forbidden body 约束:先思考

问题回答:

- `00/01` 已经把本仓数据分成 truth、snapshot、ref、relation、derived view 和 forbidden body。Step 3 要把这组分层变成后续对象、接口、flow、状态和异常边界的硬门禁。
- 后续 Step 6 若不先有这些约束,关键对象很容易膨胀为同时保存 provider runtime、secret、method body、governance truth、SDK state、marketplace listing 和 observability audit store 的跨仓大对象。
- 后续 Step 7~10 也需要知道“读取 / 搜索 / 导出 / consumer view / maintenance / reconciliation”只能服务派生或维护,不能成为 truth 写源。

诊断:

- 旧 `02` 把 `ProviderContract` 写得接近 secret / quota / route / cost / failover 的混合承载,与新版 descriptor truth + secret ref / safe summary 边界冲突。
- 旧 `CapabilityDecision` / `QueryCapabilities` 容易把 formal exposure 与 consumer view 合并,导致查询视图反向变成第二 truth。

取舍:

- 保留数据分层和 forbidden body 清单作为硬约束。
- 不在本 Step 命名完整对象字段、状态枚举、存储模型或 projection schema。

### 4.4 数据归属 / forbidden body 约束:再写入

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| truth / snapshot / ref / relation / derived view 必须分层 | 关键对象、读取接口、处理流、状态、异常边界 | identity、registry、descriptor、seam relation、method relation、formal exposure 和 change / impact fact 才能作为本仓核心 truth;consumer view、search、browse、export、discovery、audit summary 只能是派生或快照。 |
| forbidden body 不得进入本仓 | 关键对象字段骨架、接口输入输出、事件、导出、异常处理 | governance approval / Policy / shared_rules truth、method body、secret 正文、provider runtime、runtime / tool execution payload、SDK client、marketplace transaction、cost / billing、observability store 和生产调用正文均不得保存为本仓对象或接口正文。 |
| adapter descriptor 不得退化为 Provider Contract | descriptor 对象、descriptor 写入 / 读取、配置影响 | descriptor 只能表达接入方式、能力类型、风险和约束摘要;不得承载 secret、KMS / Vault truth、quota、route、cost、failover、retry 或 provider runtime contract。 |
| formal exposure 与 controlled consumer view 必须分层 | 暴露对象、查询接口、consumer view、SDK handoff、状态传播 | 服务端 formal exposure 属于本仓 truth;runtime、tools、SDK、search、browse 和 query view 只能消费或派生,不得反写 exposure truth。 |
| 派生维护不得创造新业务结论 | maintenance、reconciliation、search / export、audit-friendly handoff | 后台任务只能基于正式 truth、正式 ref 或允许 safe summary 重建派生材料,不得根据下游消费状态、观测记录或外部目录补造接入事实。 |

### 4.5 接缝与依赖约束:先思考

问题回答:

- 全局依赖裁剪和 `01` 已经明确 `L0-core` 是唯一编译期依赖候选,其他 sibling 必须通过运行期、事件、ref、safe summary、relation、controlled view 或外部接缝协作。
- governance seam、method relation 和 SDK exposure 是本仓必须支撑的接缝,但它们不能成为治理 truth、方法正文或 SDK client 的入口。
- runtime、tools、marketplace、console、observability、finance、KMS 等只能按消费 / 候选 / 外围 / 基础设施边界处理,不能反向定义 capability access truth。

诊断:

- 旧 `policy refresh` / `allow-deny` / `execution gateway` 口径会让 capability-hub 直接参与治理执行和 runtime enforcement。
- 旧 KMS / Vault 和 cost 口径会把外部基础设施或账务事实写成 capability access truth 的组成部分。

取舍:

- 对核心接缝使用“正式承接边界 + ref / safe summary / relation / controlled view”表达。
- 不在概要 Step 3 锁定具体 transport、port trait、event name、DTO、adapter 目录或 SDK package。

### 4.6 接缝与依赖约束:再写入

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 除 `L0-core` 外不得形成 sibling 编译期依赖 | 代码主体框架、接口骨架、详细设计承接、实施边界 | `L1-governance`、`L3-method-library`、`L2-runtime`、`L2-tools`、`L0-sdk`、`L4-observability`、`L6-marketplace` 等只能经运行期、事件、ref、safe summary、relation 或 controlled view 协作。 |
| formal intake boundary 必须隔离外部输入 | Command、Event / callback、external port、处理流、异常边界 | 外部 MCP / A2A / API 来源、governance 结果、method relation、admin input、downstream feedback 不得直接修改核心 truth,必须先被正式边界裁定为 accepted / rejected / pending / unresolved 等口径。 |
| governance seam 不得成为 governance truth | governance seam 对象、接口、处理流、状态 | 本仓只能保存 governance result ref、policy result ref、允许 safe summary、seam relation 和 access review separation fact;不得生成 approval、Policy effective fact、shared_rules truth 或治理执行状态。 |
| method relation 必须保持 body-free | method relation 对象、接口、追溯、处理流 | 本仓只能保存 method asset ref 和允许摘要强度内的 relation;不得保存 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、方法版本正文或 definition source truth。 |
| SDK exposure 只到服务端边界 | API / 接口骨架、consumer view、handoff、配置影响 | 本仓负责服务端 formal exposure 和可被 SDK 消费的只读语义;SDK client、language binding、package、client cache、developer experience 不进入本仓。 |
| 外围只读接缝不得升格为核心前置 | 主要组成部分、consumer view、search / export、风险台账 | console、marketplace、observability、finance、KMS、安全摘要深化和生态发现只能作为外围候选或只读输出,不得阻塞 identity、registry、descriptor、seam、relation、exposure 核心闭环。 |

### 4.7 交互 / 一致性 / 失败约束:先思考

问题回答:

- 架构已把交互分成同步请求 / 响应、异步事件 / 回调和后台任务 / 延后承接。Step 3 需要将其转成后续接口、flow、状态和异常章节的门禁。
- 核心 truth 的成立必须有明确结果,不能因为外部治理、方法、SDK、runtime、observability、marketplace 或派生失败而伪装成功,也不能让外围失败回滚已成立 truth。
- 外部不可解析、引用过期、派生延迟、下游反馈缺失等必须显式表达为 pending、unresolved、stale、partial、unavailable 等状态或边界场景。

诊断:

- 旧 policy refresh / provider lookup / QueryCapabilities 口径容易把异步传播、查询快照和核心裁定混成一个同步查询结果。
- 如果 Step 3 不把失败语义先钉住,后续 Step 8~10 会倾向于通过默认成功、缓存兜底或本地补造来隐藏边界失败。

取舍:

- 保留“核心同步裁定、事实异步传播、派生后台收敛”的结构约束。
- 不写完整状态机、错误码、补偿算法、outbox、topic、job 或 retry 规则。

### 4.8 交互 / 一致性 / 失败约束:再写入

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 同步 / 异步 / 后台必须分层 | 接口类别、处理流、状态传播、异常边界 | identity、registry、descriptor、seam、relation、exposure 的核心裁定走同步口径;已成立事实传播和外部结果送达走异步口径;consumer view、search、export、reconciliation、handoff 和 safe summary 刷新走后台口径。 |
| 核心 truth 与派生材料一致性必须分层 | 对象、读取、consumer view、后台维护 | 核心接入事实内部必须保持明确成立口径;派生视图、下游感知、审计摘要、搜索和生态发现可以最终一致,但不得反写真相。 |
| 失败状态必须显式表达 | 状态定义、异常与边界场景、读取结果、处理流 | 外部来源不可用、governance ref 不可解析、method ref 不可解析、descriptor 不完整、secret summary 不可用、consumer view 过期、handoff 失败、下游反馈缺失等不得伪装成成功。 |
| 下游消费失败不得回滚本仓 truth | runtime / tools / SDK consumer、event 协作、impact summary | runtime、tools、SDK 或外围入口不可用只影响消费、反馈或派生材料,不得修改 formal exposure、registry、descriptor 或 capability identity truth。 |
| 变化与影响必须可追溯但不扩大正文 | traceability / impact、event 协作、audit-friendly handoff | capability change / consumer impact fact 必须能解释来源、变化和影响范围;不得携带 governance truth、method body、secret、runtime payload、cost ledger 或 observability store 正文。 |

### 4.9 表达深度 / 配置 / 待确认约束:先思考

问题回答:

- Step 2 已确定 `02` 只到可实现结构骨架。Step 3 要把这个层次边界变成硬约束,防止后续 Step 提前写完整 schema、字段全集、函数签名、protocol、DDL、错误码、测试或 implementation boundary。
- 配置可以影响运行承载、外部接缝参数、派生刷新节奏、保留策略和安全展示策略,但不能改变 truth owner、formal boundary、sync / async / background 分层、ref / safe summary / body-free relation 规则。
- 当前未闭口项必须留在对应 Step 或 `03/04/05/06/07`,不能用“后续再说”替代边界,也不能在 Step 3 直接补定。

诊断:

- 旧 `P95`、`30s`、cost 覆盖率、KMS / Vault、outbox、provider lookup 等口径要么是旧指标,要么是详细设计 / 配置 / 测试 / 实施问题,不应成为当前概要约束。
- 如果配置边界不写清,实现阶段可能通过配置把未治理能力正式暴露、把 secret 正文带入 descriptor、或让 consumer view 覆盖 formal exposure。

取舍:

- 使用“概要层可命名、不可完整契约化”的表达深度约束。
- 对 open question 保持显式挂起,并要求后续 Step 逐项承接。

### 4.10 表达深度 / 配置 / 待确认约束:再写入

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 概要层不得写完整契约 | 全部后续 Step、正式 `02` 装配 | 可以点名代码主体、主要组成部分、对象名、接口类别、流程阶段、状态族和字段 / 函数骨架;不得写字段全集、完整 Rust 签名、DTO / event payload、DDL、索引、事务、错误码、测试矩阵或 commit boundary。 |
| 配置不得改变核心边界 | 配置影响、接口、状态、异常、详细设计承接 | 配置不得改变 truth ownership、formal intake boundary、formal exposure、sync / async / background 分层、ref / safe summary / body-free relation、forbidden body 和 consumer view 不反写规则。 |
| 协议与产品保持中立 | adapter descriptor、external port、配置影响、详细设计承接 | Step 3 不锁定 PostgreSQL、cache、broker、outbox、KMS / Vault、provider adapter、SDK facade、API gateway、具体 MCP / A2A / API DTO、搜索产品、部署拓扑或容量数字。 |
| 待确认项只能保守承接 | 风险、待确认、对象 / 接口 / 状态后续 Step | seam field、relation summary、descriptor taxonomy、secret safe summary、SDK handoff、外围只读接缝、量化指标和 implementation boundary 必须在后续对应 Step / 文档继续闭口,当前不得写成已定实现。 |
| 旧材料只能作为污染检查 | 旧材料差异、正式装配、风险台账 | 旧 ProviderContract、CapabilityDecision、CostRecord、KMS / Vault、QueryCapabilities、policy refresh、allow / deny、execution gateway、旧 P95 / `30s` 指标不得回流为新版概要约束。 |

### 4.11 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 `ProviderContract` 作为核心能力接入对象 | 不继承为 Step 3 约束。 | 新版主线是 adapter descriptor,且明确 secret、quota、route、cost、failover、provider runtime 不入仓。 |
| 旧 `CapabilityDecision` / `QueryCapabilities` 作为查询与决策主语 | 不继承。 | 新版主线区分 formal exposure 与 controlled consumer view,查询和消费快照不得成为第二 truth。 |
| 旧 KMS / Vault、API key、secret envelope 主线 | 不继承。 | 本仓只允许 secret ref / safe summary,不成为 secrets 平台或 KMS truth owner。 |
| 旧 CostRecord、cost accounting、provider raw billing 主线 | 不继承。 | cost / billing / finance ledger 已被 `00/01` 裁出 capability-hub 职责。 |
| 旧 policy refresh、allow / deny、execution gateway 和 provider lookup | 不继承。 | 这些会把本仓拉向 governance approval / Policy truth、runtime enforcement 或 provider runtime。 |
| 旧 P95、`30s`、覆盖率等指标 | 不继承。 | 当前正式 `00/01` 只保留结构性 NFR 和验收红线,量化目标后续重新闭口。 |

---

## 5. 结构化中间产物

### 5.1 约束清单表

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 只承接当前 `00/01` 已收稳结论 | 全部后续 Step、正式装配 | 旧 README、旧 `02/03/05/06` 和旧对象名只作 historical material / 污染检查,不得作为新版概要来源。 |
| capability access truth owner 必须保持独立 | 代码主体、组成部分、对象、flow、状态 | 本仓只拥有能力接入事实,不得吸收 execution、governance truth、method body、SDK client、marketplace、secret / KMS、cost / billing 或 observability store。 |
| 核心轴线必须保持可分 | 组成部分、对象候选池、接口、状态 | identity、registry、descriptor、governance seam、method relation、formal exposure / consumer view、traceability / impact 不得合并成旧 ProviderContract、QueryCapabilities 或 execution gateway。 |
| truth / snapshot / ref / relation / derived view 必须分层 | 对象、查询、后台维护、异常 | 核心 truth、消费快照、外部引用、关系事实和派生视图各自有边界;派生视图不得成为第二 truth。 |
| forbidden body 不得进入本仓 | 对象字段、接口正文、事件、导出 | governance truth、method body、secret 正文、provider runtime、execution payload、SDK client、marketplace transaction、cost ledger、observability store 和生产调用正文均禁止保存。 |
| descriptor 不得退化为 Provider Contract | descriptor、配置影响、边界场景 | descriptor 只表达接入方式、能力类型、风险和约束摘要,不承载 secret、KMS、quota、route、cost、failover、retry 或 provider runtime。 |
| formal exposure 与 controlled consumer view 必须分层 | 暴露、读取、SDK handoff、consumer view | 服务端 exposure 是本仓 truth;runtime、tools、SDK、search、browse 和 query view 只能消费或派生。 |
| 除 `L0-core` 外不得形成 sibling 编译期依赖 | 代码主体、接口、详细设计承接 | 其他 sibling 只能通过运行期、事件、ref、safe summary、relation 或 controlled view 协作。 |
| formal intake boundary 必须隔离外部输入 | Command、Event / callback、external port、处理流 | 外部来源、治理结果、方法关系、admin input 和 downstream feedback 必须先被正式边界裁定,不得直接改写 truth。 |
| governance seam 不得成为 governance truth | seam 对象、接口、处理流、状态 | 只承接 result ref、policy result ref、允许 safe summary、seam relation 和 access review separation;不生成 approval / Policy / shared_rules truth。 |
| method relation 必须保持 body-free | relation 对象、接口、追溯 | 只承接 method asset ref 和允许摘要强度内的 relation,不保存方法正文或 definition source truth。 |
| SDK exposure 只到服务端边界 | API / 接口骨架、consumer view、handoff | 本仓提供服务端 formal exposure 和只读消费语义,不实现 SDK client、binding、package 或 client cache。 |
| 外围只读接缝不得升格为核心前置 | 组成部分、派生视图、风险台账 | console、marketplace、observability、finance、KMS、安全摘要深化和生态发现只作外围候选或只读输出。 |
| 同步 / 异步 / 后台必须分层 | 接口类别、处理流、状态传播 | 核心裁定同步,已成立事实传播和外部结果送达异步,consumer view / search / export / reconciliation / handoff 后台收敛。 |
| 核心 truth 与派生材料一致性必须分层 | 对象、读取、后台维护 | 核心事实必须有明确成立口径;派生材料可以最终一致,但不得反写真相。 |
| 失败状态必须显式表达 | 状态、异常、读取结果、flow | pending、unresolved、stale、partial、unavailable、forbidden 等不得被伪装成成功。 |
| 下游消费失败不得回滚本仓 truth | runtime / tools / SDK consumer、impact summary | 下游消费和反馈失败只影响消费 / 派生,不得修改 formal exposure、registry、descriptor 或 identity truth。 |
| 变化与影响必须可追溯但不扩大正文 | traceability / impact、event 协作、audit handoff | 变化和影响要可解释,但不得携带治理、方法、secret、execution、cost 或观测正文。 |
| 概要层不得写完整契约 | 全部后续 Step、正式装配 | 只到结构骨架和轮廓,不写完整字段、签名、schema、DDL、错误码、测试、证据或实施 boundary。 |
| 配置不得改变核心边界 | 配置影响、接口、状态、异常 | 配置不能改变 truth ownership、formal boundary、sync / async / background、ref / safe summary / body-free relation、forbidden body 和派生不反写。 |
| 协议与产品保持中立 | descriptor、external port、配置影响 | Step 3 不锁定数据库、缓存、broker、KMS、adapter、SDK facade、API gateway、DTO、搜索产品、部署拓扑或容量数字。 |
| 待确认项只能保守承接 | 风险、对象 / 接口 / 状态后续 Step | seam field、relation summary、descriptor taxonomy、secret summary、SDK handoff、外围只读接缝、量化指标和 implementation boundary 后续闭口。 |

### 5.2 后续章节门禁表

| 后续章节 | 必须使用的约束 | 门禁判断 |
|---|---|---|
| Step 4 代码主体框架映射 | truth owner 独立、核心轴线可分、`L0-core` 依赖裁剪、sync / async / background 分层 | 代码主体是否围绕 capability access truth 组织,并区分核心 truth、正式入口、异步协作、后台派生和外部接缝。 |
| Step 5 主要组成部分 | 数据分层、forbidden body、governance / method / SDK / runtime / tools / 外围边界 | 组成部分是否越权承接执行、治理、方法正文、SDK、marketplace、secret、cost 或观测职责。 |
| Step 6 关键对象轮廓 | truth / snapshot / ref / relation / derived view、descriptor 边界、formal exposure 分层 | 对象是否属于本仓该拥有的对象类型,字段骨架是否暗含 forbidden body 或边界外 truth。 |
| Step 7 API / 接口骨架 | formal intake boundary、sync / async / background、SDK exposure 服务端边界、协议中立 | 接口是否正确表达 Command / Query / Event / Operations / external port 边界,是否提前写入 DTO / payload / client 实现。 |
| Step 8 关键处理流 | 同步裁定、异步传播、后台收敛、失败显式、下游失败不回滚 truth | flow 是否混淆核心成立、外部送达、下游感知、派生维护、对账和 handoff。 |
| Step 9 状态定义与状态流转 | 失败显式、formal exposure 与 consumer view 分层、引用有效性 | 状态是否覆盖 accepted / rejected / pending / unresolved / stale / partial / unavailable / forbidden 等语义,且不引入 execution runtime 状态。 |
| Step 10 异常与边界场景 | forbidden body、formal intake、显式失败、外围失败不回滚 | 异常场景是否覆盖外部来源不可用、治理 / 方法 ref 不可解析、secret summary 缺失、派生延迟和 handoff 失败。 |
| Step 11 配置影响 | 配置不可越界、协议产品中立、待确认项保守承接 | 配置是否只影响承载、节奏、参数和展示策略,而不改变 truth owner 或正式边界。 |
| Step 12 详细设计承接清单 | 概要层不得写完整契约、待确认项后续闭口 | handoff 是否把对象、接口、flow、状态和配置契约交给 `03/04`,而不是在 `02` 中提前实现化。 |

### 5.3 约束边界说明短文

概要设计是在已收稳的需求与架构边界下继续向可实现结构展开,因此必须先守住 truth owner、数据分层、接缝依赖、交互分层和表达深度。若这些约束不先写清,后续代码主体、组成部分、对象、接口、flow、状态和配置会继续在需求、架构、详细设计与相邻仓职责之间串层漂移。

### 5.4 来源与影响追踪表

| 约束组 | 主要来源 | 主要影响后续章节 |
|---|---|---|
| 上游承接约束 | `00-需求文档.md` 仓定位、目标 / 非目标、追溯矩阵;`01-架构设计.md` §2~§4、§12、§15 | Step 4 / 5 / 13 / 14 |
| 数据归属 / forbidden body 约束 | `00-需求文档.md` 数据归属、业务规则、验收否决项;`01-架构设计.md` §9、§13、ADR | Step 5 / 6 / 7 / 8 / 10 |
| 接缝与依赖约束 | `00-需求文档.md` 接口与依赖;`01-架构设计.md` §5、§8、§10、全局依赖裁剪规则 | Step 4 / 5 / 7 / 8 / 12 |
| 交互 / 一致性 / 失败约束 | `01-架构设计.md` §7、§9、§10、§13;Step 2 设计深度口径 | Step 7 / 8 / 9 / 10 |
| 表达深度 / 配置 / 待确认约束 | Step 2 设计深度;概要 SOP / 书写规范;`01-架构设计.md` 风险与待确认 | Step 11 / 12 / 13 / 14 |

---

## 6. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §3,当前不直接修改正式文档。

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/02_hld_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_03_constraints.md` 的“结构化中间产物”“模块思考记录”和“旧材料差异审计”小节,了解本章约束如何从需求 / 架构边界转译而来。

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 只承接当前 `00/01` 已收稳结论 | 全部后续 Step、正式装配 | 旧 README、旧 `02/03/05/06` 和旧对象名只作 historical material / 污染检查,不得作为新版概要来源。 |
| capability access truth owner 必须保持独立 | 代码主体、组成部分、对象、flow、状态 | 本仓只拥有能力接入事实,不得吸收 execution、governance truth、method body、SDK client、marketplace、secret / KMS、cost / billing 或 observability store。 |
| 核心轴线必须保持可分 | 组成部分、对象候选池、接口、状态 | identity、registry、descriptor、governance seam、method relation、formal exposure / consumer view、traceability / impact 不得合并成旧 ProviderContract、QueryCapabilities 或 execution gateway。 |
| truth / snapshot / ref / relation / derived view 必须分层 | 对象、查询、后台维护、异常 | 核心 truth、消费快照、外部引用、关系事实和派生视图各自有边界;派生视图不得成为第二 truth。 |
| forbidden body 不得进入本仓 | 对象字段、接口正文、事件、导出 | governance truth、method body、secret 正文、provider runtime、execution payload、SDK client、marketplace transaction、cost ledger、observability store 和生产调用正文均禁止保存。 |
| formal exposure 与 controlled consumer view 必须分层 | 暴露、读取、SDK handoff、consumer view | 服务端 exposure 是本仓 truth;runtime、tools、SDK、search、browse 和 query view 只能消费或派生。 |
| 同步 / 异步 / 后台必须分层 | 接口类别、处理流、状态传播 | 核心裁定同步,已成立事实传播和外部结果送达异步,consumer view / search / export / reconciliation / handoff 后台收敛。 |
| 配置不得改变核心边界 | 配置影响、接口、状态、异常 | 配置不能改变 truth ownership、formal boundary、sync / async / background、ref / safe summary / body-free relation、forbidden body 和派生不反写。 |

概要设计是在已收稳的需求与架构边界下继续向可实现结构展开,因此必须先守住 truth owner、数据分层、接缝依赖、交互分层和表达深度。若这些约束不先写清,后续代码主体、组成部分、对象、接口、flow、状态和配置会继续在需求、架构、详细设计与相邻仓职责之间串层漂移。
```

---

## 7. 待确认事项

### 7.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| §3 是否复述完整架构约束 | A. 复述架构全文;B. 只提炼会影响后续概要结构判断的约束;C. 写完整详细设计约束 | B | 能避免重复架构,也能直接指导 Step 4~12 | 已确认采用 B |
| 是否沿用旧 ProviderContract / QueryCapabilities / Cost / KMS 约束 | A. 沿用;B. 只作为历史污染检查;C. 与新主语并行 | B | 旧主线与新版 `00/01` 冲突,会打穿 capability access truth 边界 | 已确认采用 B |
| 配置是否可以改变 formal exposure、governance seam 或 consumer view 边界 | A. 可以;B. 不可以,配置只影响承载和参数 | B | 配置若能改变核心边界,会破坏 truth owner 和验收红线 | 已确认采用 B |
| open question 是否在 Step 3 补定字段 / 协议 | A. 是;B. 否,只保守承接并交给后续 Step | B | Step 3 只收约束,字段 / 协议属于后续概要或详细设计 | 已确认采用 B |

### 7.2 本 Step 未确认事项

本步不新增阻塞 Step 4 的上游 blocker。以下事项保持为后续概要 / 详细设计待闭口输入:

- governance seam 最小字段与 carrier 形态。
- method relation 摘要强度和适用性表达。
- descriptor taxonomy 与 MCP / A2A / API / provider runtime 边界细分。
- secret ref / safe summary 最小内容。
- formal exposure 到 `L0-sdk` 的 handoff contract。
- marketplace / console / observability / finance / KMS 是否需要正式只读接缝。
- 量化性能、传播、容量目标。
- 完整 API / DTO / state / storage / config / evidence / implementation boundary。

---

## 8. 进入下一步条件

- 已明确后续概要设计必须遵守的结构性约束。
- 每条约束都能影响代码主体、主要组成部分、关键对象、接口、处理流、状态、异常、配置或详细设计承接判断。
- 未把上游架构全文复述为约束。
- 未写入详细设计实现策略、数据库约束、部署约束、协议 schema、测试用例或实施计划。
- 已将旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`KMS / Vault`、`QueryCapabilities`、policy refresh、allow / deny、execution gateway 和旧指标隔离为 historical material。
- 可以进入 Step 4“代码主体框架映射”。
