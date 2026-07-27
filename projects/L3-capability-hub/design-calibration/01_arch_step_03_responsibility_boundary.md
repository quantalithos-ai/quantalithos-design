# L3-capability-hub 01 架构 Step 3: 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、`01_arch_step_01_requirement_baseline.md` 和 `01_arch_step_02_goals_constraints.md` 推导职责边界;旧 README 和旧 `01-架构设计.md` 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 职责边界 |
| 输出文件 | `design-calibration/01_arch_step_03_responsibility_boundary.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 3;`架构设计书写规范.md` §4.4 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;正式 `00-需求文档.md` §2 / §4 / §10 / §11 / §12 / §15 |
| 已读取需求中间产物 | yes:`00_req_step_02_position_boundary.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:`README.md`;旧 `01-架构设计.md` §1~§8 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 3;`L3-method-library` Step 3;`L0-sdk` Step 3 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 2 进入 Step 3 |
| next_allowed_action | Step 3 已完成,等待用户确认后进入 Step 4。 |

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
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 4。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 3 要明确本仓做什么、不做什么、易混淆职责和边界红线。 | 本 Step 只收职责归属,不重画系统上下文图,不展开子域、数据矩阵、接口协议或实现依赖。 |
| `standards/document/架构设计书写规范.md` | §4.4 固定输出职责边界表和边界红线清单,类型只允许“做 / 不做 / 易混淆职责”。 | 职责表必须使用三类类型,说明列只写职责归因或边界原因。 |
| `standards/document/设计文档讨论中间产物规范.md` | 当前 Step 必须先思考后写入,并保留恢复门禁。 | 本文件保留模块级状态、结构化产物和停审状态,正式 `01` 暂不回填。 |
| `standards/document/设计文档编写通则.md` | 职责边界需要提前收束可追溯决策。 | 每条职责必须能回指需求基线、架构目标约束、规则、数据归属或边界风险。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 设计结论不得制造多真相源或隐式跨仓 ownership。 | 本 Step 必须防止将相邻仓运行职责、正文职责或消费职责写成本仓职责。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 是唯一编译期依赖候选;其余关系按运行期、事件、ref、summary 或消费边界表达。 | 职责边界必须避免把依赖对象写成源码级拥有关系。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已确认本仓是 capability access truth owner,旧材料只作 historical material;ARB-CH、AHC-CH、ARR-CH 已收敛。 | 职责边界必须围绕 access truth 轴展开。 |
| `01_arch_step_02_goals_constraints.md` | 已收敛 AG-CH-001~009、ACN-CH-001~013、AT-CH-001~009、ANG-CH-001~012。 | 职责必须承接 capability access truth、identity / registry、descriptor、governance seam、method relation、formal exposure、变化追溯和外围隔离。 |
| `00-需求文档.md` §2 / `00_req_step_02_position_boundary.md` | 本仓定位为外部 MCP / A2A / API capability identity、registry、adapter descriptor 的能力接入真相仓;不是 execution、method body、governance approval、SDK client、provider runtime、secret、cost、marketplace 或 LLM routing 仓。 | 正职责和非职责必须从该仓级定位展开。 |
| `00-需求文档.md` §10 / `00_req_step_10_business_rules_boundaries.md` | `BR-CH-001~037` 钉住不变量、禁止行为、显式变化、相邻仓边界、治理约束和审计约束。 | 边界红线必须覆盖 identity、registry、descriptor、seam、relation、exposure 不被隐式改写。 |
| `00-需求文档.md` §11 / `00_req_step_11_data_ownership.md` | 本仓拥有 access truth;safe summary、ref、consumer view 只可作为快照或引用;forbidden body 明确排除。 | 职责边界不得把 snapshot / ref / forbidden body 写成正职责 truth。 |
| `00-需求文档.md` §12 / `00_req_step_12_interfaces_dependencies.md` | 能力级接口与依赖已按 identity、registry、descriptor、seam、relation、exposure 和变化感知组织。 | Step 3 可借用能力面判断职责,但不得写接口协议、DTO 或事件 schema。 |
| `00-需求文档.md` §15 / `00_req_step_15_risks_open_questions.md` | governance seam 形态、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、外围接缝、API / DTO / state / boundary 均挂起。 | 待确认项不能在 Step 3 被写成确定核心职责。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| `projects/L3-capability-hub/README.md` | historical material | 保留“能力接入中心、MCP / A2A / Provider 线索”;废弃 runtime 必经 hub、Provider key / cost / LLM routing、Policy 下发白名单、KMS、成本记账等职责口径。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | historical material | 只审计旧职责、旧子域、旧容器和旧技术假设;不继承 MCP Registry / Provider Contract / Cost / Access 四子域职责。 |
| `L1-governance` Step 3 | reference material | 参考做 / 不做 / 易混淆职责和边界红线的密度。 |
| `L3-method-library` Step 3 | reference material | 参考 full-restart 下正职责、非职责、易混淆职责的过程记录。 |
| `L0-sdk` Step 3 | reference material | 参考服务端 exposure 与 SDK client / package 的分界写法。 |

---

## 3. 整体模块骨架

