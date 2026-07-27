# L3-capability-hub 01 架构 Step 5: 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 回填章节: `01-架构设计.md` §6 限界上下文与子域划分
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、`01_arch_step_03_responsibility_boundary.md` 和 `01_arch_step_04_system_context.md` 推导内部语义结构;旧 README 和旧 `01-架构设计.md` 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 限界上下文与子域划分 |
| 输出文件 | `design-calibration/01_arch_step_05_bounded_context_subdomains.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 5;`架构设计书写规范.md` §4.6 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;正式 `00-需求文档.md` §7 / §9 / §10 / §11 / §12 / §13 / §15 |
| 已读取需求中间产物 | yes:`00_req_step_07_core_capability_loop.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:`README.md`;旧 `01-架构设计.md` §5 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 5;`L3-method-library` Step 5;`L0-sdk` Step 5 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 4 进入 Step 5 |
| next_allowed_action | Step 5 已完成,等待用户确认后进入 Step 6。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入核心子域思考。 |
| 核心子域:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入核心子域写入。 |
| 核心子域:再写入 | done | 核心子域表项 | pass | 进入支撑子域思考。 |
| 支撑子域:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入支撑子域写入。 |
| 支撑子域:再写入 | done | 支撑子域表项 | pass | 进入本地影子边界思考。 |
| 本地影子边界:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入本地影子边界写入。 |
| 本地影子边界:再写入 | done | 本地索引 / 投影 / 引用表项 | pass | 进入关系图与统一语言思考。 |
| 关系图与统一语言:先思考 | done | 上下文关系 / 统一语言候选 | pass | 进入关系图与统一语言写入。 |
| 关系图与统一语言:再写入 | done | 上下文关系图 / 统一语言表 | pass | 进入架构单元逐个停审。 |
| 架构单元逐个停审 | done | 单上下文停审记录 | pass | 进入跨上下文语义边界审计。 |
| 跨上下文语义边界审计 | done | 职责重叠 / 误归类 / 影子 truth / 语言冲突审计 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 6。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 5 必须输出子域 / 上下文划分、上下文关系、本地索引 / 投影 / 引用边界、统一语言、架构单元清单、单上下文停审和跨上下文审计。 | 本 Step 必须按上下文逐个小循环收敛,不能只给一张表。 |
| `standards/document/架构设计书写规范.md` §4.6 | 类型固定为核心子域、支撑子域、本地索引 / 投影 / 引用;不写字段、表、代码目录、函数、接口、容器或调用链。 | 划分必须按语义结构,不能按旧对象名、协议类别、代码模块或技术设施划分。 |
| `设计文档讨论中间产物规范.md` | 当前 Step 必须先思考后写入,并保留恢复门禁。 | 本文件保留模块级判断、结构化产物和停审状态,正式 `01` 暂不回填。 |
| `设计文档编写通则.md` | 限界上下文必须从职责边界、系统上下文和数据 / 依赖真相推导。 | 每个子域必须能回指 Step 3 / Step 4 或正式 `00` 的能力、规则、数据口径。 |
| `设计真相源闭环与可落码性标准.md` | 不得把本地影子结构写成核心 truth,不得制造多真相源。 | safe summary、ref、consumer view、搜索摘要、导出摘要和外部候选必须进入影子层或支撑层,不能成为核心子域。 |
| `全局项目依赖关系与裁剪规则.md` | 内部编译期依赖仅 `L0-core`;其他依赖按运行期、事件、ref、summary 或消费边界表达。 | 子域划分不得暗示 governance、method-library、runtime、tools、SDK、marketplace 或 observability 成为本仓内部源码子域。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 本仓正职责为 access truth、identity、registry、descriptor、risk / review、governance seam、body-free method relation、formal exposure、traceability / change impact 和派生维护 / safe summary 边界。 | 核心子域必须承载这些 truth 轴,非职责不得进入内部子域。 |
| `01_arch_step_04_system_context.md` | 系统上下文已收敛为外部能力来源、`L0-core / L0-bus`、`L1-governance`、`L3-method-library`、`L2-runtime / L2-tools`、`L0-sdk`,外围 console / marketplace / observability 只入表。 | Step 5 只讨论本仓内部语义结构,不重画外部对象;外部对象只能表现为本地引用 / 投影 / 摘要。 |
| 正式 `00-需求文档.md` §7 / §9 | C-CH-1~C-CH-5 与 FR-CH-001~016 已收敛为 identity、registry、descriptor、governance / method relation、formal exposure / change awareness。 | 核心子域从五段核心闭环推导。 |
| 正式 `00-需求文档.md` §10 | 规则钉住 identity、registry、descriptor、seam、relation、exposure 的不变量、禁止行为、显式变化和相邻仓边界。 | 支撑子域和本地影子边界必须防止 query、export、maintenance、runtime / SDK / marketplace 反写真相。 |
| 正式 `00-需求文档.md` §11 | 数据归属区分真相、快照、引用和禁止保存正文。 | 真相数据可推导核心 / 支撑子域;快照和引用必须进入本地影子层或派生支撑层。 |
| 正式 `00-需求文档.md` §12 | 接口与依赖仅是能力级边界,不写 API、DTO、event schema 或实现调用链。 | 本 Step 不按接口类型或旧 API 名划分上下文。 |
| 正式 `00-需求文档.md` §15 | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、marketplace / observability / API / DTO / boundary 等仍挂起。 | 未闭口项不得被写成确定核心子域或实现结构。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| `projects/L3-capability-hub/README.md` | historical material | 保留能力池、MCP / A2A / API 接入和治理联动线索;废弃 runtime 必经 hub、Provider key、Cost、KMS、marketplace、LLM routing。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` §5 | historical material | 只审计旧 `MCP Registry / A2A Directory / Provider Contract / Cost / Access` 划分,不得继承为新版限界上下文。 |
| `L1-governance` Step 5 | reference material | 参考核心 / 支撑 / 影子三层、单上下文停审和跨上下文审计粒度。 |
| `L3-method-library` Step 5 | reference material | 参考 full-restart 下从核心闭环推导内部语义结构的方式。 |
| `L0-sdk` Step 5 | reference material | 参考 official boundary 与本地 ref / snapshot / evidence 分层。 |

---

## 3. 整体模块骨架

Step 5 只讨论本仓内部语义结构,不按旧子域、协议类别、对象清单、代码模块、容器、数据库表、接口能力或运行调用链划分。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 核心子域 | 哪些内部语义单元是本仓核心闭环成立所必需。 | 不写字段、状态、接口、event、schema、表或 handler。 | 核心子域表项。 |
| 支撑子域 | 哪些语义围绕核心存在,但不是中心 truth 本体。 | 不把外围增强、派生视图或外部 ref 写成核心前置。 | 支撑子域表项。 |
| 本地影子边界 | 哪些只是外部上下文的本地索引 / 投影 / 引用。 | 不把 governance、method、secret、runtime、SDK、marketplace、observability 正文写成本仓 truth。 | 本地索引 / 投影 / 引用表项。 |
| 关系图与统一语言 | 各上下文如何语义依附,哪些词汇必须分层。 | 不写调用顺序、接口、事件、数据库关系或实现依赖。 | 上下文关系图和统一语言表。 |
| 架构单元逐个停审 | 每个上下文分类、职责、非职责和影子边界是否正确。 | 不提前进入容器、依赖方向、数据一致性或技术选型。 | 单上下文停审记录。 |
| 跨上下文语义审计 | 是否有职责重叠、核心误归类、影子 truth、统一语言冲突和待确认项误闭口。 | 不用后续 Step 替本 Step 补口。 | 跨上下文审计表。 |
| 旧材料差异审计 | 旧划分哪些可保留,哪些必须废弃或挂起。 | 不继承旧 completed 状态、旧技术口径或旧四子域。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 6。 | 不提前通过容器 / 部署门禁。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 核心子域:先思考

问题回答:

- 核心子域必须从 C-CH-1~C-CH-5 推导,而不是从旧 `MCPServer / A2ANode / ProviderContract / CapabilityDecision / CostRecord` 对象清单或旧四子域推导。
- 本仓成立所必需的核心语义是:能力身份、注册目录、接入描述、治理与方法关系、正式暴露与消费边界。
- 这五个核心子域共同保护 capability access truth:identity 提供锚点,registry 提供正式目录语义,descriptor 提供接入描述解释,seam / relation 提供治理与方法语境,exposure 提供服务端正式消费边界。
- 核心子域不能按 MCP / A2A / API 协议类别划分,因为协议类别只是外部来源与 descriptor 分类候选,不是本仓内部 truth 边界。

诊断:

- 如果沿用 `MCP Registry / A2A Directory`,就会把外部协议类别变成内部核心子域,导致相同 capability access truth 被拆成协议孤岛。
- 如果沿用 `Provider Contract`,会把 descriptor 与 secret、quota、route、cost、failover、provider runtime 重新绑在一起。
- 如果沿用 `Access Decision`,会把 formal exposure 与 runtime allow / deny、Policy cache、QueryCapabilities 混写。
- 如果把 `Cost Accounting` 作为支撑子域,会把非目标 cost / billing / finance ledger 引回本仓。

取舍:

- 核心子域收敛为五项:能力身份语义、注册目录语义、接入描述语义、治理与方法关系语义、正式暴露与受控消费语义。
- 接入审查事实、追溯、变化感知和维护支撑不单独作为核心子域;它们围绕五项核心 truth 建立支撑。
- 不把外部协议分类、SDK client、marketplace、observability、secret、cost 或 provider runtime 写成核心子域。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否从核心闭环推导 | pass | 五项核心子域分别对应 C-CH-1~C-CH-5。 |
| 是否避免旧对象清单 | pass | 未按 MCPServer、A2ANode、ProviderContract、CapabilityDecision、CostRecord 切分。 |
| 是否避免协议类别划分 | pass | MCP / A2A / API 作为来源和 descriptor 分类候选,不作为子域。 |
| 是否可进入“核心子域:再写入” | pass | 可转成核心子域表项。 |

### 4.2 核心子域:再写入

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 能力身份语义 | 核心子域 | 承载外部能力接入语境、稳定 capability identity 和身份风险解释语义。 | 是 capability access truth 的锚点,注册目录、接入描述、关系接缝和正式暴露均围绕它建立。 |
| 注册目录语义 | 核心子域 | 承载 capability registry、正式接入目录、可见性和生命周期语义。 | 依附能力身份语义,为接入描述、正式可见性和受控消费提供目录前提。 |
| 接入描述语义 | 核心子域 | 承载 adapter descriptor、接入方式、能力类型、风险和约束摘要语义。 | 依附能力身份和注册目录语义,支撑接入审查、治理接缝和下游解释。 |
| 治理与方法关系语义 | 核心子域 | 承载 governance seam relation、接入审查职责分离和 capability-method body-free relation 语义。 | 消费身份、目录和描述语义,为正式暴露和追溯提供治理 / 方法语境。 |
| 正式暴露与受控消费语义 | 核心子域 | 承载 formal exposure boundary、formal visibility / applicability 和 controlled consumer view 分层语义。 | 消费前序核心子域,向下游提供服务端正式消费边界且不得被下游反写。 |

### 4.3 支撑子域:先思考

问题回答:

- 支撑子域围绕核心 truth 存在,负责解释、保护、追溯、派生和维护,但不替代核心 truth。
- 接入审查与风险解释跨 identity、descriptor 和 governance seam,可作为支撑子域承接安全解释和职责分离,但不能变成 governance approval。
- 追溯与变化感知跨 identity、registry、descriptor、seam、relation 和 exposure,适合作为支撑子域。
- 派生维护与消费快照服务搜索、导出、对账、consumer view 和安全摘要,必须作为支撑或影子结构,不得成为核心写源。
- 外围管理与发现可以作为支撑 / 外围上下文记录,但不阻塞核心闭环。

诊断:

- `controlled consumer view` 与 `CapabilityDecision-style summary` 可能被误写成核心子域;正确位置是受正式暴露核心约束的派生消费表达。
- `registry maintenance / reconciliation` 是正式维护事实,但维护不得创造业务接入结论,因此支撑注册目录而不独立成为核心。
- `directory search / browse summary`、`exported capability access summary`、`read-only ecosystem discovery summary` 是快照 / 派生,不能作为核心子域。
- `secret handling safe summary` 需要承接安全解释,但 secret ref / safe summary 不能使本仓成为 secret/KMS 平台。

取舍:

- 支撑子域收敛为四项:接入审查与风险解释、追溯与变化感知、派生维护与消费快照、外围管理与发现。
- 不建立 `Cost`、`Provider Runtime`、`Access Decision`、`KMS`、`Marketplace Listing` 支撑子域。
- 支撑子域只写语义作用,不写后台任务、索引、导出、事件、缓存或 worker 机制。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否区分支撑和核心 | pass | 支撑子域均围绕核心 truth,不作为核心闭环前置真相。 |
| 是否承接追溯 / 派生 / 外围需求 | pass | 追溯、变化、维护、快照、管理、发现均有承接口径。 |
| 是否避免边界外职责 | pass | 未写 cost、KMS、provider runtime、marketplace listing 或 observability store 子域。 |
| 是否可进入“支撑子域:再写入” | pass | 可转成支撑子域表项。 |

### 4.4 支撑子域:再写入

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 接入审查与风险解释语义 | 支撑子域 | 承载能力身份和接入描述上的风险解释、接入审查事实和职责分离语义。 | 支撑能力身份、接入描述和治理关系语义,不替代 `L1-governance` approval。 |
| 追溯与变化感知语义 | 支撑子域 | 承载 capability access traceability、关键变化和 consumer impact 的解释语义。 | 消费所有核心子域,支撑下游变化感知和审计解释。 |
| 派生维护与消费快照语义 | 支撑子域 | 承载 registry maintenance、reconciliation、controlled consumer view、搜索 / 浏览 / 导出摘要等派生语义。 | 只能从核心 truth 派生,不得反写 identity、registry、descriptor、seam、relation 或 exposure。 |
| 外围管理与发现语义 | 支撑子域 | 承载管理入口、候选发现、安全摘要深化、SDK 说明和只读生态发现的外围语义。 | 围绕核心与派生语义工作,不得改变核心闭环成立条件。 |

### 4.5 本地影子边界:先思考

问题回答:

- 本地影子结构包括 external source ref、governance result / policy result ref、method asset ref、secret ref、runtime / tools consumer ref、SDK exposure consumer ref、observability / audit ref、marketplace ecosystem object ref、external standard / protocol / document ref 等。
- 这些结构用于稳定承接外部上下文,但不拥有外部正文 truth。
- 快照结构如 governance safe summary、secret handling safe summary、observability / audit safe summary、downstream impact summary、read-only ecosystem summary 必须在影子层或派生支撑层,不能成为核心子域。

诊断:

- governance result safe summary 容易被误写成治理子域;正确位置是治理关系语义的本地引用 / 快照边界。
- method asset ref 容易被 method relation 吸收为 method body;必须明确 body-free。
- secret ref 容易导致 KMS / Vault 子域回流;必须只作为引用 / safe summary。
- runtime / tools / SDK consumer ref 容易让消费状态变成 access truth;必须只作为消费边界引用或影响摘要。

取舍:

- 本地影子层收敛为五类:外部能力来源引用、治理与方法外部引用、安全与敏感边界引用、下游消费与 SDK 引用、观测 / 生态 / 外部文档引用。
- 不在本 Step 定义 ref 字段、摘要 schema、缓存、projection、rebuild 或 evidence 格式。
- 明确所有影子结构不得反写核心子域。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否把 ref / snapshot 降级 | pass | 外部来源、governance、method、secret、consumer、observability、marketplace 均在影子层。 |
| 是否保护 forbidden body | pass | 所有正文归属均保持边界外或禁止保存。 |
| 是否避免 schema 和机制 | pass | 未写字段、DTO、projection、cache、outbox、evidence。 |
| 是否可进入“本地影子边界:再写入” | pass | 可转成本地索引 / 投影 / 引用表项。 |

### 4.6 本地影子边界:再写入

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 外部能力来源引用 | 本地索引 / 投影 / 引用 | 为能力身份、注册目录和接入描述提供外部 MCP / A2A / API 来源引用。 | 服务能力身份与接入描述语义,不拥有外部协议、认证、provider runtime 或产品正文。 |
| 治理与方法外部引用 | 本地索引 / 投影 / 引用 | 为治理关系和方法关系提供 governance result ref、policy result ref、safe summary 和 method asset ref。 | 服务治理与方法关系语义,不保存 approval、Policy、shared_rules 或 method body。 |
| 安全与敏感边界引用 | 本地索引 / 投影 / 引用 | 为接入风险解释提供 secret ref、secret handling safe summary 和敏感边界引用。 | 服务接入审查与风险解释语义,不拥有 secret 正文、KMS / Vault truth 或 provider key 生命周期。 |
| 下游消费与 SDK 引用 | 本地索引 / 投影 / 引用 | 为 formal exposure、consumer impact 和 SDK exposure 提供 runtime / tools / SDK consumer ref 或影响摘要。 | 服务正式暴露、追溯与派生消费语义,不拥有 runtime execution、tool result 或 SDK client truth。 |
| 观测 / 生态 / 外部文档引用 | 本地索引 / 投影 / 引用 | 为审计协作、只读生态发现和接入说明提供 observability / audit ref、marketplace object ref、external standard / protocol / document ref。 | 服务追溯、外围发现和导出摘要,不拥有 observability store、marketplace listing 或外部正文。 |

### 4.7 关系图与统一语言:先思考

问题回答:

- 上下文关系图应以五个核心子域为上层主线,支撑子域位于中层,本地索引 / 投影 / 引用位于底层。
- 图不能出现外部上下文对象名、接口名、事件名、数据库表、容器或运行顺序。
- 统一语言必须区分 identity、registry、descriptor、seam、relation、formal exposure、consumer view、review、approval、safe summary、ref 等高频易混概念。

诊断:

- 如果图看起来像 `identity -> registry -> descriptor -> exposure` 的运行流程,会被误读成接口调用顺序;必须声明它表达语义依附关系。
- `governance seam` 与 `access review`、`method relation` 与 `method body`、`formal exposure` 与 `consumer view` 必须在统一语言里明确区分。
- 旧 `CapabilityDecision` 只能作为派生快照类术语,不能作为正式子域名。

取舍:

- 关系图采用三层:核心子域层、支撑子域层、本地影子层。
- 核心层按语义依附并列 / 顺序呈现,不表达调用。
- 统一语言表只给架构层含义和禁止混淆,不写字段或对象定义。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只画内部语义单元 | pass | 图中未出现外部仓、角色、接口或实现组件。 |
| 是否区分核心 / 支撑 / 影子层 | pass | 图中按层次排列。 |
| 是否定义统一语言 | pass | 易混词汇均有含义和禁止混淆。 |
| 是否可进入“关系图与统一语言:再写入” | pass | 可形成关系图和词汇表。 |

### 4.8 关系图与统一语言:再写入

#### 4.8.1 上下文关系图

```text
+---------------------+  +---------------------+  +---------------------+
| 能力身份语义        |  | 注册目录语义        |  | 接入描述语义        |
+----------+----------+  +----------+----------+  +----------+----------+
           |                        |                        |
           +------------------------+------------------------+
                                    |
                                    v
