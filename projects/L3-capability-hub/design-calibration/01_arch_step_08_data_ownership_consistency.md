# L3-capability-hub 01 架构 Step 8: 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、架构 Step 3 / 5 / 6 / 7 和需求 Step 11 重新推导数据所有权与一致性策略;旧 `01-架构设计.md` §8 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 8 数据所有权与一致性策略 |
| 输出文件 | `design-calibration/01_arch_step_08_data_ownership_consistency.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 8;`架构设计书写规范.md` §4.9 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §8 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 8;`L3-method-library` Step 8;`L0-sdk` Step 8 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 7 进入 Step 8 |
| next_allowed_action | Step 8 已完成,等待用户确认后进入 Step 9。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入数据归属思考。 |
| 数据归属:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入数据归属写入。 |
| 数据归属:再写入 | done | 数据归属表 / 数据分类结论 | pass | 进入一致性策略思考。 |
| 一致性策略:先思考 | done | 归属到一致性的推导 | pass | 进入一致性策略写入。 |
| 一致性策略:再写入 | done | 一致性策略表 / 边界说明 / 简化图 | pass | 进入架构单元数据规则思考。 |
| 架构单元数据规则:先思考 | done | 按 Step 5 单元逐个判断 truth / snapshot / reference / forbidden body | pass | 进入架构单元数据规则写入。 |
| 架构单元数据规则:再写入 | done | 架构单元数据所有权表 / 停审记录 | pass | 进入跨数据边界审计。 |
| 跨数据边界审计 | done | 双真相 / 投影反写 / 引用正文入仓 / 一致性误用审计 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §9 候选文本 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 9。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 8 必须输出数据所有权结论、数据分类结论、一致性口径结论、补偿 / 约束结论、按架构单元组织的数据所有权表、停审记录和跨数据边界审计。 | 本 Step 必须逐架构单元定义 truth、snapshot / projection、reference、forbidden body / forbidden write,并在完成后停审。 |
| `standards/document/架构设计书写规范.md` §4.9 | 数据类型固定为 `正式真相数据`、`快照 / 投影数据`、`引用关系数据`、`明确不拥有的正文 / 真相`;必须先归属后谈一致性。 | 数据归属表和一致性策略表必须使用固定结构,不能写字段、表、缓存、outbox、事务、协议或代码对象模型。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,并维护恢复门禁、诊断、取舍和结构化产物。 | 本文件保留过程判断和停审记录,正式 `01` 暂不回填。 |
| `设计文档编写通则.md` | 架构章节必须与上游需求、职责边界、系统上下文和依赖方向闭环。 | 本 Step 不能重写 Step 3~7,只能在其基础上收敛数据归属与一致性。 |
| `设计真相源闭环与可落码性标准.md` | 不得制造多真相源,不得把外部正文、影子数据、查询结果或引用关系写成本仓 truth。 | 必须防止后续概要 / 详细设计或实现端私自把 runtime execution、governance truth、method body、secret、SDK client 等补进本仓。 |
| `全局项目依赖关系与裁剪规则.md` | 跨仓依赖按 compile / runtime / event / ref / summary / consumer boundary 裁剪。 | 数据所有权必须与 Step 7 依赖裁剪一致,不得因本地数据存在改变依赖类型。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 本仓承担 access truth、identity、registry、descriptor、risk / review、governance seam、body-free method relation、formal exposure、traceability / change impact 和派生维护 / safe summary 边界。 | 数据归属必须围绕这些职责建立,非职责不得成为本仓真相。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 内部语义结构为五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用。 | Step 8 必须按这些架构单元逐个定义数据所有权并停审。 |
| `01_arch_step_06_container_deployment.md` | 运行承载区分同步入口、异步协作、后台维护、access truth 承载和受控消费 / 追溯派生承载。 | 数据策略必须保护 access truth 承载与派生承载分离;派生承载滞后或重建不得反写真相。 |
| `01_arch_step_07_dependency_direction.md` | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;governance、method-library、runtime、tools、SDK 等均按正式边界 / ref / safe summary / consumer view 协作。 | 数据归属不能把运行期 / 事件 / 引用关系升级为源码拥有或正文拥有。 |
| 正式 `00-需求文档.md` §11 / `00_req_step_11_data_ownership.md` | 需求层已经给出真相数据、快照数据、引用数据和禁止保存正文清单。 | 架构层要将这些数据归属转译为 `正式真相数据`、`快照 / 投影数据`、`引用关系数据`、`明确不拥有的正文 / 真相`,并补一致性口径。 |
| `00_req_step_10_business_rules_boundaries.md` | `BR-CH-001~037` 钉住 identity、registry、descriptor、seam、relation、exposure、禁止正文和派生反写规则。 | 一致性策略必须保护这些不变量,不能用最终一致或补偿语义放松核心 truth。 |
| `00_req_step_13_non_functional_requirements.md` | 核心闭环不能被外围拖垮;禁止正文;关键变化可追溯;派生视图可滞后但可解释。 | 失败处理口径应区分强一致失败、引用不可解析、派生滞后和边界外正文缺失。 |
| `00_req_step_15_risks_open_questions.md` | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / boundary 等仍未闭口。 | 本 Step 不能把未确认字段、schema、state 或 API 写成数据事实。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §8 | historical material | 只审计旧 `MCPServer registry`、`A2ANode directory`、`ProviderContract`、`CapabilityDecision cache`、`CostRecord`、Policy replay、cost retry、key rotate 等口径。 |
| `L1-governance` Step 8 | reference material | 参考“正式真相 / 快照投影 / 引用 / 明确不拥有 + 一致性策略 + 单元停审”的粒度。 |
| `L3-method-library` Step 8 | reference material | 参考 full-restart 下从 Step 5 架构单元推导数据规则和旧材料差异审计的方式。 |
| `L0-sdk` Step 8 | reference material | 参考 exposure boundary 与 SDK client / package truth 分离的写法。 |

---

## 3. 整体模块骨架

Step 8 只回答架构层数据归属与一致性口径,不写数据库设计、字段、表、缓存、projection、outbox、事务、接口协议、事件 schema、repository、port、handler、测试证据或实现补偿。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 数据归属 | 本仓拥有什么正式真相,哪些只是快照 / 投影、引用关系或明确不拥有正文。 | 不写字段、表、状态枚举、索引、cache key、schema、DDL 或存储生命周期。 | 数据归属表、数据分类结论。 |
| 一致性策略 | 在归属已明确的前提下,哪些关系强一致、最终一致、引用有效性一致或边界约束一致。 | 不写事务、锁、outbox、事件投递、重试、补偿任务或 projection 刷新机制。 | 一致性策略表、失败挂起口径、简化图。 |
| 架构单元数据规则 | Step 5 每个架构单元拥有什么 truth,只持有哪些 snapshot / projection / reference,禁止保存什么正文。 | 不重划子域,不定义 DTO、repository、port、state、event 或测试用例。 | 架构单元数据所有权表 / 停审记录。 |
| 跨数据边界审计 | 是否存在双真相、投影反写、引用正文入仓、强一致 / 最终一致误用或补偿口径冲突。 | 不用后续概要 / 详细设计替本 Step 补口。 | 审计表。 |
| 旧材料差异审计 | 旧数据所有权与一致性方向哪些可保留,哪些必须废弃或降级。 | 不继承旧 completed 状态、旧对象名、旧技术补偿或旧 SLA。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 9。 | 不提前通过通信方式、技术选型、ADR、概要设计或实施边界门禁。 | 自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 8 completed_stop_review | pass | 数据归属表、一致性策略表、按架构单元数据规则、数据所有权停审、跨边界审计、旧材料审计、回填草稿和自检均完成。 | `wait_user_review_to_step_09` |

---

## 5. 模块思考记录

### 5.1 数据归属:先思考

问题回答:

- `L3-capability-hub` 拥有的是外部 MCP / A2A / API capability access truth,不是外部能力执行 truth、治理批准 truth、方法正文 truth、SDK client truth、marketplace truth、secret truth 或 observability truth。
- 架构层正式真相必须围绕五个核心轴成立:capability identity、capability registry、adapter descriptor、governance seam / method relation、formal exposure / controlled consumption。
- 快照 / 投影数据只服务稳定消费、目录浏览、受控消费视图、导出、追溯、外部候选发现和 safe summary,不得成为新的业务写源。
- 引用关系数据只保存对外部能力来源、governance result、method asset、secret、runtime / tools consumer、SDK exposure consumer、observability / audit、external standard / protocol / document、marketplace ecosystem object 的稳定回链,不保存外部正文。
- 明确不拥有的正文 / 真相包括 secret 正文、KMS / Vault truth、runtime / tools execution、provider runtime、cost / billing、governance approval / Policy / shared_rules、method body、SDK client、marketplace transaction、observability store、production payload 和 LLM routing。

诊断:

- 旧 §8 的 `MCPServer registry` 和 `A2ANode directory` 把协议类别当数据主语,会把同一 capability access truth 切成协议孤岛。
- 旧 `ProviderContract` 把 adapter descriptor 与 secret、quota、route、failover、retry、cost 和 provider runtime 捆绑,与当前非职责和禁止正文冲突。
- 旧 `CapabilityDecision cache` 把受控消费快照和 runtime allow / deny / Policy refresh 语义混在一起,容易反写 formal exposure。
- 旧 `CostRecord` 和 `cost retry` 把 finance / billing ledger 拉入本仓,违反 `00` Step 11 与 Step 3 非职责。
- 旧 `Policy replay`、`last-known-good` 和 `key rotate` 属于实现补偿或相邻仓运行机制,不能成为架构层数据所有权策略。

取舍:

- 采用 `正式真相数据`、`快照 / 投影数据`、`引用关系数据`、`明确不拥有的正文 / 真相` 四类归属。
- 数据主语从旧对象名重裁为当前核心语义与边界对象,不继承旧生命周期枚举、热冷存储、cache、CostRecord 或 KMS 方案。
- 接入审查事实和 descriptor risk / constraint summary 保留为本仓正式解释 truth;governance approval / Policy / shared_rules 保持边界外。
- `controlled consumer view / CapabilityDecision-style summary` 明确降级为派生快照,不能反向定义 registry、descriptor、formal exposure 或 runtime decision。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否先判断正式 truth | pass | truth 集中在 capability access truth 和五个核心轴。 |
| 是否区分快照 / 投影和引用 | pass | consumer view、search、export、safe summary、external refs 均已降级。 |
| 是否排除外部正文 | pass | secret、execution、governance、method、SDK、marketplace、observability、cost、LLM routing 均排除。 |
| 是否可进入“数据归属:再写入” | pass | 可形成数据归属表。 |

### 5.2 数据归属:再写入

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 外部能力接入语境 | 正式真相数据 | 由本仓拥有外部 MCP / A2A / API 能力进入平台接入讨论、接入判断和正式承接的语境真相。 | 不等同于外部系统正文、外部认证协议、provider 产品说明或 runtime 调用上下文。 |
| capability identity | 正式真相数据 | 由本仓拥有外部能力在 access truth 中的稳定主体锚点。 | 不得被 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代。 |
| identity 风险解释与接入审查事实 | 正式真相数据 | 由本仓拥有 identity 层风险解释和 capability access review fact。 | 不等同于 governance approval、Policy effective fact、认证结果或 allow / deny enforcement。 |
| capability registry entry | 正式真相数据 | 由本仓拥有 capability 被纳入正式能力接入目录的事实。 | 不等同于 allowlist、runtime cache、availability bit、搜索索引或 marketplace listing。 |
| registry visibility / lifecycle semantics | 正式真相数据 | 由本仓拥有 registry 可见性、正式 / 非正式接入状态和退出语义。 | 不写旧状态枚举、热冷存储、归档保留期或 runtime 白名单刷新。 |
| registry maintenance / reconciliation record | 正式真相数据 | 由本仓拥有目录维护、对账和一致性保护形成的维护事实。 | 维护事实不能替代业务接入结论,也不能由后台任务创造 registry truth。 |
| adapter descriptor | 正式真相数据 | 由本仓拥有外部能力接入方式、能力类型、约束和接入描述语义。 | 不等同于旧 ProviderContract,不包含 secret、quota、route、failover、retry、cost、invocation result 或 provider runtime。 |
| descriptor risk / constraint summary | 正式真相数据 | 由本仓拥有 descriptor 相关风险、约束和安全解释的正式摘要 truth。 | 不保存 secret 正文,也不拥有 KMS / Vault、provider key 或外部认证生命周期。 |
| governance seam relation | 正式真相数据 | 由本仓拥有 capability 与正式治理结果之间的关系边界。 | 不拥有 approval execution、Policy effective fact、shared_rules truth 或治理缓存正文。 |
| capability access review responsibility separation fact | 正式真相数据 | 由本仓拥有接入审查事实与 governance approval 的职责分离事实。 | 该事实只解释本仓审查职责,不能替代 `L1-governance` 的批准结论。 |
| capability-method body-free relation | 正式真相数据 | 由本仓拥有 capability 与 method asset 的 body-free relation truth。 | 不拥有 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、method version body 或定义来源正文。 |
| capability access traceability record | 正式真相数据 | 由本仓拥有身份、目录、描述、治理接缝、方法关系、正式暴露和关键变化的接入事实追溯。 | 不等同于 observability audit ledger、trace store、metric、alert、log 或 archive package body。 |
| formal exposure boundary | 正式真相数据 | 由本仓拥有服务端正式能力暴露边界。 | 不等同于 runtime allow / deny decision、QueryCapabilities 旧语义、Policy cache、SDK client 或 tool config。 |
| formal visibility / applicability fact | 正式真相数据 | 由本仓拥有正式可见性和适用边界事实。 | 不得由 consumer view、runtime cache、SDK package、UI 配置或 marketplace listing 反向定义。 |
| capability change / consumer impact fact | 正式真相数据 | 由本仓拥有能力接入变化和对正式消费边界的影响解释事实。 | 不拥有下游执行状态、消费成功状态、SDK 发布状态或观测告警正文。 |
| governance result safe summary | 快照 / 投影数据 | 本仓可保留治理结果允许摘要,用于解释 seam、formal visibility 或消费边界。 | 治理正式 truth 仍归 `L1-governance`;摘要不能替代 governance result ref。 |
| secret handling safe summary | 快照 / 投影数据 | 本仓可保留不含 secret 正文的敏感边界安全摘要。 | 不拥有 secret 正文、KMS / Vault truth、key rotation 状态或 provider credential lifecycle。 |
| directory search / browse summary | 快照 / 投影数据 | 由 registry 和 exposure truth 派生,用于目录浏览、搜索和管理入口读取。 | 搜索 / 浏览摘要不得创建、删除、批准或改写 registry truth。 |
| exported capability access summary | 快照 / 投影数据 | 由正式接入事实派生,用于导出、审计友好查看或外围交接。 | 导出材料不是 artifact / archive 正文,也不是新的 truth owner。 |
| controlled consumer view / CapabilityDecision-style summary | 快照 / 投影数据 | 由 formal exposure、governance seam、descriptor 摘要和 registry truth 派生,用于稳定受控消费。 | 不等同于 formal exposure truth,不得变成 allow / deny enforcement 或 runtime decision。 |
| downstream consumption impact summary | 快照 / 投影数据 | 本仓可保留下游消费影响的允许摘要,用于解释变化感知。 | 不拥有 runtime execution、tool result、SDK client 采用状态或消费侧内部状态。 |
| external capability candidate discovery summary | 快照 / 投影数据 | 本仓可保留外部候选发现摘要,用于外围管理与发现。 | 候选发现不等于 capability identity 或 registry entry,正式接入前不形成 access truth。 |
| read-only ecosystem discovery summary | 快照 / 投影数据 | 本仓可保留只读生态发现摘要。 | 不拥有 marketplace listing、transaction、pricing、purchase、fulfillment 或生态运营 truth。 |
| observability / audit safe summary | 快照 / 投影数据 | 本仓可保留与接入事实解释相关的观测 / 审计安全摘要。 | 不拥有 log、trace、metric、alert、audit store、cost ledger 或物理证据库。 |
| external capability source ref | 引用关系数据 | 本仓只保存对外部 MCP / A2A / API 来源对象的引用关系。 | 引用关系不携带外部对象正文、认证协议、运行状态或 provider 产品 truth。 |
| governance result / policy result ref | 引用关系数据 | 本仓只保存对治理结果或 policy result 的稳定引用关系。 | 不保存 approval 正文、Policy 正文、shared_rules 正文或 governance execution 状态。 |
| method asset ref | 引用关系数据 | 本仓只保存对 method asset 的引用关系。 | 不保存 method body、definition source truth、版本正文或方法发布正文。 |
| secret ref | 引用关系数据 | 本仓只保存对外部 secret 对象的引用关系。 | 不保存 API key、token、password、private key、secret value 或 KMS / Vault truth。 |
| runtime / tools consumer ref | 引用关系数据 | 本仓只保存对 runtime / tools 消费方或消费语境的引用关系。 | 不保存 execution truth、tool result、provider invocation、runtime cache 或 allow / deny enforcement。 |
| SDK exposure consumer ref | 引用关系数据 | 本仓只保存对 SDK exposure 消费边界或版本语境的引用关系。 | 不保存 SDK client、language package、binding、local candidate 或 developer experience truth。 |
| observability / audit ref | 引用关系数据 | 本仓只保存对观测、审计或外部证据位置的引用关系。 | 不保存观测正文、trace store、metric body、alert stream、audit ledger 或 archive body。 |
| external standard / protocol / document ref | 引用关系数据 | 本仓只保存外部标准、协议或文档的引用关系。 | 不拥有外部标准正文、协议正文、认证规范正文或文档生命周期。 |
| marketplace ecosystem object ref | 引用关系数据 | 本仓只保存对 marketplace / ecosystem 对象的只读引用。 | 不拥有 listing、transaction、pricing、purchase、fulfillment 或运营正文。 |
| provider API key / secret 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 provider API key、token、password、private key 或 secret value。 | 不得以加密、masked、cache、backup、audit 或 debug 名义入仓。 |
| KMS / Vault / secret platform truth | 明确不拥有的正文 / 真相 | 本仓明确不拥有 KMS / Vault、secret 平台、key rotation 或密钥托管生命周期 truth。 | 本仓只能保存 secret ref 或允许的 safe summary。 |
| runtime / tools execution 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 runtime loop、tools execution、allow / deny enforcement 或外部调用执行链。 | execution truth 属于 `L2-runtime` / `L2-tools` 或执行边界。 |
| provider runtime / quota / route / failover / retry 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 provider runtime orchestration、quota、route、failover、retry 或 invocation result。 | adapter descriptor 不得膨胀为 provider execution gateway。 |
| cost / billing / finance ledger 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 CostRecord、billing、finance ledger、provider raw billing 或成本对账正文。 | 旧 Cost Accounting 作为 historical conflict,不进入新版架构 truth。 |
| governance approval / Policy / shared_rules 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 governance approval、Policy effective fact、shared_rules truth 或 governance cache。 | 本仓只拥有 seam relation、ref 和允许摘要。 |
| method body / definition source truth 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本。 | 本仓只拥有 body-free relation 和 method asset ref。 |
| SDK client / language package / convenience wrapper 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 SDK client、多语言 package、binding 或客户端便利封装。 | 本仓只拥有服务端 formal exposure boundary。 |
| marketplace listing / transaction / pricing / fulfillment 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 listing、交易、定价、购买、订阅、安装或履约正文。 | 只读生态发现摘要和 ref 不能升级为 marketplace truth。 |
| observability log / trace / metric / alert / audit store 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有观测日志、trace、metric、alert、audit store 或物理证据正文。 | 本仓只拥有业务接入事实追溯和允许的 safe summary / ref。 |
| production request / response 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有外部能力生产请求、响应、payload、prompt、tool input 或 provider output 正文。 | descriptor 不得保存生产流量正文。 |
| LLM routing / model selection truth 正文 | 明确不拥有的正文 / 真相 | 本仓明确不拥有 LLM routing、model selection、prompt routing 或 provider orchestration truth。 | 这些不属于当前 capability access truth 边界。 |

#### 5.2.1 数据分类结论

| 数据类型 | 数据项 |
|---|---|
| 正式真相数据 | 外部能力接入语境;capability identity;identity 风险解释与接入审查事实;capability registry entry;registry visibility / lifecycle semantics;registry maintenance / reconciliation record;adapter descriptor;descriptor risk / constraint summary;governance seam relation;capability access review responsibility separation fact;capability-method body-free relation;capability access traceability record;formal exposure boundary;formal visibility / applicability fact;capability change / consumer impact fact |
| 快照 / 投影数据 | governance result safe summary;secret handling safe summary;directory search / browse summary;exported capability access summary;controlled consumer view / CapabilityDecision-style summary;downstream consumption impact summary;external capability candidate discovery summary;read-only ecosystem discovery summary;observability / audit safe summary |
| 引用关系数据 | external capability source ref;governance result / policy result ref;method asset ref;secret ref;runtime / tools consumer ref;SDK exposure consumer ref;observability / audit ref;external standard / protocol / document ref;marketplace ecosystem object ref |
| 明确不拥有的正文 / 真相 | provider API key / secret 正文;KMS / Vault / secret platform truth;runtime / tools execution 正文;provider runtime / quota / route / failover / retry 正文;cost / billing / finance ledger 正文;governance approval / Policy / shared_rules 正文;method body / definition source truth 正文;SDK client / language package / convenience wrapper 正文;marketplace listing / transaction / pricing / fulfillment 正文;observability log / trace / metric / alert / audit store 正文;production request / response 正文;LLM routing / model selection truth 正文 |

### 5.3 一致性策略:先思考

问题回答:

- 正式真相内部关系必须强一致,否则 identity、registry、descriptor、seam、relation、exposure 和 change trace 会形成互相漂移的 access truth。
- 正式真相与引用关系需要引用有效性一致:引用不可解析、类型不匹配或缺少必要 formal result 时,相关正式关系必须挂起、拒绝或保持 unresolved,不能复制外部正文补齐。
- 正式真相到快照 / 投影可以最终一致:搜索、导出、consumer view、safe summary、downstream impact summary 和 read-only ecosystem summary 可滞后、重建、不可用,但不得反写真相。
- 外部 safe summary 只能作为边界约束输入或解释材料;缺失、过期或不可判定时不得伪造 governance、secret、method、observability、marketplace 或 provider 正文。
- 明确不拥有正文的边界必须采用边界约束一致:正文如果出现,架构层口径只能是拒绝、挂起、转为 ref / safe summary 或标记 forbidden,不能保存。

诊断:

- 如果将所有关系都强一致,会把 governance、method-library、runtime、SDK、observability、marketplace 或 secret 平台强压成本仓内部依赖。
- 如果将核心 access truth 写成最终一致,会让 identity、registry、descriptor、exposure 和 relation 发生半成立状态,后续无法落码。
- 如果把 `CapabilityDecision-style summary` 延迟视为 formal exposure 未成立,派生快照会反向控制业务 truth。
- 如果外部引用失效时复制正文入仓,会形成第二 truth source。

取舍:

- 核心 truth 内部关系采用强一致。
- truth 到派生 view / search / export / consumer summary 采用最终一致。
- truth 到外部 ref 采用引用有效性一致。
- 与 forbidden body 的接触采用边界约束一致。
- 失败口径只写架构层挂起、拒绝、stale、unresolved、rebuilding、unavailable、显式不可判定等语义,不写事务、retry、outbox、replay、cache 或脚本。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否从数据归属推导一致性 | pass | 每类一致性口径均建立在四类数据类型之上。 |
| 是否区分强一致和最终一致 | pass | 核心 truth 强一致;派生消费最终一致;引用有效性单独处理。 |
| 是否避免实现补偿 | pass | 未写事务、outbox、worker、retry、replay、cache 或脚本。 |
| 是否可进入“一致性策略:再写入” | pass | 可形成一致性策略表。 |

### 5.4 一致性策略:再写入

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| capability identity 建立与外部能力接入语境绑定 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 不能形成无接入语境的 identity;保持未成立或显式失败。 | identity 是所有 access truth 的主体锚点。 |
| capability identity 与 registry entry 纳入关系 | 正式真相数据 ↔ 正式真相数据 | 强一致 | registry entry 不得单独成立;保持未注册或待补语境。 | registry 不能退化为孤立 allowlist 或搜索目录。 |
| registry visibility / lifecycle 与 formal visibility / applicability | 正式真相数据 ↔ 正式真相数据 | 强一致 | 可见性不一致时不得形成正式可消费结论。 | 正式目录和正式暴露必须保护同一接入事实。 |
| adapter descriptor 与 capability identity / registry | 正式真相数据 ↔ 正式真相数据 | 强一致 | descriptor 缺失、错配或未解释时挂起正式暴露。 | 接入描述不能漂移到另一个 identity 或 registry entry。 |
| descriptor risk / constraint 与 access review fact | 正式真相数据 ↔ 正式真相数据 | 强一致 | 风险解释不足时保持待审查、不可正式化或拒绝。 | 本仓接入审查事实必须能解释 descriptor 风险。 |
| governance seam relation 与 governance result ref | 正式真相数据 ↔ 引用关系数据 | 引用有效性一致 / 前置一致 | governance ref 缺失、不可解析或类型不匹配时挂起依赖治理的 formal exposure。 | 本仓拥有 seam relation,不拥有 governance truth。 |
| governance result safe summary 与 seam / exposure | 快照 / 投影数据 ↔ 正式真相数据 / 引用关系数据 | 摘要一致 / 边界约束一致 | 摘要缺失或过期时标记 stale / unresolved,不得用摘要替代 formal result ref。 | safe summary 只辅助解释,不能成为治理结论。 |
| capability access review responsibility separation fact 与 governance seam | 正式真相数据 ↔ 正式真相数据 | 强一致 | 职责分离不可说明时挂起或拒绝审查结论进入正式语境。 | 防止 access review 被误读为 governance approval。 |
| capability-method body-free relation 与 method asset ref | 正式真相数据 ↔ 引用关系数据 | 引用有效性一致 | method ref 不存在、失效或不匹配时 relation 显式 unresolved,不得复制 method body。 | 本仓只拥有关系,不拥有 method definition source。 |
| formal exposure boundary 与 controlled consumer view | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 | consumer view 可 stale / rebuilding / unavailable,不得反写 formal exposure。 | 消费快照服务读取,不是正式暴露 truth。 |
| formal exposure boundary 与 runtime / tools consumer ref | 正式真相数据 ↔ 引用关系数据 | 引用有效性一致 / 边界约束一致 | consumer ref 不可解析时影响交接或消费解释,不改变 formal exposure truth。 | 下游消费方不是本仓 truth owner。 |
| formal exposure boundary 与 SDK exposure consumer ref | 正式真相数据 ↔ 引用关系数据 | 引用有效性一致 / 边界约束一致 | SDK 边界不可判定时标记待交接或不可说明,不得生成 SDK client truth。 | 服务端 exposure 与 SDK client 必须分层。 |
| capability change / consumer impact fact 与 downstream impact summary | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 / 摘要一致 | 下游影响摘要可 pending / unknown,不得读取下游执行正文补齐。 | 本仓拥有变化解释,不拥有消费侧运行状态。 |
| capability access traceability record 与关键 access truth 变化 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 关键变化不可追溯时不得只写最终状态。 | 保护后续审计、争议处理和边界解释。 |
| registry maintenance / reconciliation record 与派生维护结果 | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 / 维护一致 | 维护结果可 pending / stale / failed,不得创造或覆盖 registry truth。 | 维护事实归本仓,派生输出不是业务结论。 |
| directory search / browse / export summary 与 access truth | 快照 / 投影数据 ↔ 正式真相数据 | 最终一致 | 搜索、浏览、导出可滞后或不可用,不得反写 identity / registry / descriptor。 | 读取体验与正式 truth 分离。 |
| external capability candidate discovery summary 与 capability identity | 快照 / 投影数据 ↔ 正式真相数据 | 前置转化约束 | 候选未被正式接入前不能自动生成 identity 或 registry truth。 | 候选发现不是接入事实。 |
| secret ref / safe summary 与 descriptor risk | 引用关系数据 / 快照 / 投影数据 ↔ 正式真相数据 | 边界约束一致 / 引用有效性一致 | secret ref 不可解析时挂起相关 descriptor 安全解释;不得保存 secret 正文。 | descriptor 可解释敏感边界,不拥有 secret 平台。 |
| observability / audit ref / safe summary 与 traceability record | 引用关系数据 / 快照 / 投影数据 ↔ 正式真相数据 | 引用有效性一致 / 最终一致 | 观测摘要缺失时保留本仓业务追溯,不得吸收 log / trace / metric 正文。 | 业务追溯与物理观测存储分离。 |
| read-only ecosystem discovery summary 与 marketplace ref | 快照 / 投影数据 ↔ 引用关系数据 | 最终一致 / 引用有效性一致 | 生态对象不可用时标记 unavailable,不得创建 listing / pricing / transaction truth。 | 生态发现是外围只读能力,不是 marketplace 仓。 |
| 明确不拥有正文进入本仓边界 | 明确不拥有的正文 / 真相 ↔ 任意本仓数据 | 边界约束一致 | 拒绝、挂起、删除候选正文或转化为 ref / allowed safe summary;不得保存正文。 | 防止 secret、execution、governance、method、cost、SDK、marketplace、observability 等正文入仓。 |

#### 5.4.1 数据边界说明

`L3-capability-hub` 的数据所有权以 capability access truth 为中心,本地存在的 consumer view、safe summary、search / export summary 和外部引用都不能被误读为第二 truth source。governance、method-library、runtime、tools、SDK、marketplace、observability、secret、finance 和外部 provider 只能通过正式 ref、safe summary、body-free relation 或受控消费边界协作。正式 truth 内部关系必须强一致,跨边界摘要和派生消费允许最终一致,引用关系要求可解析或显式 unresolved。当前 Step 不决定数据库、缓存、投影、事件、outbox、事务、重试或具体同步实现。

#### 5.4.2 简化关系示意图

```text
+==============================================================+
|               L3-capability-hub data boundary                |
+==============================================================+
             |
             v