Step 3 只回答职责归属,不画系统上下文、不划分限界上下文、不定义容器、数据所有权矩阵、通信方式、接口协议、状态机、存储或技术机制。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 正职责 | 本仓在 capability access truth 方面正式承担什么。 | 不写创建、查询、导出、事件、后台任务等接口动作。 | “做”职责表。 |
| 非职责 | 哪些相邻仓职责明确不属于本仓。 | 不替相邻仓设计自己的架构。 | “不做”职责表。 |
| 易混淆职责 | 哪些概念看起来相关但必须显式分层。 | 不写 API、DTO、event、repository、状态机或数据字段。 | “易混淆职责”表。 |
| 边界红线 | 哪些行为绝不能隐式发生。 | 不写校验代码、测试脚本、错误码或实现机制。 | 边界红线清单。 |
| 旧材料差异审计 | 旧职责方向哪些可保留,哪些必须废弃或挂起。 | 不继承旧 Draft 状态、旧技术口径或旧子域。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 4。 | 不提前通过系统上下文门禁。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 正职责:先思考

问题回答:

- `L3-capability-hub` 正式承担的不是“外部能力调用控制”或“Provider 管理中台”,而是外部能力接入事实的真相承载。
- 正职责必须围绕 Step 2 架构目标成立:capability access truth、稳定 identity / registry、adapter descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view 分层、变化追溯与外围隔离。
- 从数据归属看,本仓确实拥有外部能力接入语境、capability identity、registry entry、descriptor、descriptor risk / constraint summary、governance seam relation、access review responsibility separation fact、capability-method body-free relation、formal exposure boundary、visibility / applicability、change / consumer impact fact 等真相。
- 从接口需求看,本仓对外提供这些职责的能力边界,但 Step 3 不能把变更接口、查询接口、事件输出或后台任务写成职责项本体。
- governance result ref、method asset ref、secret ref、runtime / tools consumer ref、SDK exposure consumer ref、observability ref 和 marketplace object ref 可作为职责相关边界,但不是本仓拥有的外部正文 truth。

诊断:

- 如果正职责写成“MCP Registry、A2A Directory、Provider Contract、QueryCapabilities、Cost Accounting、governance Policy 消费”,就会把旧 `01` 的功能 / 子域 / 接口 / 成本 / 执行口径重新带回架构。
- “adapter descriptor”是正职责,但“Provider Contract”不是正职责名称;后者会吸入 secret、quota、route、cost、failover、provider runtime。
- “formal exposure boundary”是正职责,但“QueryCapabilities / allow-deny decision”不是正职责;后者会吸入 runtime decision 和 Policy cache。
- “governance seam relation”是正职责,但“Policy 消费 / 白名单刷新”不是正职责;后者会把 governance truth 和执行缓存带进来。

取舍:

- 正职责收敛为十项:access truth、identity、registry、descriptor、descriptor risk / access review、governance seam、body-free method relation、formal exposure、traceability / change impact、derived maintenance / safe summary 边界。
- 不把外围增强单列为核心正职责,只将派生维护和安全摘要边界写成“做但不得反写”的职责。
- 不写系统上下文、依赖方向、数据字段、协议、状态或技术栈。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成职责归属 | pass | 只表达本仓正式承担的结构性职责。 |
| 是否避免功能项 | pass | 未把接口动作、查询名、事件名或后台任务写成职责项。 |
| 是否保留待确认项 | pass | 未把 descriptor 分类、seam 字段、SDK 交接等挂起项写成确定细节。 |
| 是否可进入“正职责:再写入” | pass | 可转成“做”职责表。 |

### 4.2 正职责:再写入

| 职责项 | 类型 | 说明 |
|---|---|---|
| capability access truth 承载 | 做 | 这是本仓存在的核心职责,否则外部能力接入事实会散落到执行、治理、SDK 或生态侧。 |
| 外部能力接入语境与 capability identity 承载 | 做 | 稳定身份是 registry、descriptor、seam、relation 和 exposure 的共同锚点。 |
| capability registry 与可见性 / 生命周期语义承载 | 做 | 注册目录需要由本仓形成正式接入事实,不能退化为 allowlist、cache 或 listing。 |
| adapter descriptor 承载 | 做 | 本仓拥有接入方式、能力类型和边界约束的接入描述语义。 |
| descriptor risk / constraint summary 与 access review fact 承载 | 做 | 本仓需要解释外部连接风险和接入审查语境,但不替代 governance approval。 |
| governance seam relation 承载 | 做 | 本仓维护 capability 与正式治理结果之间的关系边界,但不拥有治理正文。 |
| capability-method body-free relation 承载 | 做 | capability 与 method asset 的适用关系属于本仓接入事实,但不能保存 method body。 |
| formal exposure boundary 与 formal visibility / applicability 承载 | 做 | 服务端正式能力边界必须由本仓定义,不能由 runtime、tools、SDK 或查询视图反写。 |
| capability access traceability 与 change / consumer impact fact 承载 | 做 | 关键接入事实变化和下游影响需要可解释来源、范围和结果。 |
| 派生维护、受控消费快照和安全摘要边界维护 | 做 | 搜索、导出、对账、consumer view 和 safe summary 可服务消费,但只能从正式 access truth 派生。 |

### 4.3 非职责:先思考

问题回答:

