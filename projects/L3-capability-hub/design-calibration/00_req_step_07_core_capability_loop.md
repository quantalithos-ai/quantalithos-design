# 00 Step 7 · 核心能力闭环

> 所属文档: `00-需求文档.md`
> Step: Step 7
> 目标章节: 正式文档 §7 `核心能力闭环`
> 生成日期: 2026-07-06
> 粒度参考: `projects/L1-governance/design-calibration/00_req_step_07_core_capability_loop.md`
> 当前状态: completed_stop_review
> 当前约束: 本步从仓存在必要性出发收敛能力骨架;不得把旧功能清单、接口链、事件链、对象字段、状态机、实现组件、阶段优先级或测试验收项直接写成核心闭环。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 7 |
| status | completed_stop_review |
| gate_status | pass_for_step_07_only |
| previous_step | Step 6 `使用方与依赖` |
| next_allowed_action | wait_user_review_to_step_08 |
| formal_section | `00-需求文档.md` §7 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_07 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 2 / 3 / 4 / 5 / 6 | done | 确认用户已同意进入 Step 7,且不得跳到 Step 8 或正式文档装配。 |
| 2 | 读取需求 SOP Step 7 和书写规范 4.7 | done | 确认本章必须输出闭环定义短文、核心能力闭环图、能力层级划分、节点执行顺序和停审清单。 |
| 3 | 读取真相源闭环与可落码性标准 | done | 确认 Step 7 不闭合字段 / DTO / 状态,但必须给后续 Step 9~14 提供稳定能力锚点。 |
| 4 | 读取参考项目 Step 7 | done | 参考 `L3-method-library`、`L1-governance`、`L0-sdk` 的闭环结构与粒度,不复制领域内容。 |
| 5 | 读取目标旧 README 和旧 `00/01/02/03` 能力线索 | done | 识别旧能力污染:Provider Contract、CapabilityDecision、Cost Accounting、QueryCapabilities、KMS/Vault、runtime 执行、marketplace、LLM routing。 |
| 6 | 回答 SOP 问题 | done | 形成仓存在必要性、核心能力、外围增强、边界外能力和功能回填映射。 |
| 7 | 提炼核心能力候选并筛选 | done | 从 Step 2 / 4 / 6 收束为 5 个核心能力节点,不从旧功能表直接生成节点。 |
| 8 | 排序能力节点并设置停审点 | done | 形成逻辑依赖顺序和逐节点停审清单。 |
| 9 | 形成结构化中间产物和回填草稿 | done | 为正式 §7 提供可回填候选,但不写入正式文档。 |
| 10 | 做 blocker 判定、自检并停审 | done | 无阻塞 Step 7 的上游 blocker;等待用户确认是否进入 Step 8。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 7 的影响 |
|---|---|---|
| Step 2 | 本仓是外部 MCP / A2A / API 能力身份、注册目录和接入描述语义的能力接入真相仓。 | 核心闭环必须围绕 capability identity、registry、adapter descriptor 和接入 truth 成立,不能转成执行网关或 provider runtime。 |
| Step 3 | 当前问题是外部能力接入事实缺少干净需求层收束,且 access 容易与 execution / definition / governance / client 混写。 | 闭环必须解决“接入事实如何统一并防串线”,而不是证明某个旧接口或旧对象可实现。 |
| Step 4 | 目标包含能力接入 truth、identity / registry、adapter descriptor、governance seam、method relation、SDK exposure;非目标排除执行、secret、cost、marketplace、LLM routing 和旧对象。 | 核心能力节点必须覆盖这些目标,同时把非目标排出闭环图。 |
| Step 5 | 角色围绕管理、提议、审查、查看、系统消费和维护;相邻仓没有作为角色写入。 | Step 7 只定义能力节点,不写用户故事;角色目标留给 Step 8。 |
| Step 6 | 唯一编译期依赖是 `L0-core`;`L0-bus` 是事件协作;外部 MCP/A2A/API 是运行期外部系统依赖;governance 是结果接缝;runtime/tools/SDK 是消费边界;method-library 只保留 body-free relation。 | 核心闭环必须能解释这些依赖如何支撑能力成立,但闭环图不得写仓名、事件名、接口名或运行期调用顺序。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 7 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 7 | 从仓存在必要性出发,输出核心能力闭环、能力节点顺序、停审清单、外围增强、边界外能力、功能回填映射。 | 不直接从功能清单定义闭环;每个能力节点必须预留停审点。 |
| `需求文档书写规范.md` 4.7 | 必须有闭环定义短文、核心能力闭环 ASCII 图和能力层级划分表;节点建议 3~5 个。 | 图中节点只写能力成立描述,箭头只表达逻辑依赖关系。 |
| `设计真相源闭环与可落码性标准.md` | 后续可落码必须有唯一 truth source、字段来源和边界闭合。 | Step 7 只定能力锚点,后续 Step 9~14 必须回指这些节点,不得靠实现侧补边界。 |