+-----------------------------+
| 正式真相数据                |
| access truth                |
| identity / registry         |
| descriptor / seam / exposure|
+-------------+---------------+
              |
              | derive / summarize
              v
+-----------------------------+
| 快照 / 投影数据             |
| consumer view / search      |
| safe summary / export       |
+-------------+---------------+
              |
              | link only
              v
+-----------------------------+
| 引用关系数据                |
| governance / method / secret|
| runtime / SDK / audit refs  |
+-------------+---------------+
              |
              | forbidden body excluded
              v
+-----------------------------+
| 明确不拥有的正文 / 真相     |
| execution / secret / cost   |
| policy / method body / SDK  |
+-----------------------------+
```

图示说明:

- 正式真相数据是本仓数据边界中心,其他数据存在都不得反向改写它。
- 快照 / 投影数据只能从本仓 truth 派生或从外部正式 truth 的允许摘要承接。
- 引用关系数据只保存稳定回链,不保存外部正文或生命周期。
- 明确不拥有的正文 / 真相必须被拒绝、挂起或转化为 ref / allowed safe summary。

### 5.5 架构单元数据规则:先思考

问题回答:

- Step 5 的五个核心子域拥有正式 truth;四个支撑子域拥有围绕核心 truth 的解释、追溯、维护或外围发现 truth;五类本地索引 / 投影 / 引用只拥有 ref、projection、safe summary 或影子材料。
- 不是所有支撑子域都拥有同等强度的 truth:接入审查与风险解释拥有 review / risk explanation truth,派生维护拥有维护事实 truth,但搜索、导出、consumer view 和 ecosystem discovery 只能是 projection。
- 本地影子层必须逐类写清 forbidden body / forbidden write,否则后续 Step 9 交互、Step 10 技术选型和 02 / 03 设计会把 ref 变成正文。
- 架构单元数据停审的核心问题是:truth 是否唯一、projection 是否禁止反写、external body 是否禁止保存、一致性口径是否明确。

诊断:

- `治理与方法关系语义` 同时接近 governance truth 和 method body,是最容易串仓的核心单元。
- `正式暴露与受控消费语义` 同时接近 runtime、tools 和 SDK,最容易把 consumer view / QueryCapabilities 写成 formal exposure truth。
- `派生维护与消费快照语义` 最容易被搜索、导出、reconciliation 或 cache 反写核心 truth。
- `安全与敏感边界引用` 最容易把 secret ref / safe summary 误写成 KMS / Vault truth。

取舍:

- 架构单元表按 `核心子域`、`支撑子域`、`本地索引 / 投影 / 引用` 三组展开。
- 每行同时写 truth、snapshot / projection、reference、forbidden body / write 和一致性口径。
- 不在单元表中写字段、schema、state、API、DTO、event、repository、worker 或测试切口。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 Step 5 所有架构单元 | pass | 五个核心、四个支撑、五类本地影子均覆盖。 |
| 是否逐单元区分四类数据 | pass | 每行都有 truth / snapshot / reference / forbidden body。 |
| 是否给出一致性口径 | pass | 每行都标出强一致、最终一致、引用有效性或边界约束。 |
| 是否可进入“架构单元数据规则:再写入” | pass | 可形成架构单元数据所有权表。 |

### 5.6 架构单元数据规则:再写入

| 架构单元 | 单元类型 | 本单元正式 truth | snapshot / projection | reference | forbidden body / forbidden write | 一致性口径 |
|---|---|---|---|---|---|---|
| 能力身份语义 | 核心子域 | 外部能力接入语境、capability identity、identity 风险解释。 | identity 读取摘要、候选接入摘要。 | external capability source ref、external standard / protocol ref。 | 外部系统正文、认证协议、provider runtime、URL / provider 名反写 identity。 | identity 内部强一致;外部来源引用要求引用有效性;候选摘要最终一致且不得自动正式化。 |
| 注册目录语义 | 核心子域 | capability registry entry、registry visibility / lifecycle semantics。 | directory search / browse summary、registry 可读摘要。 | external source ref、governance result ref 候选。 | allowlist、runtime cache、availability bit、marketplace listing、搜索索引反写 registry。 | registry 与 identity / visibility 强一致;搜索 / 浏览最终一致。 |
| 接入描述语义 | 核心子域 | adapter descriptor、descriptor risk / constraint summary。 | descriptor 读取摘要、secret handling safe summary。 | secret ref、external protocol / document ref、external capability source ref。 | ProviderContract、secret 正文、quota、route、failover、retry、cost、invocation result、provider runtime。 | descriptor 与 identity / registry 强一致;secret / external refs 引用有效性;safe summary 最终一致。 |
| 治理与方法关系语义 | 核心子域 | governance seam relation、access review responsibility separation fact、capability-method body-free relation。 | governance result safe summary、method relation allowed summary。 | governance result / policy result ref、method asset ref。 | approval、Policy、shared_rules、governance cache、method body、definition source truth。 | relation 内部强一致;governance / method refs 引用有效性;safe summary 不得替代 ref。 |
| 正式暴露与受控消费语义 | 核心子域 | formal exposure boundary、formal visibility / applicability fact。 | controlled consumer view / CapabilityDecision-style summary。 | runtime / tools consumer ref、SDK exposure consumer ref、governance result ref。 | runtime allow / deny、tool execution、Policy cache、SDK client、QueryCapabilities 旧 truth、consumer view 反写 exposure。 | exposure 与 registry / descriptor / seam 强一致;consumer view 最终一致;consumer refs 引用有效性。 |
| 接入审查与风险解释语义 | 支撑子域 | access review fact、risk explanation、职责分离解释。 | secret safe summary、governance safe summary、descriptor risk readout。 | secret ref、governance ref、external source ref。 | governance approval、认证系统 truth、KMS / Vault truth、runtime enforcement。 | review fact 与 descriptor / identity 强一致;外部 summary 最终一致;forbidden body 边界约束。 |
| 追溯与变化感知语义 | 支撑子域 | capability access traceability record、capability change / consumer impact fact。 | downstream consumption impact summary、observability / audit safe summary、exported trace summary。 | runtime / tools consumer ref、SDK exposure ref、observability / audit ref。 | observability store、log、trace、metric、alert、audit ledger、下游执行正文。 | 关键 truth 变化与追溯强一致;impact / observability summary 最终一致;refs 引用有效性。 |
| 派生维护与消费快照语义 | 支撑子域 | registry maintenance / reconciliation record。 | controlled consumer view、directory search / browse summary、exported capability access summary、rebuild / stale / unavailable 语义。 | governance ref、method ref、consumer ref、audit ref。 | projection / cache / search / export 反写 identity、registry、descriptor、seam、relation 或 exposure。 | 维护事实与其触发 truth 强一致;派生材料最终一致;失败时 stale / rebuilding / unavailable。 |
| 外围管理与发现语义 | 支撑子域 | 外围管理语境中与本仓 access truth 相关的正式解释事实。 | external capability candidate discovery summary、read-only ecosystem discovery summary、SDK 说明摘要、审计导出摘要。 | marketplace ecosystem object ref、external document ref、SDK exposure consumer ref。 | UI state、marketplace listing、transaction、pricing、fulfillment、SDK client、外部文档正文。 | 外围摘要最终一致;候选到正式 truth 必须显式转化;外部 refs 引用有效性。 |
| 外部能力来源引用 | 本地索引 / 投影 / 引用 | 无独立正式 truth;只拥有引用关系本身。 | 外部来源候选摘要、来源说明摘要。 | external MCP / A2A / API source ref、external standard / protocol ref。 | 外部协议正文、认证正文、provider 产品正文、production payload。 | 引用有效性一致;摘要最终一致;外部正文边界约束。 |
| 治理与方法外部引用 | 本地索引 / 投影 / 引用 | 无 governance / method 正文 truth;只拥有 seam / relation 所需引用关系。 | governance safe summary、method relation read summary。 | governance result / policy result ref、method asset ref。 | approval / Policy / shared_rules 正文、method body、method version body。 | 引用有效性一致;摘要不得替代 ref;正文边界约束。 |
| 安全与敏感边界引用 | 本地索引 / 投影 / 引用 | 无 secret 平台 truth;只拥有 secret ref 与允许安全摘要关系。 | secret handling safe summary、敏感边界解释摘要。 | secret ref、external security document ref。 | API key、token、password、private key、KMS / Vault truth、key rotation 正文。 | secret ref 引用有效性;safe summary 最终一致;secret 正文 forbidden。 |
| 下游消费与 SDK 引用 | 本地索引 / 投影 / 引用 | 无下游 execution 或 SDK client truth;只拥有 consumer ref / SDK exposure ref 关系。 | downstream consumption impact summary、controlled consumer view 投影。 | runtime / tools consumer ref、SDK exposure consumer ref。 | runtime execution、tool result、allow / deny decision、SDK client、language package、binding。 | consumer refs 引用有效性;consumer view 最终一致;执行 / SDK 正文边界约束。 |
| 观测 / 生态 / 外部文档引用 | 本地索引 / 投影 / 引用 | 无 observability、marketplace 或 external document truth;只拥有引用关系和允许摘要入口。 | observability / audit safe summary、read-only ecosystem discovery summary、external document summary。 | observability / audit ref、marketplace ecosystem object ref、external standard / protocol / document ref。 | log、trace、metric、alert、audit store、listing、transaction、pricing、fulfillment、外部文档正文。 | 引用有效性一致;摘要最终一致;正文边界约束。 |

#### 5.6.1 数据所有权停审记录

| 架构单元 | truth 是否唯一 | projection / cache 是否禁止反写 | external body 是否禁止保存 | 一致性口径是否清楚 | 停审结论 |
|---|---|---|---|---|---|
| 能力身份语义 | pass | pass | pass | pass | completed |
| 注册目录语义 | pass | pass | pass | pass | completed |
| 接入描述语义 | pass | pass | pass | pass | completed |
| 治理与方法关系语义 | pass | pass | pass | pass | completed |
| 正式暴露与受控消费语义 | pass | pass | pass | pass | completed |
| 接入审查与风险解释语义 | pass | pass | pass | pass | completed |
| 追溯与变化感知语义 | pass | pass | pass | pass | completed |
| 派生维护与消费快照语义 | pass | pass | pass | pass | completed |
| 外围管理与发现语义 | pass | pass | pass | pass | completed |
| 外部能力来源引用 | pass | pass | pass | pass | completed |
| 治理与方法外部引用 | pass | pass | pass | pass | completed |
| 安全与敏感边界引用 | pass | pass | pass | pass | completed |
| 下游消费与 SDK 引用 | pass | pass | pass | pass | completed |
| 观测 / 生态 / 外部文档引用 | pass | pass | pass | pass | completed |

---

## 6. 跨数据边界审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在双真相 | pass | capability access truth 归本仓;governance、method-library、runtime/tools、SDK、secret、marketplace、observability、cost 和 provider runtime 正文均不归本仓。 |
| 是否存在投影反写真相 | pass | controlled consumer view、search / browse summary、export summary、safe summary、ecosystem discovery 均明确不得反写 identity、registry、descriptor、seam、relation 或 exposure。 |
| 是否存在引用正文入仓 | pass | governance ref、method ref、secret ref、consumer ref、SDK ref、audit ref、marketplace ref、external document ref 均只保存关系,不保存正文。 |
| 是否存在强一致误用 | pass | 强一致仅用于本仓正式 truth 内部和关键 truth 变化追溯;不强压外部仓正文或下游运行状态。 |
| 是否存在最终一致误用 | pass | 最终一致仅用于派生、摘要、视图、导出、候选发现和下游影响摘要;不用于放松核心 truth 成立。 |
| 是否存在补偿口径下沉实现 | pass | 失败处理只写挂起、拒绝、unresolved、stale、rebuilding、unavailable 等架构语义,未写 retry、outbox、replay、cache 或脚本。 |
| 是否存在 forbidden body 漏项 | pass | secret、execution、provider runtime、cost、governance truth、method body、SDK client、marketplace、observability、production payload、LLM routing 均排除。 |
| 是否与 Step 7 依赖方向冲突 | pass | 数据归属未把 runtime / event / ref / summary / consumer boundary 升级为编译期依赖或源码 ownership。 |
| 是否与 Step 6 truth / 派生承载冲突 | pass | access truth 承载与受控消费 / 追溯派生承载保持分离。 |
| 是否存在未闭口项被误写成事实 | pass | descriptor 分类、governance seam 字段、method relation 摘要、secret safe summary、SDK 交接、API / DTO / state / implementation boundary 均未定形。 |

---

## 7. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| `MCPServer registry` | MCP 类外部能力需要接入来源、identity、registry 和 descriptor。 | 将 MCP 协议类别作为独立数据聚合、旧状态枚举或运行 registry truth。 | 重裁为 external source ref + capability identity + registry entry + adapter descriptor。 |
| `A2ANode directory` | A2A 类外部能力需要可信来源和目录语义。 | 将 A2A node 目录作为独立 truth 或认证 / runtime 目录。 | 重裁为 external source ref + capability identity + registry visibility。 |
| `ProviderContract` | 外部 API / provider 能力需要接入描述和约束解释。 | secret、quota、route、failover、retry、cost、provider runtime、invocation result。 | 重裁为 adapter descriptor + descriptor risk / constraint summary + secret ref / safe summary。 |
| `CapabilityDecision cache` | 下游需要稳定消费能力边界。 | 作为本仓 truth、runtime allow / deny、Policy cache、QueryCapabilities 旧语义。 | 降级为 controlled consumer view / CapabilityDecision-style summary,只能从 formal exposure 派生。 |
| `CostRecord` | 成本审计是历史诉求线索。 | append-only cost ledger、finance / billing truth、provider raw billing、cost retry。 | 排除为明确不拥有的正文 / 真相;仅保留为 historical conflict。 |
| governance `Policy refresh` / `last-known-good` | governance 结果会影响正式暴露边界。 | Policy truth、shared_rules、白名单刷新、replay、cache 补偿作为本仓数据策略。 | 重裁为 governance seam relation + governance result ref / safe summary;补偿机制后移且不得拥有 governance truth。 |
| provider key / KMS / Vault | descriptor 需要表达敏感边界。 | key 正文、KMS / Vault truth、key rotate、secret platform lifecycle。 | 重裁为 secret ref + secret handling safe summary;secret 正文 forbidden。 |
| PostgreSQL / cache / outbox | 可作为后续技术线索。 | 作为数据所有权或一致性策略的前提。 | 后移 Step 10 或后续设计重新论证,当前不作为所有权结论。 |
| audit / log / trace / metric | 接入事实需要可追溯。 | observability store、audit ledger、trace / metric 正文入仓。 | 本仓拥有 capability access traceability record;观测正文仅 ref / safe summary。 |
| marketplace metadata | 外围生态发现可能消费能力事实。 | listing、transaction、pricing、fulfillment 入仓。 | 仅保留 read-only ecosystem discovery summary 和 marketplace ecosystem object ref。 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 16 装配正式 `01-架构设计.md` 时可使用的 §9 候选文本。当前不得直接写入正式 `01-架构设计.md`。

### 8.1 数据所有权与一致性策略

`L3-capability-hub` 的正式数据真相是外部 capability access truth。正式真相包括 capability identity、registry entry、registry visibility / lifecycle semantics、adapter descriptor、descriptor risk / constraint summary、governance seam relation、access review responsibility separation fact、capability-method body-free relation、formal exposure boundary、formal visibility / applicability、capability access traceability record 和 change / consumer impact fact。

快照 / 投影只用于受控消费、搜索、浏览、导出、safe summary、候选发现、生态发现、下游影响摘要和观测 / 审计安全摘要;引用关系只保存 external capability source、governance result、method asset、secret、runtime / tools consumer、SDK exposure consumer、observability / audit、external standard / protocol / document 和 marketplace ecosystem object 的稳定回链。provider secret、KMS / Vault、runtime / tools execution、provider runtime、cost / billing、governance approval / Policy / shared_rules、method body、SDK client、marketplace transaction、observability store、production payload 和 LLM routing 正文均明确不属于本仓。

正式 truth 内部关系采用强一致;正式 truth 到派生视图、搜索、导出和受控消费摘要采用最终一致;正式 truth 到外部对象采用引用有效性一致;任何 forbidden body 的出现都按边界约束一致处理,只能拒绝、挂起或转化为 ref / allowed safe summary。正式文档可摘录本文件 §5.2 数据归属表、§5.4 一致性策略表和 §5.6 架构单元数据规则,但不得写字段、表、缓存、outbox、事务、协议、event schema 或代码对象模型。

---

## 9. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 `01` §8 数据矩阵与当前边界冲突 | historical_conflict_not_blocker | 旧矩阵把 ProviderContract、CapabilityDecision cache、CostRecord、Policy refresh、KMS/Vault 等混入本仓数据所有权。 | 已在 §7 重裁为当前四类数据或明确不拥有正文。 |
| governance seam 字段未完全确定 | not_blocking_step_09 | Step 8 已确认本仓拥有 seam relation、ref 和 allowed safe summary 边界;字段 / 协议后移。 | Step 9 讨论交互方式时继续保持 ref / safe summary 边界。 |
| method relation 摘要粒度未完全确定 | not_blocking_step_09 | Step 8 已确认 body-free relation truth 和 method body forbidden。 | 摘要字段后移 Step 9 / 后续设计,不得复制 method body。 |
| secret safe summary 粒度未完全确定 | not_blocking_step_09 | Step 8 已确认 secret ref + allowed safe summary,secret 正文和 secret platform truth forbidden。 | 后续安全 / 横切 / 详细设计继续细化允许摘要,不影响 Step 9。 |
| SDK exposure 交接细节未完全确定 | not_blocking_step_09 | Step 8 已确认服务端 formal exposure truth 与 SDK client truth 分离。 | Step 9 讨论交互方式时保持 server boundary / SDK consumer ref 分层。 |

结论: 未发现阻塞 `01-架构设计.md` Step 9 的上游 blocker。

---

## 10. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确四类架构数据类型 | pass | 使用 `正式真相数据`、`快照 / 投影数据`、`引用关系数据`、`明确不拥有的正文 / 真相`。 |
| 已先回答归属再回答一致性 | pass | §5.2 先给数据归属,§5.4 再给一致性策略。 |
| 已明确本仓正式 truth | pass | capability access truth 的核心数据项已闭合。 |
| 已明确快照 / 投影和引用边界 | pass | consumer view、search、export、safe summary、external refs 均不得反写真相。 |
| 已明确 forbidden body / forbidden write | pass | secret、execution、provider runtime、cost、governance truth、method body、SDK client、marketplace、observability、production payload、LLM routing 均覆盖。 |
| 已按架构单元逐个定义数据所有权 | pass | §5.6 覆盖 Step 5 的五个核心、四个支撑和五类本地影子单元。 |
| 已完成数据所有权停审 | pass | §5.6.1 每个架构单元均通过 truth 唯一、projection 禁止反写、external body 禁止保存和一致性口径检查。 |
| 已完成跨数据边界审计 | pass | §6 未发现 unresolved 的双真相、投影反写、引用正文入仓或一致性口径冲突。 |
| 已完成旧材料差异审计 | pass | §7 覆盖旧 `MCPServer`、`A2ANode`、`ProviderContract`、`CapabilityDecision`、`CostRecord`、Policy、KMS/Vault 等冲突。 |
| 未写实现层细节 | pass | 未写数据库表、字段、DDL、cache、projection、outbox、事务、event schema、API、repository、port 或代码对象模型。 |
| 正式 `01-架构设计.md` 是否保持未写入 | pass | 当前只创建 Step 8 中间产物;正式 `01` 必须等 Step 16 装配。 |
| 是否可进入 Step 9 | blocked_until_user_confirm | 必须等待用户确认后才能进入 Step 9 `关键交互与通信方式`。 |

当前 next_allowed_action:

```text
wait_user_review_to_step_09
```

当前不需要提交 commit。