- 非职责不是“当前阶段暂不做”,而是已经由需求目标、规则、数据归属和 Step 2 非目标明确排除的相邻真相域职责。
- 本仓不承担 runtime / tools execution、allow / deny enforcement、provider invocation、provider runtime、secret/KMS、cost/billing、governance approval、method body、SDK client、marketplace transaction、observability store、LLM routing、UI / console state 等职责。
- 这些非职责仍可能与本仓发生引用、摘要、消费或事件协作,但这种协作不能改变职责归属。

诊断:

- 旧 README 和旧 `01` 把 provider key、quota、cost、failover、KMS、QueryCapabilities、Policy refresh、cost worker 都写进仓职责,这些不是阶段取舍,而是边界外或 historical conflict。
- 如果把 secret / KMS、cost / billing、marketplace listing、observability audit store 写成“以后再做”,后续会自然变成本仓子域。
- 如果把 governance approval 或 method body 写成“本仓可选同步”,会直接打穿 `L1-governance` 和 `L3-method-library` 的 truth owner。

取舍:

- 非职责收敛为十三项,覆盖 execution、provider runtime、secret、cost、governance、method、SDK、marketplace、observability、LLM routing、external protocol body、UI / console、API / DTO / implementation boundary。
- 最后一项“API / DTO / state / implementation boundary”不是永久非目标,但在 Step 3 的职责边界中明确“不由本 Step 定义”,防止实现端补口径。
- 不写相邻仓内部架构、接口或实现方案。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成明确排除职责 | pass | 每项都回答本仓不承担什么。 |
| 是否与阶段取舍区分 | pass | 潜在本仓范围的 seam / relation / exposure 保留为正职责或易混淆职责。 |
| 是否避免替相邻仓设计 | pass | 未写相邻仓对象、接口、状态或部署方案。 |
| 是否可进入“非职责:再写入” | pass | 可转成“不做”职责表。 |

### 4.4 非职责:再写入

| 职责项 | 类型 | 说明 |
|---|---|---|
| runtime execution、tools execution 和外部调用执行链 | 不做 | 这些属于 `L2-runtime` / `L2-tools`,进入本仓会把 access truth 与 execution truth 混合。 |
| allow / deny enforcement、runtime cache 和 provider lookup execution | 不做 | 执行裁决和运行查询不属于服务端 formal exposure truth。 |
| provider runtime、failover、retry、routing、quota 和 invocation result | 不做 | 这些属于 provider adapter / runtime orchestration,不是接入事实真相。 |
| secret/KMS/Vault 平台、API key 托管和密钥生命周期 | 不做 | 本仓最多保存 secret ref 或 safe summary,不拥有 secret 正文或安全基础设施 truth。 |
| cost accounting、billing、finance ledger 和 provider raw billing | 不做 | 成本、账单和财务对账不属于 capability access truth。 |
| governance approval execution、Policy effective fact、shared_rules truth 和治理缓存 | 不做 | 这些属于 `L1-governance`,本仓只维护 seam relation 或允许摘要。 |
| method asset body、definition source truth、method version body 和方法资产发布语义 | 不做 | 这些属于 `L3-method-library`,本仓只维护 body-free relation。 |
| SDK client、多语言 package、language binding、local candidate 和 developer experience | 不做 | 这些属于 `L0-sdk`,本仓只拥有服务端 formal exposure boundary。 |
| marketplace listing、transaction、pricing、purchase、fulfillment 和生态运营 truth | 不做 | 这些属于 `L6-marketplace` 或生态入口,本仓最多提供只读发现 ref / summary。 |
| observability log store、metrics、trace storage、alert stream、audit store 和 cost ledger | 不做 | 这些属于 `L4-observability` 或横切平台,本仓只保留业务追溯事实、ref 或 safe summary。 |
| LLM routing、model selection、prompt routing 和 provider orchestration | 不做 | 这些属于 future / runtime / provider orchestration,不属于当前能力接入职责。 |
| 外部 MCP / A2A / API 标准本体、认证协议和 provider 产品正文 | 不做 | 本仓引用外部来源和标准语境,不拥有外部协议、认证或产品正文。 |
| UI 页面、console 管理状态、聊天显化和产品工作流 | 不做 | 管理入口和浏览体验可以消费本仓事实,但 UI / 产品状态不归本仓。 |
| API / DTO / event schema / state / storage / config / test evidence / implementation boundary 定义 | 不做 | 这些由后续正式 `01~07` 文档逐步闭口,不得由 Step 3 或实现端自行补。 |

### 4.5 易混淆职责:先思考

问题回答:

- 易混淆职责是那些与本仓强相关、但必须显式分层的交界点。它们不适合简单写入“做”或“不做”。
- MCP / A2A / API 外部能力来源与 capability identity 容易混淆:本仓识别和登记外部能力,但不拥有外部系统正文或认证协议。
- adapter descriptor 与 Provider Contract 容易混淆:descriptor 是接入描述,不是 provider runtime、secret、quota、route、cost 和 failover contract。
- governance seam 与 governance approval 容易混淆:本仓拥有 seam relation,不拥有 approval / Policy truth。
- formal exposure 与 runtime / SDK / tools 消费容易混淆:本仓拥有服务端 formal exposure,不拥有 consumer cache、SDK package 或 tool config。

诊断:

- 如果易混淆职责不显式写出,Step 4 系统上下文会把相邻仓画成本仓内部职责,Step 5 子域划分会复活旧四子域,Step 8 数据所有权会让 snapshot / ref 变成 truth。
- `CapabilityDecision-style summary` 必须在此阶段明确为派生消费快照,否则后续 QueryCapabilities 口径会回流。
- “接入审查意见”属于本仓风险解释 / access review fact,但“治理批准”属于 governance;两者的边界要单独写,不能只放在非职责中。

取舍:

- 易混淆职责收敛为十一项,覆盖 identity、registry、descriptor、risk / review、governance、method、formal exposure、consumer view、maintenance / derived output、observability / audit、SDK exposure。
- 不展开每个交界点的接口、数据字段或具体交互方式。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否说明本仓职责与相邻职责分界 | pass | 每项都围绕本仓 truth 与外部 truth 分离。 |
| 是否避免对象字段和接口 | pass | 未写字段、RPC、event、repository 或 DTO。 |
| 是否覆盖主要串线点 | pass | execution、provider、governance、method、SDK、marketplace、observability、derived view 均覆盖。 |
| 是否可进入“易混淆职责:再写入” | pass | 可转成“易混淆职责”表。 |

### 4.6 易混淆职责:再写入

| 职责项 | 类型 | 说明 |
|---|---|---|
| 外部能力来源与 capability identity 边界 | 易混淆职责 | 本仓拥有 capability identity,但不拥有外部 MCP / A2A / API 来源正文或认证协议。 |
| capability registry 与 allowlist / marketplace listing 边界 | 易混淆职责 | registry 是正式接入目录 truth,不是运行白名单、availability bit 或生态 listing。 |
| adapter descriptor 与 Provider Contract / provider runtime 边界 | 易混淆职责 | descriptor 解释接入方式和约束摘要,不承载 secret、quota、route、cost、failover 或 invocation truth。 |
| descriptor risk summary / access review fact 与 governance approval 边界 | 易混淆职责 | 本仓可表达接入风险和审查事实,但不能替代 `L1-governance` approval。 |
| governance seam relation 与 Policy effective fact / shared_rules 边界 | 易混淆职责 | 本仓维护 governance 结果关系,但不拥有治理正文、生效事实或 shared rules。 |
| capability-method relation 与 method asset body 边界 | 易混淆职责 | 本仓拥有 body-free relation,但不拥有 Method Content、TaskDefinition、AIPolicyDef 或版本正文。 |
| formal exposure boundary 与 runtime / tools execution 边界 | 易混淆职责 | 本仓拥有服务端正式暴露边界,但不执行 allow / deny 或外部调用。 |
| controlled consumer view / CapabilityDecision-style summary 与 formal exposure truth 边界 | 易混淆职责 | consumer view 是由正式接入事实派生的快照,不能反向定义 exposure。 |
| SDK exposure boundary 与 SDK client / package 边界 | 易混淆职责 | 本仓提供服务端能力边界,`L0-sdk` 才拥有客户端封装和多语言 package。 |
| 派生维护 / 对账 / 搜索 / 导出与核心 truth 边界 | 易混淆职责 | 派生与维护职责只能解释或保护正式接入事实,不得创造新业务结论。 |
| observability / audit safe summary 与 audit store / trace / metric 边界 | 易混淆职责 | 本仓可以提供审计友好摘要或引用,但不拥有物理观测存储。 |

### 4.7 边界红线:先思考

问题回答:

- 边界红线应表达“绝不能隐式发生”的行为,用于保护后续系统上下文、子域划分、数据所有权、交互和依赖设计不串线。
- 红线必须覆盖 identity / registry / descriptor / seam / relation / exposure 的 truth 不被替代,也覆盖 snapshot / ref / derived output 不反写真相。
- 红线不是校验规则、接口错误码、状态机、测试断言或实现机制。

诊断:

- 如果不写“consumer view / QueryCapabilities 不得反写 formal exposure”,Step 9 可能把受控消费视图设计成 access decision truth。
- 如果不写“registry maintenance / search / export 不得创造结论”,后台维护和派生输出会成为隐式写源。
- 如果不写“旧口径不得回流”,旧 `Provider Contract / Cost / KMS / QueryCapabilities / SLA` 会以职责名或子域名回到正式架构。

取舍:

- 红线保留十二条,覆盖身份替代、目录退化、descriptor 膨胀、治理 / 方法串仓、消费反写、正文回流、依赖越界、外围阻塞、隐式变化、旧口径回流和实现端补口径。
- 不展开每条红线的落码机制。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否表达绝不能隐式发生 | pass | 每条红线均是后续架构不可破坏的职责边界。 |
| 是否避免实现细节 | pass | 未写校验逻辑、错误码、事件或测试脚本。 |
| 是否覆盖 VETO | pass | 覆盖 VF-CH-001~013 的职责侧触发条件。 |
| 是否可进入“边界红线:再写入” | pass | 可转成清单。 |

### 4.8 边界红线:再写入