### 3.3 目标旧材料输入

| 历史输入 | 可保留能力线索 | 不可继承的旧口径 |
|---|---|---|
| README | MCP Server 注册、A2A Node 注册、外部 API / provider 接入、安全治理联动、runtime/tools/marketplace 下游消费。 | Runtime 调外部 Tool 必经 hub、Provider API key/KMS 托管、成本记账、LLM routing、marketplace 注册、Policy 下发直接更新白名单。 |
| 旧 `00-需求文档.md` | 注册 / 启停 MCP、A2A 节点、能力可见性、能力边界收紧、下游查询可用能力等线索。 | 旧用户故事、QueryCapabilities、Provider Contract、Cost Accounting、Policy < 30s、allow/deny 100%、P95、旧功能编号和旧验收条件。 |
| 旧 `01-架构设计.md` | Registry、Directory、policy-aware exposure 的历史能力线索。 | Registry / Contract / Access / Cost 四域定型、KMS/Vault、provider failover、cost worker、cache 和具体容器图作为当前闭环结论。 |
| 旧 `02-概要设计.md` | “能力注册与目录 / Provider 合同与密钥托管接缝 / 能力可见性与访问裁决 / 成本记账与审计事件 / 下游消费与分发出口”五部分拆分,可作为旧主链污染线索。 | 将 Provider 合同、成本记账和分发出口并列成主链能力,会把 secret、cost、marketplace 和执行消费过早抬入核心闭环。 |
| 旧 `03-详细设计.md` | access / execution、ProviderContract / provider runtime、CapabilityDecision / runtime execution truth 的风险提醒。 | MCPServer、A2ANode、ProviderContract、CapabilityDecision、CostRecord 等旧对象直接作为核心能力节点。 |