+---------------------+  +---------------------+
| 治理与方法关系语义  |  | 正式暴露与受控消费  |
+----------+----------+  +----------+----------+
           |                        |
           +------------+-----------+
                        |
                        v
+----------------------+----------------------+
| 支撑子域层                                  |
| 接入审查与风险解释 / 追溯与变化感知         |
| 派生维护与消费快照 / 外围管理与发现         |
+----------------------+----------------------+
                        |
                        v
+----------------------+----------------------+
| 本地索引 / 投影 / 引用层                    |
| 外部来源 / 治理方法 / 安全敏感 / 下游SDK /  |
| 观测生态外部文档引用                        |
+---------------------------------------------+
```

该图只表达 `L3-capability-hub` 内部语义结构,不表达外部仓、接口、事件、数据库、容器、代码模块或运行顺序。

图示说明:

- 核心子域围绕 capability access truth 展开,表达 identity、registry、descriptor、relation / seam、formal exposure 的语义依附。
- 支撑子域层围绕核心 truth 提供审查解释、追溯变化、派生维护和外围发现,不能独立生成第二份 access truth。
- 本地索引 / 投影 / 引用层只承接 ref、safe summary、projection 或外部文档入口,不得反向定义核心或支撑子域。
- 图中的上下关系表示语义依附和保护关系,不表示调用顺序、数据流、部署层级或实现依赖。

#### 4.8.2 统一语言词汇结论

| 词汇 | 架构层含义 | 禁止混淆 |
|---|---|---|
| capability identity | 外部能力在本仓 access truth 中的稳定主体锚点。 | 不等同于 URL、provider 名、tool config、runtime config、SDK client 或 marketplace listing。 |
| registry | 正式能力接入目录和生命周期语义。 | 不等同于 allowlist、runtime cache、availability bit、搜索索引或 marketplace listing。 |
| adapter descriptor | 描述外部能力接入方式、能力类型、风险和约束摘要的语义。 | 不等同于 Provider Contract、secret 容器、quota / route / cost / failover / retry 或 provider runtime。 |
| access review fact | 本仓对接入风险和审查职责分离的事实表达。 | 不等同于 governance approval、Policy effective fact 或执行拦截结论。 |
| governance seam | capability 与正式治理结果之间的关系边界。 | 不等同于 approval execution、Policy truth、shared_rules truth 或白名单刷新。 |
| method relation | capability 与 method asset 的 body-free 关系。 | 不等同于 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本。 |
| formal exposure | 服务端正式能力暴露边界和正式可见 / 适用语义。 | 不等同于 runtime allow / deny decision、QueryCapabilities 旧语义、Policy cache 或 SDK client。 |
| controlled consumer view | 从正式 access truth 派生的受控消费快照。 | 不等同于 formal exposure truth,也不能反写 registry、descriptor 或 exposure。 |
| safe summary | 对外部 truth 或敏感边界的允许摘要。 | 不等同于 secret、governance、method、observability、marketplace 或 provider 正文。 |
| ref / 本地引用 | 对外部对象的稳定引用入口。 | 不等同于外部对象正文、生命周期、执行状态或 truth owner。 |

---

## 5. 架构单元小循环记录

### 5.1 能力身份语义停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 类型是否正确 | pass | 能力身份是本仓 access truth 的主体锚点,属于核心子域。 |
| 职责 | pass | 承载外部能力接入语境、稳定 identity 和身份风险解释语义。 |
| 非职责 | pass | 不拥有外部系统正文、认证协议、provider runtime、URL 真相或 SDK client。 |
| 统一语言 | pass | identity 已与 URL、provider 名、config、marketplace listing 区分。 |
| 本地影子边界 | pass | 外部能力来源只作为 ref,不得替代 identity。 |
| 是否误写实现结构 | pass | 未写字段、表、service、repository、状态或接口。 |

### 5.2 注册目录语义停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 类型是否正确 | pass | registry 是受控目录和生命周期语义,属于核心子域。 |
| 职责 | pass | 承载 registry entry、可见性和生命周期语义。 |
| 非职责 | pass | 不承载 allowlist、runtime cache、availability bit、marketplace listing 或搜索索引 truth。 |
| 统一语言 | pass | registry 已与 allowlist、cache、listing 区分。 |
| 本地影子边界 | pass | 搜索 / 浏览摘要只能从 registry 派生。 |
| 是否误写实现结构 | pass | 未写数据库表、索引、状态枚举或维护任务实现。 |

### 5.3 接入描述语义停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 类型是否正确 | pass | adapter descriptor 是接入描述核心语义,属于核心子域。 |
| 职责 | pass | 承载接入方式、能力类型、风险和约束摘要语义。 |
| 非职责 | pass | 不承载 Provider Contract、secret、quota、route、cost、failover、retry 或 invocation truth。 |
| 统一语言 | pass | descriptor 已与 Provider Contract / provider runtime 区分。 |
| 本地影子边界 | pass | secret ref 和外部标准 ref 只作为本地引用。 |
| 是否误写实现结构 | pass | 未写 protocol object、DTO、字段、adapter 代码或 provider client。 |

### 5.4 治理与方法关系语义停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 类型是否正确 | pass | governance seam 与 method relation 是 C-CH-4 核心接缝,属于核心子域。 |
| 职责 | pass | 承载治理结果关系、接入审查职责分离和 body-free method relation 语义。 |
| 非职责 | pass | 不执行 approval,不拥有 Policy truth、shared_rules、method body 或 definition source truth。 |
| 统一语言 | pass | seam / review / approval 与 method relation / method body 均已区分。 |
| 本地影子边界 | pass | governance result ref、safe summary、method asset ref 只能作为本地引用。 |
| 是否误写实现结构 | pass | 未写 approval API、Policy cache、method schema、状态或同步机制。 |

### 5.5 正式暴露与受控消费语义停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 类型是否正确 | pass | formal exposure 和 controlled consumption 是 C-CH-5 核心消费边界,属于核心子域。 |
| 职责 | pass | 承载服务端正式暴露边界、正式可见 / 适用和消费快照分层语义。 |
| 非职责 | pass | 不执行 runtime/tool 调用,不拥有 SDK client、allow / deny enforcement、Policy cache 或 QueryCapabilities truth。 |
| 统一语言 | pass | formal exposure 与 controlled consumer view、runtime decision、SDK client 已区分。 |
| 本地影子边界 | pass | runtime / tools / SDK consumer ref 只作为引用或影响摘要。 |
| 是否误写实现结构 | pass | 未写 API、query、event、cache、SDK package 或 provider lookup。 |

### 5.6 支撑子域停审

| 上下文 | 类型检查 | 职责边界 | 非职责边界 | 是否通过 |
|---|---|---|---|---|
| 接入审查与风险解释语义 | pass | 支撑 identity、descriptor 和治理关系的风险解释。 | 不替代 governance approval、认证、KMS 或 runtime 拦截。 | pass |
| 追溯与变化感知语义 | pass | 支撑 access traceability、关键变化和 consumer impact 解释。 | 不成为 observability store、audit log 或事件 outbox。 | pass |
| 派生维护与消费快照语义 | pass | 支撑 maintenance、reconciliation、consumer view、搜索和导出摘要。 | 不反写核心 truth,不作为 QueryCapabilities / Access Decision truth。 | pass |
| 外围管理与发现语义 | pass | 支撑管理入口、候选发现、SDK 说明、只读生态和审计输出。 | 不阻塞核心闭环,不拥有 UI、marketplace 或 SDK client truth。 | pass |

### 5.7 本地影子层停审

| 本地结构 | 类型检查 | 允许边界 | 禁止边界 | 是否通过 |
|---|---|---|---|---|
| 外部能力来源引用 | pass | 保存外部来源 ref / 摘要入口。 | 不拥有外部协议、认证、provider runtime 或正文。 | pass |
| 治理与方法外部引用 | pass | 保存 governance result ref、safe summary、method asset ref。 | 不保存 approval / Policy / shared_rules / method body。 | pass |
| 安全与敏感边界引用 | pass | 保存 secret ref 和安全 safe summary。 | 不拥有 secret、KMS / Vault、provider key 或密钥生命周期。 | pass |
| 下游消费与 SDK 引用 | pass | 保存 consumer ref、SDK exposure ref、影响摘要。 | 不拥有 execution、tool result、SDK client 或客户端 package。 | pass |
| 观测 / 生态 / 外部文档引用 | pass | 保存 audit ref、marketplace object ref、external document ref。 | 不拥有 observability store、listing、transaction、external document body。 | pass |

---

## 6. 跨上下文语义边界审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在核心子域职责重叠 | pass | identity、registry、descriptor、seam / relation、exposure 分别承载不同 truth 轴。 |
| 是否存在核心子域误归类 | pass | 维护、快照、外围管理、审计导出和生态发现均未写成核心子域。 |
| 是否存在本地投影误作真相 | pass | consumer view、safe summary、ref、search / export / ecosystem summary 均为支撑或影子层。 |
| 是否存在旧四子域回流 | pass | MCP Registry / A2A Directory 未作为内部核心子域;Provider Contract、Cost、Access Decision 已废弃或降级。 |
| 是否存在外部 truth 串仓 | pass | governance、method-library、runtime/tools、SDK、marketplace、observability、secret 均只通过 seam / ref / summary / consumer boundary 协作。 |
| 是否存在统一语言冲突 | pass | identity、registry、descriptor、review、seam、relation、exposure、consumer view、safe summary、ref 均已分层。 |
| 是否存在待确认项被误闭口 | pass | descriptor 分类、governance seam 字段、method relation 摘要、secret safe summary、SDK 交接、API / DTO / state / boundary 均未在本 Step 定形。 |
| 是否误写实现结构 | pass | 未写字段、表、代码目录、handler、service、repository、API、event、cache、outbox 或部署组件。 |

---

## 7. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| 旧 `MCP Registry` | MCP 类外部能力需要身份和注册目录语义。 | 将 MCP 协议类别当作独立核心子域或执行注册中心。 | 重裁为能力身份语义、注册目录语义和外部能力来源引用。 |
| 旧 `A2A Directory` | A2A 类外部能力需要身份可信和目录语义。 | 将 A2A 节点目录当作独立核心子域、认证协议或运行目录。 | 重裁为能力身份语义、注册目录语义和接入审查支撑。 |
| 旧 `Provider Contract` | 外部 API / provider API surface 需要接入描述。 | ProviderContract、secret、quota、route、cost、failover、retry 和 provider runtime 作为核心子域。 | 重裁为接入描述语义;secret / runtime / cost 进入禁止或引用边界。 |
| 旧 `Cost Accounting` | 成本审计是历史诉求线索。 | CostRecord、billing、finance ledger、cost worker 作为支撑子域。 | 废弃为边界外 historical conflict;不进入新版子域。 |
| 旧 `Access Decision` / `QueryCapabilities` | 下游需要消费正式能力边界。 | allow / deny、runtime cache、Policy cache、QueryCapabilities 作为支撑子域。 | 重裁为正式暴露与受控消费语义 + 派生消费快照语义。 |
| 旧 `Policy-aware query` | governance seam 是核心边界。 | Policy 消费、白名单刷新、shared_rules truth、last-known-good cache 作为内部上下文。 | 重裁为治理与方法关系语义 + governance result ref / safe summary。 |
| 旧 KMS / Vault | 接入描述需要敏感边界保护。 | KMS / Vault、key management、secret lifecycle 成为支撑子域。 | 仅作为安全与敏感边界引用 / safe summary,不拥有 secret truth。 |
| 旧 PostgreSQL / cache / outbox / worker | 可作为后续技术选型历史线索。 | 技术设施或实现组件作为限界上下文。 | 后续 Step 6 / 10 / 12 重新论证,当前不作为子域。 |

---

## 8. 结构化中间产物

### 8.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 能力身份语义 | 核心子域 | 承载外部能力接入语境、稳定 capability identity 和身份风险解释语义。 | 是 capability access truth 的锚点,注册目录、接入描述、关系接缝和正式暴露均围绕它建立。 |
| 注册目录语义 | 核心子域 | 承载 capability registry、正式接入目录、可见性和生命周期语义。 | 依附能力身份语义,为接入描述、正式可见性和受控消费提供目录前提。 |
| 接入描述语义 | 核心子域 | 承载 adapter descriptor、接入方式、能力类型、风险和约束摘要语义。 | 依附能力身份和注册目录语义,支撑接入审查、治理接缝和下游解释。 |
| 治理与方法关系语义 | 核心子域 | 承载 governance seam relation、接入审查职责分离和 capability-method body-free relation 语义。 | 消费身份、目录和描述语义,为正式暴露和追溯提供治理 / 方法语境。 |
| 正式暴露与受控消费语义 | 核心子域 | 承载 formal exposure boundary、formal visibility / applicability 和 controlled consumer view 分层语义。 | 消费前序核心子域,向下游提供服务端正式消费边界且不得被下游反写。 |
| 接入审查与风险解释语义 | 支撑子域 | 承载能力身份和接入描述上的风险解释、接入审查事实和职责分离语义。 | 支撑能力身份、接入描述和治理关系语义,不替代 `L1-governance` approval。 |
| 追溯与变化感知语义 | 支撑子域 | 承载 capability access traceability、关键变化和 consumer impact 的解释语义。 | 消费所有核心子域,支撑下游变化感知和审计解释。 |
| 派生维护与消费快照语义 | 支撑子域 | 承载 registry maintenance、reconciliation、controlled consumer view、搜索 / 浏览 / 导出摘要等派生语义。 | 只能从核心 truth 派生,不得反写 identity、registry、descriptor、seam、relation 或 exposure。 |
| 外围管理与发现语义 | 支撑子域 | 承载管理入口、候选发现、安全摘要深化、SDK 说明和只读生态发现的外围语义。 | 围绕核心与派生语义工作,不得改变核心闭环成立条件。 |
| 外部能力来源引用 | 本地索引 / 投影 / 引用 | 为能力身份、注册目录和接入描述提供外部 MCP / A2A / API 来源引用。 | 服务能力身份与接入描述语义,不拥有外部协议、认证、provider runtime 或产品正文。 |
| 治理与方法外部引用 | 本地索引 / 投影 / 引用 | 为治理关系和方法关系提供 governance result ref、policy result ref、safe summary 和 method asset ref。 | 服务治理与方法关系语义,不保存 approval、Policy、shared_rules 或 method body。 |
| 安全与敏感边界引用 | 本地索引 / 投影 / 引用 | 为接入风险解释提供 secret ref、secret handling safe summary 和敏感边界引用。 | 服务接入审查与风险解释语义,不拥有 secret 正文、KMS / Vault truth 或 provider key 生命周期。 |
| 下游消费与 SDK 引用 | 本地索引 / 投影 / 引用 | 为 formal exposure、consumer impact 和 SDK exposure 提供 runtime / tools / SDK consumer ref 或影响摘要。 | 服务正式暴露、追溯与派生消费语义,不拥有 runtime execution、tool result 或 SDK client truth。 |
| 观测 / 生态 / 外部文档引用 | 本地索引 / 投影 / 引用 | 为审计协作、只读生态发现和接入说明提供 observability / audit ref、marketplace object ref、external standard / protocol / document ref。 | 服务追溯、外围发现和导出摘要,不拥有 observability store、marketplace listing 或外部正文。 |

### 8.2 上下文关系图

```text
+---------------------+  +---------------------+  +---------------------+
| 能力身份语义        |  | 注册目录语义        |  | 接入描述语义        |
+----------+----------+  +----------+----------+  +----------+----------+
           |                        |                        |
           +------------------------+------------------------+
                                    |
                                    v