| 红线 | 说明 |
|---|---|
| 不得让 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代 capability identity | 否则能力主体锚点失效。 |
| 不得让 registry 退化为 allowlist、runtime cache、availability bit 或 marketplace listing | 否则注册目录被执行态或生态展示污染。 |
| 不得让 adapter descriptor 膨胀为 Provider Contract、secret 容器、provider runtime、quota / route / cost / failover / retry contract | 否则 descriptor 边界被旧主线打穿。 |
| 不得让 access review fact、descriptor risk summary 或本地目录状态替代 governance approval / Policy truth | 否则本仓越权生成治理结论。 |
| 不得让 capability-method relation 保存 method body 或 method definition truth | 否则 `L3-method-library` truth owner 失效。 |
| 不得让 runtime、tools、SDK、产品入口、查询视图、事件协作、搜索、导出、对账或维护任务反写 access truth | 否则消费面和派生面成为隐式业务写源。 |
| 不得让 `CapabilityDecision` 类快照、QueryCapabilities 旧语义、runtime allow / deny decision 或 Policy cache 替代 formal exposure | 否则服务端正式能力边界被消费侧定义。 |
| 不得以审计、对账、导出、测试证据、观测或性能优化为理由保存 forbidden body | 否则 secret、execution、provider runtime、cost、governance、method、SDK、marketplace 或 production payload 正文会入仓。 |
| 不得把 `L0-core` 之外的内部仓写成编译期业务依赖 | 否则全局依赖裁剪失效。 |
| 不得让管理 UI、搜索、候选发现、安全摘要、SDK 说明、生态发现或审计导出改变核心闭环成立条件 | 否则外围增强会阻塞 C-CH-1~C-CH-5。 |
| 不得让 identity、registry、descriptor、governance seam、method relation、formal exposure 或 consumer impact 变化隐式发生 | 否则追溯、幂等和下游感知失效。 |
| 不得让旧 Provider Contract、CostRecord、KMS/Vault、QueryCapabilities、Policy 30s、未白名单拦截、SLA、LLM routing 或 PostgreSQL/cache/outbox 技术口径作为新版职责基线 | 否则 historical material 绕过 full-restart 回流。 |
| 不得让后续实现端自行补 API、DTO、event schema、state、storage、config、test evidence 或 implementation boundary | 否则设计真相源闭环断裂。 |

---

## 5. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| README “MCP Server 白名单 / Runtime 调外部 Tool 必经 hub” | MCP 类外部能力需要 identity、registry 和 descriptor。 | runtime 必经 hub、allow / deny enforcement、未白名单调用直接拒绝作为本仓职责。 | 重裁为稳定身份、注册目录、formal exposure 和下游消费边界。 |
| README “A2A Node 注册 + 身份验证” | A2A 类外部能力需要接入身份风险解释。 | A2A 认证协议、匿名注册拒绝和全平台认证职责。 | 重裁为外部能力来源、identity 风险解释和 access review fact。 |
| README “Provider Contract + API key / 配额 / 成本记账” | 外部 API / provider API surface 需要接入描述。 | Provider Contract、secret 托管、quota、route、cost、failover、provider runtime。 | 重裁为 adapter descriptor 和风险 / 约束摘要;secret / cost / runtime 排除。 |
| README “LLM 路由” | 可作为外部 API / provider orchestration historical risk。 | model selection、prompt routing、provider orchestration 作为本仓职责。 | 边界外,不进入当前架构职责。 |
| README “Policy 消费 / 白名单更新” | governance seam 是核心关系边界。 | Policy 下发、白名单刷新、shared_rules truth、Policy cache。 | 重裁为 governance result ref / safe summary 和 seam relation。 |
| 旧 `01` §4.2 “QueryCapabilities / Cost Accounting / Provider Contract” | 下游需要稳定消费正式能力接入事实。 | QueryCapabilities、Access Decision、Cost 子域作为本仓职责。 | 重裁为 formal exposure / controlled consumer view 快照和 cost 边界外。 |
| 旧 `01` §5 “Registry / Contract / Cost / Access 四上下文” | Registry 和消费表达可作为线索。 | Provider Contract、Cost、Access Decision 固化为核心子域。 | Step 5 必须从 C-CH-1~C-CH-5 推导,不得继承旧四子域。 |
| 旧 `01` §6 “KMS/Vault / cost worker / PostgreSQL / cache / outbox” | 可作为后续技术选型历史线索。 | 在职责边界中提前决定容器、存储、worker、outbox 或 KMS。 | 后续 Step 6 / 10 / 12 重新论证,不作为 Step 3 职责。 |

---

## 6. 结构化中间产物