---

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 如果没有这个仓,系统会缺什么不可替代的能力或结构? | 平台会缺少一处独立的外部能力接入 truth:哪些外部 MCP / A2A / API 能力以什么身份存在、如何进入正式注册目录、如何被描述、如何承接治理结果和方法资产关系、如何被执行侧和客户端按边界消费。没有这处 truth,能力接入事实会散落到 runtime/tools 配置、method-library 定义、governance policy、SDK wrapper、marketplace listing、secret store 或成本系统中。 |
| 这个仓成立必须共同具备哪些能力? | 必须共同具备:外部能力稳定身份、正式注册目录、接入描述语义、治理结果 / 方法资产关系接缝、受控消费表达与变化协作。 |
| 哪些能力缺一个,这个仓就不算真正成立? | 若没有稳定身份,registry 无法形成长期引用;若没有 registry,能力只是散落配置;若没有接入描述,能力不可解释且无法被审查 / 消费;若没有治理 / 方法关系接缝,能力接入无法进入正式可用语境;若没有受控消费表达,本仓会退化为仓内目录,下游继续私补 truth。 |
| 哪些能力只是外围增强,而不是闭环核心? | 管理 UI、搜索 / 浏览体验、健康检查展示、自动发现、批量导入、目录派生优化、observability / audit 友好输出、marketplace 可发现性、SDK 开发者体验、更多协议特化适配、成本摘要等都是外围增强。 |
| 哪些能力根本不属于这个仓? | runtime/tools execution、外部工具调用、provider runtime / failover / routing、governance approval execution / Policy truth、method asset definition body、SDK client package、secret/KMS 平台、cost/billing、marketplace listing / transaction、LLM routing、observability store、数据库 / repository / handler / DTO / event payload 均不属于本仓核心能力。 |
| 当前已有或预期功能中,哪些是在支撑这些核心能力? | MCP registry、A2A directory、外部 API/provider 接入线索支撑 identity / registry / descriptor;policy / whitelist 线索只可支撑治理结果接缝;QueryCapabilities / metadata / provider lookup 线索只可重命名为受控消费表达;Provider Contract 只可重裁为 adapter descriptor;CostRecord、secret envelope、marketplace metadata 和 LLM routing 不进入核心闭环。 |
| 核心能力闭环应拆成哪些能力节点? | 拆为 5 个节点:`C-CH-1 外部能力能够以稳定身份进入接入语境`;`C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义`;`C-CH-3 已注册能力能够拥有可解释的接入描述`;`C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界`;`C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化`。 |
| 这些能力节点应按什么顺序逐个讨论? | 先讨论身份,再讨论注册目录,再讨论接入描述,再讨论治理 / 方法关系接缝,最后讨论受控消费表达。该顺序是能力成立的逻辑依赖,不是开发顺序、接口顺序或事件传播顺序。 |
| 每个能力节点完成停审时,必须证明哪些内容已经收敛? | 每个节点必须证明自身 truth 边界、相邻边界、旧材料裁剪、后续 Step 输入和禁止混写项已经收敛;未通过节点停审前,不得把该节点的用户故事、功能、规则、数据、接口和验收混写到后续节点。 |

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 7 处理 |
|---|---|---|---|
| README 核心职责 | MCP 白名单、A2A Node、Provider Contract、LLM routing、Policy 消费、成本记账并列。 | 把核心能力、外围增强和边界外职责混成“能力池”。 | 重建为 5 个核心能力节点;secret、cost、LLM routing、marketplace、执行全部排出核心图。 |
| 旧 `00` 核心用例 | 注册 MCP、注册 A2A、配置 Provider Contract、runtime 查询、外部调用成本记账。 | 用功能 / 接口 / 执行结果反推核心闭环。 | 只做功能回填映射;不继承旧用例为核心能力节点。 |
| 旧 `00` 功能依赖图 | Provider Contract -> Cost / QueryCapabilities;MCP Registry -> QueryCapabilities / Policy / Audit;A2A -> QueryCapabilities。 | 图表达功能依赖和接口/事件联动,不符合 Step 7 闭环图语义。 | 改成能力成立逻辑链,箭头不表达调用、事件或实现顺序。 |
| 旧 `01` 子域 | Capability Registry、Provider Contract、Cost Accounting、Access Decision。 | 旧子域把 Cost 和 Access Decision 写成核心域,并将 Provider Contract 固化。 | Registry / adapter descriptor 可保留为能力线索;Cost 裁剪为边界外;Access Decision 重裁为治理接缝 + 受控消费表达。 |
| 旧 `02` 五部分 | 能力注册 / Provider 合同 / 访问裁决 / 成本审计 / 分发出口并列为主要部分。 | 主要部分是概要设计拆分,不是需求层闭环节点;其中 Contract / Cost / 分发出口容易把 secret、cost、marketplace 和执行消费拉进核心。 | 只吸收 registry / descriptor / exposure 的历史线索;Contract、Cost、分发出口不直接成为闭环节点。 |
| 旧 `03` 对象与流程 | MCPServer、A2ANode、ProviderContract、CapabilityDecision、CostRecord、secret ref、audit event。 | 详细设计对象反向污染需求闭环。 | 旧对象只作为后续数据 / 接口差异审计输入,不作为 Step 7 节点。 |

---

## 6. 设计取舍

### 6.1 核心闭环主轴取舍

| 方案 | 闭环主轴 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | MCP Registry -> A2A Directory -> Provider Contract -> QueryCapabilities -> Cost Accounting | 贴近旧文档。 | 本质是旧功能 / 对象链,混入成本、接口和 provider secret,违反 Step 4 / Step 6。 | 不采用。 |
| 方案 B | identity -> registry -> adapter descriptor -> governance/method seam -> controlled exposure | 覆盖用户重点边界,能保护 access truth 与 execution 分离。 | 需要后续 Step 9~12 再把每个节点展开成功能、规则、数据和接口。 | 采用。 |
| 方案 C | registry -> policy decision -> runtime query | 简洁。 | 漏掉 adapter descriptor、method relation、SDK exposure,且容易把 governance 和 runtime 写成核心执行链。 | 不采用。 |
| 方案 D | registry -> secret management -> provider runtime -> cost/audit | 易落到实现。 | 将 secret、provider runtime、cost 写成核心,与当前非目标冲突。 | 不采用。 |