+---------------------+  +---------------------+
| 治理与方法关系语义  |  | 正式暴露与受控消费  |
+----------+----------+  +----------+----------+
           |                        |
           +------------+-----------+
                        |
                        v
+----------------------+----------------------+
| 支撑子域层                                  |
| 接入审查与风险解释 / 追溯与变化感知         |
| 派生维护与消费快照 / 外围管理与发现         |
+----------------------+----------------------+
                        |
                        v
+----------------------+----------------------+
| 本地索引 / 投影 / 引用层                    |
| 外部来源 / 治理方法 / 安全敏感 / 下游SDK /  |
| 观测生态外部文档引用                        |
+---------------------------------------------+
```

该图只表达 `L3-capability-hub` 内部语义结构,不表达外部仓、接口、事件、数据库、容器、代码模块或运行顺序。

图示说明:

- 核心子域围绕 capability access truth 展开,表达 identity、registry、descriptor、relation / seam、formal exposure 的语义依附。
- 支撑子域层围绕核心 truth 提供审查解释、追溯变化、派生维护和外围发现,不能独立生成第二份 access truth。
- 本地索引 / 投影 / 引用层只承接 ref、safe summary、projection 或外部文档入口,不得反向定义核心或支撑子域。
- 图中的上下关系表示语义依附和保护关系,不表示调用顺序、数据流、部署层级或实现依赖。

### 8.3 本地索引 / 投影 / 引用边界结论

| 本地结构 | 允许做什么 | 禁止做什么 |
|---|---|---|
| 外部能力来源引用 | 保存外部 MCP / A2A / API 来源 ref、外部标准 ref 或安全摘要入口。 | 不拥有外部协议正文、认证协议、provider runtime、生产请求 / 响应或外部产品正文。 |
| 治理与方法外部引用 | 保存 governance result ref、policy result ref、allowed safe summary、method asset ref。 | 不保存 approval、Policy effective fact、shared_rules、Method Content、TaskDefinition、AIPolicyDef 或方法正文版本。 |
| 安全与敏感边界引用 | 保存 secret ref、secret handling safe summary 和敏感边界引用。 | 不保存 provider API key、token、password、private key、KMS / Vault truth 或密钥生命周期正文。 |
| 下游消费与 SDK 引用 | 保存 runtime / tools consumer ref、SDK exposure consumer ref、downstream impact summary。 | 不保存 runtime execution、tool result、provider lookup、SDK client、language package 或客户端便利封装正文。 |
| 观测 / 生态 / 外部文档引用 | 保存 observability / audit ref、read-only ecosystem object ref、external document ref。 | 不保存 log、trace、metric、alert、audit store、marketplace listing、transaction、pricing、fulfillment 或外部文档正文。 |

### 8.4 统一语言词汇结论

| 词汇 | 架构层含义 | 禁止混淆 |
|---|---|---|
| capability identity | 外部能力在本仓 access truth 中的稳定主体锚点。 | 不等同于 URL、provider 名、tool config、runtime config、SDK client 或 marketplace listing。 |
| registry | 正式能力接入目录和生命周期语义。 | 不等同于 allowlist、runtime cache、availability bit、搜索索引或 marketplace listing。 |
| adapter descriptor | 描述外部能力接入方式、能力类型、风险和约束摘要的语义。 | 不等同于 Provider Contract、secret 容器、quota / route / cost / failover / retry 或 provider runtime。 |
| access review fact | 本仓对接入风险和审查职责分离的事实表达。 | 不等同于 governance approval、Policy effective fact 或执行拦截结论。 |
| governance seam | capability 与正式治理结果之间的关系边界。 | 不等同于 approval execution、Policy truth、shared_rules truth 或白名单刷新。 |
| method relation | capability 与 method asset 的 body-free 关系。 | 不等同于 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本。 |
| formal exposure | 服务端正式能力暴露边界和正式可见 / 适用语义。 | 不等同于 runtime allow / deny decision、QueryCapabilities 旧语义、Policy cache 或 SDK client。 |
| controlled consumer view | 从正式 access truth 派生的受控消费快照。 | 不等同于 formal exposure truth,也不能反写 registry、descriptor 或 exposure。 |
| safe summary | 对外部 truth 或敏感边界的允许摘要。 | 不等同于 secret、governance、method、observability、marketplace 或 provider 正文。 |
| ref / 本地引用 | 对外部对象的稳定引用入口。 | 不等同于外部对象正文、生命周期、执行状态或 truth owner。 |

---

## 9. 回填草稿

正式 `01-架构设计.md` 后续 Step 16 装配时:

| 正式章节 | 回填来源 | 回填口径 |
|---|---|---|
| §6.1 子域 / 上下文划分表 | 本文件 §8.1 | 直接整理核心子域、支撑子域和本地索引 / 投影 / 引用表;不得使用旧四子域名作为正式划分。 |
| §6.2 上下文关系图 | 本文件 §8.2 | 直接整理上下文关系图和说明;不得加入外部仓、接口、事件、数据库或代码模块。 |
| §6.3 本地索引 / 投影 / 引用边界 | 本文件 §8.3 | 说明 ref / safe summary / projection 的允许与禁止边界。 |
| §6.4 统一语言词汇 | 本文件 §8.4 | 保留易混术语的架构层含义和禁止混淆。 |

不得在 Step 16 之外提前修改正式 `01-架构设计.md`。

---

## 10. 自检与停审

### 10.1 完成标准自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确内部语义结构层次 | pass | 已分为核心子域、支撑子域、本地索引 / 投影 / 引用三层。 |
| 是否区分核心子域 | pass | 核心子域为 identity、registry、descriptor、governance / method relation、formal exposure / controlled consumption。 |
| 是否区分支撑子域 | pass | 支撑子域承接 access review / risk、traceability / change、derived maintenance / consumer snapshot、peripheral management / discovery。 |
| 是否区分本地影子结构 | pass | 外部来源、governance / method、secret、安全、downstream / SDK、observability / marketplace / external document 均为 ref / summary / projection 边界。 |
| 是否逐上下文停审 | pass | §5 已按核心、支撑和影子结构逐个完成类型、职责、非职责、统一语言、影子边界和实现结构检查。 |
| 是否完成跨上下文审计 | pass | §6 已审计职责重叠、误归类、旧口径回流、外部 truth 串仓、统一语言冲突和待确认项误闭口。 |
| 是否避免实现结构 | pass | 未写字段、表、代码目录、handler、service、repository、API、event、cache、outbox、容器或部署组件。 |
| 是否阻止旧材料回流 | pass | 旧 MCP Registry / A2A Directory / Provider Contract / Cost / Access Decision 均已重裁或废弃。 |

### 10.2 当前 blocker 判断

| blocker | 状态 | 判断 |
|---|---|---|
| 上游需求 blocker | none | 正式 `00`、Step 1~4 足以支撑限界上下文与子域划分。 |
| 旧材料冲突 | not_blocking | 冲突已记录为 historical material,未作为新版子域基线。 |
| 未闭口事项 | not_blocking_step_06 | descriptor 分类、governance seam 字段、method relation 摘要、secret safe summary、SDK 交接、API / DTO / state / boundary 后续继续闭口,不阻塞 Step 6。 |

### 10.3 下一步门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 `限界上下文与子域划分` completed_stop_review |
| 当前正式文档 | `01-架构设计.md` 未修改;必须等 Step 16 装配 |
| next_allowed_action | `wait_user_review_to_step_06` |
| 下一步应读 | `架构设计讨论流程_SOP.md` Step 6;`架构设计书写规范.md` §4.7;本文件;`01_arch_step_01~04`;正式 `00-需求文档.md`;参考项目 Step 6 |

当前不需要提交 commit。