### 6.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| capability access truth 承载 | 做 | 这是本仓存在的核心职责,否则外部能力接入事实会散落到执行、治理、SDK 或生态侧。 |
| 外部能力接入语境与 capability identity 承载 | 做 | 稳定身份是 registry、descriptor、seam、relation 和 exposure 的共同锚点。 |
| capability registry 与可见性 / 生命周期语义承载 | 做 | 注册目录需要由本仓形成正式接入事实,不能退化为 allowlist、cache 或 listing。 |
| adapter descriptor 承载 | 做 | 本仓拥有接入方式、能力类型和边界约束的接入描述语义。 |
| descriptor risk / constraint summary 与 access review fact 承载 | 做 | 本仓需要解释外部连接风险和接入审查语境,但不替代 governance approval。 |
| governance seam relation 承载 | 做 | 本仓维护 capability 与正式治理结果之间的关系边界,但不拥有治理正文。 |
| capability-method body-free relation 承载 | 做 | capability 与 method asset 的适用关系属于本仓接入事实,但不能保存 method body。 |
| formal exposure boundary 与 formal visibility / applicability 承载 | 做 | 服务端正式能力边界必须由本仓定义,不能由 runtime、tools、SDK 或查询视图反写。 |
| capability access traceability 与 change / consumer impact fact 承载 | 做 | 关键接入事实变化和下游影响需要可解释来源、范围和结果。 |
| 派生维护、受控消费快照和安全摘要边界维护 | 做 | 搜索、导出、对账、consumer view 和 safe summary 可服务消费,但只能从正式 access truth 派生。 |
| runtime execution、tools execution 和外部调用执行链 | 不做 | 这些属于 `L2-runtime` / `L2-tools`,进入本仓会把 access truth 与 execution truth 混合。 |
| allow / deny enforcement、runtime cache 和 provider lookup execution | 不做 | 执行裁决和运行查询不属于服务端 formal exposure truth。 |
| provider runtime、failover、retry、routing、quota 和 invocation result | 不做 | 这些属于 provider adapter / runtime orchestration,不是接入事实真相。 |
| secret/KMS/Vault 平台、API key 托管和密钥生命周期 | 不做 | 本仓最多保存 secret ref 或 safe summary,不拥有 secret 正文或安全基础设施 truth。 |
| cost accounting、billing、finance ledger 和 provider raw billing | 不做 | 成本、账单和财务对账不属于 capability access truth。 |
| governance approval execution、Policy effective fact、shared_rules truth 和治理缓存 | 不做 | 这些属于 `L1-governance`,本仓只维护 seam relation 或允许摘要。 |
| method asset body、definition source truth、method version body 和方法资产发布语义 | 不做 | 这些属于 `L3-method-library`,本仓只维护 body-free relation。 |
| SDK client、多语言 package、language binding、local candidate 和 developer experience | 不做 | 这些属于 `L0-sdk`,本仓只拥有服务端 formal exposure boundary。 |
| marketplace listing、transaction、pricing、purchase、fulfillment 和生态运营 truth | 不做 | 这些属于 `L6-marketplace` 或生态入口,本仓最多提供只读发现 ref / summary。 |
| observability log store、metrics、trace storage、alert stream、audit store 和 cost ledger | 不做 | 这些属于 `L4-observability` 或横切平台,本仓只保留业务追溯事实、ref 或 safe summary。 |
| LLM routing、model selection、prompt routing 和 provider orchestration | 不做 | 这些属于 future / runtime / provider orchestration,不属于当前能力接入职责。 |
| 外部 MCP / A2A / API 标准本体、认证协议和 provider 产品正文 | 不做 | 本仓引用外部来源和标准语境,不拥有外部协议、认证或产品正文。 |
| UI 页面、console 管理状态、聊天显化和产品工作流 | 不做 | 管理入口和浏览体验可以消费本仓事实,但 UI / 产品状态不归本仓。 |
| API / DTO / event schema / state / storage / config / test evidence / implementation boundary 定义 | 不做 | 这些由后续正式 `01~07` 文档逐步闭口,不得由 Step 3 或实现端自行补。 |
| 外部能力来源与 capability identity 边界 | 易混淆职责 | 本仓拥有 capability identity,但不拥有外部 MCP / A2A / API 来源正文或认证协议。 |
| capability registry 与 allowlist / marketplace listing 边界 | 易混淆职责 | registry 是正式接入目录 truth,不是运行白名单、availability bit 或生态 listing。 |
| adapter descriptor 与 Provider Contract / provider runtime 边界 | 易混淆职责 | descriptor 解释接入方式和约束摘要,不承载 secret、quota、route、cost、failover 或 invocation truth。 |
| descriptor risk summary / access review fact 与 governance approval 边界 | 易混淆职责 | 本仓可表达接入风险和审查事实,但不能替代 `L1-governance` approval。 |
| governance seam relation 与 Policy effective fact / shared_rules 边界 | 易混淆职责 | 本仓维护 governance 结果关系,但不拥有治理正文、生效事实或 shared rules。 |
| capability-method relation 与 method asset body 边界 | 易混淆职责 | 本仓拥有 body-free relation,但不拥有 Method Content、TaskDefinition、AIPolicyDef 或版本正文。 |
| formal exposure boundary 与 runtime / tools execution 边界 | 易混淆职责 | 本仓拥有服务端正式暴露边界,但不执行 allow / deny 或外部调用。 |
| controlled consumer view / CapabilityDecision-style summary 与 formal exposure truth 边界 | 易混淆职责 | consumer view 是由正式接入事实派生的快照,不能反向定义 exposure。 |
| SDK exposure boundary 与 SDK client / package 边界 | 易混淆职责 | 本仓提供服务端能力边界,`L0-sdk` 才拥有客户端封装和多语言 package。 |
| 派生维护 / 对账 / 搜索 / 导出与核心 truth 边界 | 易混淆职责 | 派生与维护职责只能解释或保护正式接入事实,不得创造新业务结论。 |
| observability / audit safe summary 与 audit store / trace / metric 边界 | 易混淆职责 | 本仓可以提供审计友好摘要或引用,但不拥有物理观测存储。 |

### 6.2 做 / 不做清单