### 6.2 能力节点取舍

| 候选能力 | 当前分类 | 理由 |
|---|---|---|
| capability identity | 核心能力 | 没有稳定身份,外部能力无法被长期引用、治理、描述或消费。 |
| capability registry | 核心能力 | 没有注册目录,能力接入事实会退化为散落配置或下游私有清单。 |
| adapter descriptor | 核心能力 | 没有接入描述,能力无法被审查、理解、约束或消费,旧 Provider Contract 只能从这里重新裁剪。 |
| governance approval / policy 结果接缝 | 核心能力 | 正式可用 / 可见语境必须承接治理结果,但本仓不执行 approval 或拥有 Policy truth。 |
| method-library asset relation | 核心能力的一部分 | 用户要求先闭合 method relation;但它应作为 body-free relation 接缝进入第 4 节点,不独立变成方法定义能力。 |
| SDK exposure / 执行侧消费边界 | 核心能力 | 若不能被下游按边界消费,本仓只剩静态目录;但不实现 SDK client 或 runtime execution。 |
| health check / registry projection / search / browse | 外围增强 | 有助于体验和维护,但不决定能力接入 truth 成立。 |
| KMS/Vault / secret reference | 外围或后续规则 / 数据 / NFR | secret reference 可能约束 adapter descriptor,但 secret 平台不是核心能力。 |
| cost / billing / provider raw billing | 边界外 | 已被 Step 4 / Step 6 排除。 |
| marketplace listing / transaction | 边界外;只读发现可作外围增强 | Listing / 交易 truth 不归本仓。 |
| LLM routing / provider failover | 边界外 | 属于 future、runtime 或 provider orchestration。 |

### 6.3 前序待确认事项承接

| 待确认事项 | Step 7 当前处理 | 结论 |
|---|---|---|
| `OQ-CH-015` governance seam 最终保存什么 | 先收敛为 C-CH-4 的核心能力前提,但不在本步定字段。 | 继续保留 pending,后续在 Step 10 / 11 / 12 收口。 |
| `OQ-CH-017` SDK exposure 是核心节点还是接口章节约束 | 本步确认“受控消费表达”属于核心闭环的一环;具体接口形态仍后移。 | 本步部分收敛:属于核心能力,接口形态待 Step 12。 |
| `OQ-CH-021` 系统消费方需拆成哪些真实使用方 | Step 6 已拆成 runtime / tools / SDK / governance 等实际消费或协作边界。 | 本项对 Step 7 已不再构成 blocker。 |
| `OQ-CH-023` 安全 / 接入审查者与 governance approval 职责区分 | 本步只确认审查与治理裁决不能混成同一 truth 节点。 | 继续保留 pending,后续在 Step 8 / 10 / 12 收口。 |
| `OQ-CH-006-002` method relation 是否只允许 body-free ref | 本步将其收敛到 C-CH-4,明确不能拉入方法资产正文。 | 继续保留 pending,后续在 Step 10 / 11 / 12 收口。 |
| `OQ-CH-006-004` 是否区分普通 API、LLM provider API 与 provider runtime | 本步只确认它们都属于外部接入对象或边界外执行环境,不在此拆字段。 | 继续保留 pending,后续在 Step 9 / 10 / 11 / 12 收口。 |
| `OQ-CH-006-005` secret reference 是否进入 descriptor 约束摘要 | 本步确认 secret 平台不进核心,但约束摘要可能进入 descriptor 后续讨论。 | 继续保留 pending,后续在 Step 10 / 11 / 13 收口。 |

---

## 7. 结构化中间产物

### 7.1 仓存在必要性结论

`L3-capability-hub` 的不可替代性在于:它把外部 MCP / A2A / API 能力从运行配置、工具定义、方法资产正文、治理裁决、SDK 封装、市场展示和外部基础设施中抽离出来,形成一处独立的能力接入 truth。没有这处 truth,平台无法稳定回答“哪些外部能力以何种身份存在、如何被正式接入、如何被描述、如何承接治理与方法关系、如何被下游消费”,后续实现会在执行仓、方法库、治理仓、SDK、secret store、cost 系统和 marketplace 之间反复补字段、补状态和补接口。

### 7.2 核心能力闭环结论

`L3-capability-hub` 的核心能力闭环不是 MCP、A2A、Provider、Policy、Cost 等旧功能清单,而是:外部能力必须先能以稳定身份进入接入语境;随后进入受控注册目录并形成生命周期语义;再拥有可解释的接入描述,让外部连接方式和约束摘要可被理解;接着这些接入事实必须能承接治理结果并保持与方法资产的 body-free 关系边界;最后正式接入事实必须能被下游按边界消费并持续感知变化。只要其中任一能力缺失,本仓就会退化为局部白名单、provider 配置表、策略缓存、SDK wrapper、市场元数据或执行网关,无法承担能力接入真相源。

### 7.3 核心能力闭环 ASCII 图

```text
外部能力能够以稳定身份进入接入语境
  -> 外部能力能够进入受控注册目录并形成生命周期语义
  -> 已注册能力能够拥有可解释的接入描述
  -> 接入事实能够承接治理结果并保持方法资产关系边界
  -> 正式接入事实能够被下游按边界消费并持续感知变化
```

本图只表达能力成立的逻辑依赖关系,不是运行时调用顺序、接口时序、事件传播顺序、开发实施步骤、阶段优先级或对象字段关系。

### 7.4 核心能力节点执行顺序结论

| 节点 | 能力成立描述 | 为什么在这个顺序讨论 | 本节点不讨论 |
|---|---|---|---|
| C-CH-1 | 外部能力能够以稳定身份进入接入语境 | 身份是 registry、descriptor、governance seam 和消费引用的前置。 | 不讨论注册流程、字段 schema、接口、provider runtime 或鉴权实现。 |
| C-CH-2 | 外部能力能够进入受控注册目录并形成生命周期语义 | 没有注册目录,身份只能停留在散落配置,无法形成正式接入事实。 | 不讨论运行调用、工具执行、数据库表、状态机字段或 marketplace listing。 |
| C-CH-3 | 已注册能力能够拥有可解释的接入描述 | registry 只说明能力存在;descriptor 才说明外部接入方式、能力类型和约束摘要如何被理解。 | 不讨论 API key 托管、KMS/Vault、provider failover、成本、请求/响应协议细节。 |
| C-CH-4 | 接入事实能够承接治理结果并保持方法资产关系边界 | 能力可被正式使用前,必须能引用治理结果;能力与方法资产关系必须可解释但不保存方法正文。 | 不执行 approval,不拥有 Policy truth,不保存 Method Content、TaskDefinition 或 AIPolicyDef 正文。 |
| C-CH-5 | 正式接入事实能够被下游按边界消费并持续感知变化 | 如果没有受控消费表达,本仓只能是静态目录,下游会继续私补 capability truth。 | 不实现 SDK client、runtime loop、tool invocation、event payload、query DTO 或 UI。 |

该顺序是后续 Step 8~14 的讨论顺序:每个节点先形成故事,再形成该节点下的功能、规则、数据、接口、NFR 和验收,不得把 5 个节点一次性混写。

### 7.5 能力节点停审清单