| 类型 | 清单 |
|---|---|
| 做 | capability access truth;外部能力接入语境;capability identity;capability registry;registry visibility / lifecycle semantics;adapter descriptor;descriptor risk / constraint summary;access review fact;governance seam relation;capability-method body-free relation;formal exposure boundary;formal visibility / applicability;capability access traceability;change / consumer impact fact;派生维护、受控消费快照和安全摘要边界 |
| 不做 | runtime / tools execution;allow / deny enforcement;provider runtime / failover / retry / routing;secret/KMS/Vault;cost / billing / finance ledger;governance approval / Policy / shared_rules;method body;SDK client / package;marketplace listing / transaction;observability store;LLM routing;external protocol body;UI / console / chat state;API / DTO / state / storage / config / evidence / boundary in Step 3 |
| 易混淆职责 | external source vs identity;registry vs allowlist / marketplace listing;descriptor vs Provider Contract;access review vs governance approval;governance seam vs Policy truth;method relation vs method body;formal exposure vs execution;consumer view vs formal exposure truth;SDK exposure vs SDK client;derived maintenance vs core truth;observability summary vs audit store |

### 6.3 边界红线清单

| 红线 | 说明 |
|---|---|
| 不得让 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代 capability identity | 否则能力主体锚点失效。 |
| 不得让 registry 退化为 allowlist、runtime cache、availability bit 或 marketplace listing | 否则注册目录被执行态或生态展示污染。 |
| 不得让 adapter descriptor 膨胀为 Provider Contract、secret 容器、provider runtime、quota / route / cost / failover / retry contract | 否则 descriptor 边界被旧主线打穿。 |
| 不得让 access review fact、descriptor risk summary 或本地目录状态替代 governance approval / Policy truth | 否则本仓越权生成治理结论。 |
| 不得让 capability-method relation 保存 method body 或 method definition truth | 否则 `L3-method-library` truth owner 失效。 |
| 不得让 runtime、tools、SDK、产品入口、查询视图、事件协作、搜索、导出、对账或维护任务反写 access truth | 否则消费面和派生面成为隐式业务写源。 |
| 不得让 `CapabilityDecision` 类快照、QueryCapabilities 旧语义、runtime allow / deny decision 或 Policy cache 替代 formal exposure | 否则服务端正式能力边界被消费侧定义。 |
| 不得以审计、对账、导出、测试证据、观测或性能优化为理由保存 forbidden body | 否则 secret、execution、provider runtime、cost、governance、method、SDK、marketplace 或 production payload 正文会入仓。 |
| 不得把 `L0-core` 之外的内部仓写成编译期业务依赖 | 否则全局依赖裁剪失效。 |
| 不得让管理 UI、搜索、候选发现、安全摘要、SDK 说明、生态发现或审计导出改变核心闭环成立条件 | 否则外围增强会阻塞 C-CH-1~C-CH-5。 |
| 不得让 identity、registry、descriptor、governance seam、method relation、formal exposure 或 consumer impact 变化隐式发生 | 否则追溯、幂等和下游感知失效。 |
| 不得让旧 Provider Contract、CostRecord、KMS/Vault、QueryCapabilities、Policy 30s、未白名单拦截、SLA、LLM routing 或 PostgreSQL/cache/outbox 技术口径作为新版职责基线 | 否则 historical material 绕过 full-restart 回流。 |
| 不得让后续实现端自行补 API、DTO、event schema、state、storage、config、test evidence 或 implementation boundary | 否则设计真相源闭环断裂。 |

---

## 7. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §6 的结构化结论,不重复写入过程思考和旧材料诊断。