| 节点 | 停审时必须证明 | 若未收敛的风险 |
|---|---|---|
| C-CH-1 稳定身份 | 已说明外部能力身份与 ToolDefinition、method asset、provider runtime、marketplace listing、SDK client 的边界;旧 MCP/A2A/provider 线索能被归入能力身份或排除。 | 后续 registry 和 descriptor 会围绕不稳定名称、外部 URL 或执行配置补 truth。 |
| C-CH-2 注册目录 | 已说明注册目录只拥有能力接入事实和生命周期语义,不拥有执行状态、调用结果、交易状态或 provider 原始状态。 | Registry 会退化为白名单缓存、运行状态表或 marketplace 元数据表。 |
| C-CH-3 接入描述 | 已说明 adapter descriptor 表达接入方式、能力类型、约束摘要和外部连接边界,不托管 secret、不执行 provider、不承诺 cost / quota / failover。 | 旧 Provider Contract 会回流,导致本仓变成 secret 平台、provider runtime 或成本中心。 |
| C-CH-4 治理 / 方法关系接缝 | 已说明本仓只引用治理结果和方法资产关系,不执行 approval、不拥有 Policy truth、不保存方法资产正文。 | capability whitelist 或 method relation 会反向定义 governance / method-library truth。 |
| C-CH-5 受控消费表达 | 已说明正式接入事实如何被下游按边界消费,且下游不能反写本仓 truth;SDK exposure 只代表服务端能力边界。 | runtime/tools/SDK 会各自私补可用能力、查询视图、状态和接口,access 与 execution 再次混写。 |

### 7.6 能力层级划分

| 分类 | 内容 | 后续处理 |
|---|---|---|
| 核心能力闭环 | 稳定外部能力身份;受控注册目录与生命周期语义;可解释接入描述;治理结果与方法资产关系接缝;受控消费表达与变化感知。 | 必须成为 Step 8~14 的主结构锚点。 |
| 外围增强能力 | 管理 UI 和目录浏览体验;搜索 / 过滤 / health 展示;自动发现和批量导入;派生索引 / 重建 / 对账;只读生态发现线索;observability / audit 友好输出;更丰富协议特化描述;SDK developer experience;安全摘要和 secret reference 约束深化。 | 可在功能、接口、NFR 或后续文档讨论,但不得阻塞核心闭环成立。 |
| 边界外能力 | runtime/tools execution;外部工具调用;provider runtime、failover、retry、routing;governance approval execution / Policy effective fact;method asset definition body;SDK client / language package;secret/KMS/Vault 平台;cost accounting / billing / finance ledger;marketplace listing / transaction / fulfillment;LLM routing;observability log / metric store;数据库、repository、handler、DTO、event payload。 | 必须在 Step 8~14 持续排除;若被重新提出,先回退边界审计。 |

### 7.7 功能回填映射结论

| 历史 / 预期线索 | 来源 | 当前映射 | 支撑节点 / 后续落点 | 裁剪说明 |
|---|---|---|---|---|
| MCP Server 注册 / 白名单 | README;旧 `00` F-001;旧用例 | 核心支撑线索 | C-CH-1、C-CH-2、C-CH-3;后续 Step 9/10/11/12 | “白名单”不得写成 runtime 拦截执行;应重裁为能力身份、注册目录和治理接缝。 |
| A2A Node 注册 / 身份校验 | README;旧 `00` F-002 | 核心支撑线索 | C-CH-1、C-CH-2、C-CH-3;后续 Step 9/10/11/12 | 身份可信是接入能力语义,不得扩张成全平台认证系统。 |
| Provider Contract | README;旧 `00` F-003;旧 `01/03` | 重命名 / 重裁剪 | C-CH-3;Step 11/12 | 只保留 adapter descriptor 线索;API key、quota、cost、failover、provider runtime 不进入核心。 |
| Policy 消费 / 白名单刷新 | README;旧 `00` F-006;旧 `01` | 核心接缝线索 | C-CH-4;Step 10/11/12 | 只能表示治理结果 / policy 结果接缝,不执行 approval,不拥有 Policy truth,不承诺 30s 指标。 |
| QueryCapabilities / provider lookup / metadata view | 旧 `00/01/03` | 重命名 / 后置 | C-CH-5;Step 12/13 | 不在 Step 7 写接口名;后续重裁为受控消费表达和 exposure boundary。 |
| SDK exposure | Step 4 / Step 6;`L0-sdk` 参考 | 核心消费边界 | C-CH-5;Step 12 | 本仓提供服务端能力边界,不实现 SDK client、多语言 package 或开发者体验。 |
| method-library asset relation | Step 4 / Step 6;`L3-method-library` 参考 | 核心接缝线索 | C-CH-4;Step 10/11/12 | 只允许 body-free relation;不保存方法资产正文或版本发布 truth。 |
| Cost Accounting / CostRecord | README;旧 `00` F-005;旧 `03/05/06` | 边界外 / 后续审计 | Step 13/14 候选审计 | 成本 / 账单不属于能力接入 truth;不得生成核心节点。 |
| Secret envelope / KMS/Vault | README;旧 `00` F-008;旧 `01/03` | 外围安全约束 / 后续审计 | Step 10/11/13 | 可作为 secret reference 禁止保存正文的规则线索,不成为 secrets 平台。 |
| Audit event / observability | README;旧 `00` F-007;旧 `05/06` | 外围增强 / 后续审计 | Step 10/12/13/14 | 观测和审计材料不能替代 registry、descriptor 或治理接缝 truth。 |
| marketplace metadata | README;旧 `00` F-009 | 外围只读发现候选 / 边界外交易 | Step 12/15 | 只读发现可后续审计;listing、交易、定价和履约不归本仓。 |
| LLM routing | README;旧 `00` F-010;旧开放问题 | 边界外 / future | Step 15 | 不进入当前核心闭环;若未来纳入需重审 runtime/provider orchestration 边界。 |
| runtime 绕过 hub 直连外部能力 | 旧风险 / 测试线索 | 规则 / 验收审计线索 | Step 10/14 | 可作为边界规则或一票否决候选,不是 Step 7 核心能力节点。 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 17 装配正式文档时可使用的 §7 候选文本。当前不得直接写入正式 `00-需求文档.md`。

### 8.1 闭环定义

`L3-capability-hub` 的核心能力闭环不是 MCP、A2A、Provider、Policy、Cost 等旧功能清单,而是:外部能力必须先能以稳定身份进入接入语境;随后进入受控注册目录并形成生命周期语义;再拥有可解释的接入描述,让外部连接方式和约束摘要可被理解;接着这些接入事实必须能承接治理结果并保持与方法资产的 body-free 关系边界;最后正式接入事实必须能被下游按边界消费并持续感知变化。只要其中任一能力缺失,本仓就会退化为局部白名单、provider 配置表、策略缓存、SDK wrapper、市场元数据或执行网关,无法承担能力接入真相源。

### 8.2 核心能力闭环图

```text
外部能力能够以稳定身份进入接入语境
  -> 外部能力能够进入受控注册目录并形成生命周期语义
  -> 已注册能力能够拥有可解释的接入描述
  -> 接入事实能够承接治理结果并保持方法资产关系边界
  -> 正式接入事实能够被下游按边界消费并持续感知变化
```

本图只表达能力成立的逻辑依赖关系,不是运行时调用顺序、接口时序、事件传播顺序、开发实施步骤、阶段优先级或对象字段关系。

### 8.3 核心能力节点

| 节点 | 能力成立描述 | 说明 |
|---|---|---|
| C-CH-1 | 外部能力能够以稳定身份进入接入语境 | 身份是 registry、descriptor、治理接缝、方法关系和下游消费的前置。 |
| C-CH-2 | 外部能力能够进入受控注册目录并形成生命周期语义 | 注册目录让能力接入事实从散落配置变成正式 truth。 |
| C-CH-3 | 已注册能力能够拥有可解释的接入描述 | 接入描述说明外部能力类型、连接边界和约束摘要,但不拥有 provider runtime 或 secret 平台。 |
| C-CH-4 | 接入事实能够承接治理结果并保持方法资产关系边界 | 本仓只引用治理结果和方法资产关系,不执行 approval、不拥有 Policy truth、不保存方法资产正文。 |
| C-CH-5 | 正式接入事实能够被下游按边界消费并持续感知变化 | 下游消费不转移本仓 truth,SDK exposure 只代表服务端能力边界。 |