```md
## 4. 职责边界

> 校准来源:
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“旧材料差异审计”和“边界红线清单”小节,了解本文如何从新版需求基线区分 capability-hub 做什么、不做什么和最易混淆职责。

| 职责项 | 类型 | 说明 |
|---|---|---|
| capability access truth 承载 | 做 | 这是本仓存在的核心职责,否则外部能力接入事实会散落到执行、治理、SDK 或生态侧。 |
| 外部能力接入语境与 capability identity 承载 | 做 | 稳定身份是 registry、descriptor、seam、relation 和 exposure 的共同锚点。 |
| capability registry 与可见性 / 生命周期语义承载 | 做 | 注册目录需要由本仓形成正式接入事实,不能退化为 allowlist、cache 或 listing。 |
| adapter descriptor 承载 | 做 | 本仓拥有接入方式、能力类型和边界约束的接入描述语义。 |
| descriptor risk / constraint summary 与 access review fact 承载 | 做 | 本仓需要解释外部连接风险和接入审查语境,但不替代 governance approval。 |
| governance seam relation 承载 | 做 | 本仓维护 capability 与正式治理结果之间的关系边界,但不拥有治理正文。 |
| capability-method body-free relation 承载 | 做 | capability 与 method asset 的适用关系属于本仓接入事实,但不能保存 method body。 |
| formal exposure boundary 与 formal visibility / applicability 承载 | 做 | 服务端正式能力边界必须由本仓定义,不能由 runtime、tools、SDK 或查询视图反写。 |
| capability access traceability 与 change / consumer impact fact 承载 | 做 | 关键接入事实变化和下游影响需要可解释来源、范围和结果。 |
| 派生维护、受控消费快照和安全摘要边界维护 | 做 | 搜索、导出、对账、consumer view 和 safe summary 可服务消费,但只能从正式 access truth 派生。 |
| runtime execution、tools execution 和外部调用执行链 | 不做 | 这些属于 `L2-runtime` / `L2-tools`,进入本仓会把 access truth 与 execution truth 混合。 |
| allow / deny enforcement、runtime cache 和 provider lookup execution | 不做 | 执行裁决和运行查询不属于服务端 formal exposure truth。 |
| provider runtime、failover、retry、routing、quota 和 invocation result | 不做 | 这些属于 provider adapter / runtime orchestration,不是接入事实真相。 |
| secret/KMS/Vault 平台、API key 托管和密钥生命周期 | 不做 | 本仓最多保存 secret ref 或 safe summary,不拥有 secret 正文或安全基础设施 truth。 |
| cost accounting、billing、finance ledger 和 provider raw billing | 不做 | 成本、账单和财务对账不属于 capability access truth。 |
| governance approval execution、Policy effective fact、shared_rules truth 和治理缓存 | 不做 | 这些属于 `L1-governance`,本仓只维护 seam relation 或允许摘要。 |
| method asset body、definition source truth、method version body 和方法资产发布语义 | 不做 | 这些属于 `L3-method-library`,本仓只维护 body-free relation。 |
| SDK client、多语言 package、language binding、local candidate 和 developer experience | 不做 | 这些属于 `L0-sdk`,本仓只拥有服务端 formal exposure boundary。 |
| marketplace listing、transaction、pricing、purchase、fulfillment 和生态运营 truth | 不做 | 这些属于 `L6-marketplace` 或生态入口,本仓最多提供只读发现 ref / summary。 |
| observability log store、metrics、trace storage、alert stream、audit store 和 cost ledger | 不做 | 这些属于 `L4-observability` 或横切平台,本仓只保留业务追溯事实、ref 或 safe summary。 |
| LLM routing、model selection、prompt routing 和 provider orchestration | 不做 | 这些属于 future / runtime / provider orchestration,不属于当前能力接入职责。 |
| 外部 MCP / A2A / API 标准本体、认证协议和 provider 产品正文 | 不做 | 本仓引用外部来源和标准语境,不拥有外部协议、认证或产品正文。 |
| UI 页面、console 管理状态、聊天显化和产品工作流 | 不做 | 管理入口和浏览体验可以消费本仓事实,但 UI / 产品状态不归本仓。 |
| API / DTO / event schema / state / storage / config / test evidence / implementation boundary 定义 | 不做 | 这些由后续正式 `01~07` 文档逐步闭口,不得由 Step 3 或实现端自行补。 |
```

```md
### 4.1 边界红线

本章应摘录 `design-calibration/01_arch_step_03_responsibility_boundary.md` §6.3 的边界红线清单,重点保护 identity、registry、descriptor、governance seam、method relation、formal exposure、consumer view、forbidden body、编译期依赖和 historical conflict 不被后续章节打穿。
```

---

## 8. 待确认事项

本步不新增阻塞性待确认事项。以下内容继续沿用 Step 1~2 和需求 Step 15 的挂起口径,后续到对应 Step 再闭口。

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | governance seam 最小承载形态和变化感知窗口。 | 挂起到 Step 4 / 5 / 8 / 9 / 14 / 15,当前只固定 seam relation 职责。 |
| Q-002 | capability-method relation 摘要强度。 | 挂起到 Step 5 / 8 / 9,当前只固定 body-free relation 职责。 |
| Q-003 | adapter descriptor 是否细分普通 API、LLM provider API、MCP、A2A 与 provider runtime 边界。 | 挂起到 Step 5 / 8 / 9 / 10 / 12,当前只固定 descriptor 职责。 |
| Q-004 | secret reference / safe summary 字段级最小内容。 | 挂起到 Step 8 / 12 / `04-配置设计.md`,当前只固定 secret 正文不入仓。 |
| Q-005 | SDK exposure 与 `L0-sdk` client / package / developer experience 交接方式。 | 挂起到 Step 4 / 7 / 9 / 13 / `07-实施计划.md`,当前只固定服务端 exposure 归本仓。 |
| Q-006 | API / DTO / event schema / state / storage / config / test evidence / implementation boundary。 | 挂起到后续正式 `01~07`,当前不允许实现端自行补。 |

---

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 已明确本仓做什么 | pass | 已形成 capability access truth、identity、registry、descriptor、seam、relation、exposure、traceability、派生维护等“做”职责。 |
| 已明确本仓不做什么 | pass | 已明确 execution、provider runtime、secret、cost、governance truth、method body、SDK client、marketplace、observability、LLM routing、UI 和后续 boundary 不由本 Step 定义。 |
| 已明确易混淆职责 | pass | 已覆盖 external source、allowlist、Provider Contract、governance approval、method body、formal exposure、consumer view、SDK exposure、derived output、observability summary 等交界点。 |
| 已给出边界红线 | pass | 已形成 13 条职责边界红线。 |
| 未提前生成未来 Step 文件 | pass | 当前只创建 Step 3 文件,未创建 Step 4。 |
| 未修改正式 `01-架构设计.md` | pass | 正式 `01` 仍待 Step 16 装配。 |
| 未发现阻塞 Step 4 的上游 blocker | pass | 旧材料冲突已记录为 historical conflict,不阻塞进入系统边界与上下文。 |

结论:Step 3 已完成,可以在用户确认后进入 Step 4 `系统边界与上下文`。

当前不需要提交 commit。