### 8.4 能力层级划分

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 稳定外部能力身份;受控注册目录与生命周期语义;可解释接入描述;治理结果与方法资产关系接缝;受控消费表达与变化感知。 |
| 外围增强能力 | 管理 UI 和目录浏览体验;搜索 / 过滤 / health 展示;自动发现和批量导入;派生索引 / 重建 / 对账;只读生态发现线索;observability / audit 友好输出;更丰富协议特化描述;SDK developer experience;安全摘要和 secret reference 约束深化。 |
| 边界外能力 | runtime/tools execution;外部工具调用;provider runtime、failover、retry、routing;governance approval execution / Policy effective fact;method asset definition body;SDK client / language package;secret/KMS/Vault 平台;cost accounting / billing / finance ledger;marketplace listing / transaction / fulfillment;LLM routing;observability log / metric store;数据库、repository、handler、DTO、event payload。 |

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 7 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-006-004` | `adapter descriptor` 是否需要区分普通外部 API、LLM provider API 与 provider runtime 边界。 | pending | 否 | Step 9 / Step 10 / Step 11 / Step 12 处理。 |
| `OQ-CH-015` | governance seam 的最小引用内容是 approval ref、policy result ref、scope summary 还是状态引用。 | pending | 否 | Step 10 / Step 11 / Step 12 处理。 |
| `OQ-CH-006-002` | method-library asset relation 是否只允许 body-free ref,以及是否需要能力类型 / 方法资产适用性摘要。 | pending | 否 | Step 10 / Step 11 / Step 12 处理。 |
| `OQ-CH-017` | SDK exposure 在 Step 7 已确认属于核心闭环一环,但其最小服务端 exposure 边界如何表达。 | partial_resolved | 否 | Step 12 处理。 |
| `OQ-CH-007-005` | 白名单 / allow-deny 语义是 registry 状态、governance 结果引用、消费视图还是三者组合。 | pending | 否 | Step 10 / Step 11 / Step 12 / Step 14 处理。 |
| `OQ-CH-006-005` | secret reference 是否进入 adapter descriptor 的约束摘要,以及如何禁止 secret 正文进入本仓。 | pending | 否 | Step 10 / Step 11 / Step 13 处理。 |
| `OQ-CH-023` | 安全 / 接入审查者与 governance approval 的职责如何在后续 seam 中区分。 | pending | 否 | Step 8 / Step 10 / Step 12 处理。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧功能清单与当前边界冲突 | historical_conflict_not_blocker | 冲突说明旧材料不能继承,但 Step 2 / 4 / 6 已足以重新收敛能力闭环。 | 旧功能只进入功能回填映射,不直接生成核心节点。 |
| adapter descriptor 与旧 Provider Contract 命名未最终闭合 | not_blocker_for_step_07 | Step 7 只需确认“可解释接入描述”是核心能力;具体命名、字段和接口后续处理。 | Step 9 / 11 / 12 闭合。 |
| governance seam 字段未闭合 | not_blocker_for_step_07 | Step 7 只需确认治理结果接缝是核心能力的一部分;字段和规则后续处理。 | Step 10 / 11 / 12 闭合。 |
| method relation 字段未闭合 | not_blocker_for_step_07 | Step 7 只需确认 body-free relation 边界是核心能力的一部分;具体数据归属后续处理。 | Step 11 / 12 闭合。 |
| SDK exposure 具体接口未闭合 | not_blocker_for_step_07 | Step 7 只需确认受控消费表达是核心能力;不定义 SDK client 或接口。 | Step 12 闭合。 |

结论: 未发现阻塞 `00-需求文档.md` Step 7 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已说明仓存在必要性 | pass | 已说明缺少本仓时外部能力接入 truth 会散落到执行、治理、方法、SDK、secret、cost 和 marketplace 语境。 |
| 已定义 1 条核心能力闭环 | pass | 已形成 5 节点闭环。 |
| 核心节点数量符合 3~5 建议 | pass | 当前为 5 个节点。 |
| 已区分核心、外围增强和边界外能力 | pass | 已形成能力层级划分表。 |
| 已给出能力节点执行顺序 | pass | 顺序表达能力成立逻辑依赖,非实施顺序。 |
| 已给出能力节点停审清单 | pass | 每个节点均有停审证明项和未收敛风险。 |
| 已给出功能回填映射 | pass | 旧 MCP/A2A/Provider/Policy/Query/Cost/Secret/Marketplace/LLM 线索均已映射或裁剪。 |
| 未把功能清单直接当闭环 | pass | 旧 F-001~F-010 未作为核心节点继承。 |
| 未把接口、事件、DTO、对象字段、实现组件或阶段优先级写成闭环图 | pass | 图中只写能力成立描述。 |
| 是否可进入 Step 8 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
