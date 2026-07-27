# 00 Step 6 · 使用方与依赖

> 所属文档: `00-需求文档.md`
> Step: Step 6
> 目标章节: 正式文档 §6 `使用方与依赖`
> 当前状态: completed_stop_review
> 当前约束: 本步只说明本仓向谁提供能力、依赖谁的前置能力、哪些依赖进入当前需求主链,以及哪些依赖必须裁剪;不得写角色说明、接口名、事件名、DTO、核心能力闭环步骤、功能需求、业务规则、数据归属、NFR、验收或实现方案。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 6 |
| status | completed_stop_review |
| gate_status | pass_for_step_06_only |
| previous_step | Step 5 `用户与角色` |
| next_allowed_action | wait_user_review_to_step_07 |
| formal_section | `00-需求文档.md` §6 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_06 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1~5 | done | 确认用户已同意进入 Step 6,且不得跳到 Step 7 或正式文档装配。 |
| 2 | 读取需求 SOP Step 6 和书写规范 4.6 | done | 确认本章必须输出内部仓依赖、外部系统依赖、依赖裁剪表、依赖类型分类表、禁止依赖表和依赖裁剪图。 |
| 3 | 读取 `全局项目依赖关系与裁剪规则.md` §2、§4、§5、§6 | done | 确认 `L3-capability-hub` 的全局依赖行和单仓裁剪固定格式。 |
| 4 | 读取参考项目 Step 6 粒度 | done | 参考 `L3-method-library`、`L1-governance`、`L0-sdk` 的依赖裁剪方式,不复制其领域内容。 |
| 5 | 读取目标 README 和旧 `00/01/02/03/05/06` 依赖线索 | done | 识别旧依赖污染: runtime/tools 执行、governance policy 下发、KMS/Vault、成本、marketplace、LLM routing 被写成主链。 |
| 6 | 回答 SOP 问题 | done | 形成输入依赖、输出能力、闭环前置、失效影响和裁剪结论。 |
| 7 | 做本仓依赖裁剪 | done | 只从全局基线裁剪 `L0-core`、`L0-bus`、外部 MCP/A2A/API、`L1-governance`、`L2-runtime`、`L2-tools`、`L0-sdk` 等相关边,不复制 27 仓总表。 |
| 8 | 做设计取舍 | done | 采用“能力接入 truth + 受控消费边界”依赖口径,不采用“hub 作为执行网关 / secret 平台 / 成本中心 / marketplace listing 仓”口径。 |
| 9 | 形成结构化中间产物和回填草稿 | done | 为正式 §6 提供可回填候选,但不写入正式文档。 |
| 10 | 做 blocker 判定、自检并停审 | done | 无阻塞 Step 6 的上游 blocker;等待用户确认是否进入 Step 7。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 6 的影响 |
|---|---|---|
| Step 2 | 本仓是负责外部 MCP / A2A / API 能力身份、注册目录和接入描述语义的能力接入真相仓。 | 依赖裁剪必须围绕能力接入事实,不能把运行执行、治理审批、secret、cost 或 marketplace 交易拉入本仓主链。 |
| Step 4 | 目标包含 capability identity / registry、adapter descriptor、governance seam、method-library asset relation、SDK exposure boundary;非目标排除 runtime/tools execution、provider runtime、method body、governance approval / Policy truth、SDK client、secret/KMS、cost/billing、marketplace listing / transaction、LLM routing。 | Step 6 必须把这些目标转成“输入依赖 / 输出能力 / 协作边界”,同时把非目标写进禁止依赖。 |
| Step 5 | 人类角色与系统角色已收束;runtime、tools、governance、SDK、marketplace 等没有作为角色写入。 | 本步接收这些相邻仓和系统作为使用方 / 依赖,不得再写角色说明或用户故事。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 6 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 6 | 本仓向哪些仓 / 系统提供能力,依赖哪些前置能力,哪些依赖阻塞核心闭环,哪些关系需要裁剪。 | 必须输出仓际能力关系、闭环前置依赖、失效后果、依赖裁剪表、依赖类型分类表、禁止依赖表和 ASCII 图。 |
| `需求文档书写规范.md` 4.6 | 内部仓依赖表、外部系统依赖表、固定裁剪表、依赖类型分类表、禁止依赖表、图格式和完成标准。 | 不写角色、用户故事、接口签名、DTO、事件 schema、主链步骤或实现组织。 |
| `全局项目依赖关系与裁剪规则.md` | 总依赖矩阵中 `L3-capability-hub` 行:编译期依赖 `L0-core`;运行期依赖外部 MCP / A2A / API 集成;通过 `L0-bus` 发布能力事件。 | 只有 `L0-core` 可写为编译期依赖;`L0-bus`、外部系统、governance、runtime/tools、SDK 等不得写成 package dependency。 |

### 3.3 目标旧材料依赖线索

| 历史输入 | 可保留依赖线索 | 不可继承的旧依赖口径 |
|---|---|---|
| README | 外部 MCP、A2A、外部 API/provider、安全治理联动、runtime/tools/marketplace 下游消费线索。 | Runtime 调外部 Tool 必经 hub、Provider API key / KMS 托管、成本记账、LLM routing、marketplace 注册、Policy 下发直接更新白名单。 |
| 旧 `00-需求文档.md` | `core / bus`、governance、KMS/Vault、外部 MCP/A2A/API、runtime/tools 等历史依赖候选。 | 将 governance policy、KMS/Vault、外部 provider、runtime/tools、marketplace、cost/finance 全部写成 P0 主链前置。 |
| 旧 `01/02/03` | access 与 execution、provider contract 与 provider runtime、capability decision 与 governance/runtime 容易混淆。 | 旧 Registry / Contract / Access / Cost 子域、KMS adapter、provider failover、cost worker、QueryCapabilities 高性能路径作为当前已定依赖。 |
| 旧 `05/06` | 旧测试 / 验收暴露多下游和多外部系统耦合风险。 | 将 PG、KMS/Vault、runtime-tools dry-run、observability-finance-marketplace 全部写成当前需求层正式前置。 |

### 3.4 相邻仓输入

| 来源 | 已确认边界 | 对 Step 6 的影响 |
|---|---|---|
| `L3-method-library/00-需求文档.md` | method-library 与 capability-hub 同属 L3,职责分别是方法资产定义与外部能力注册;该文档未建立二者直接依赖。 | 本仓必须保留 method asset relation 的边界约束,但不得把方法资产正文或 method-library 源码写成本仓依赖。 |
| `L1-governance/00-需求文档.md` | governance 不拥有 capability registration、tool adapter 或工具调用结果;capability-hub 可消费能力使用约束并提供能力反馈线索。 | 本仓与 governance 是运行期 / 事件协作接缝,不是审批执行或 Policy truth 合并。 |
| `L0-sdk/00-需求文档.md` | SDK 是官方客户端接入层,封装 L1/L2/L3/L4 服务能力,不拥有服务端 truth。 | 本仓可作为 SDK 的 L3 服务端能力来源,但不得依赖 SDK client 包或把 SDK exposure 写成客户端实现。 |

### 3.5 全局基线引用

- 规则来源: `standards/document/全局项目依赖关系与裁剪规则.md`
- 上游矩阵来源: `architecture/仓库拆分方案.md` §十一“仓间依赖矩阵”
- 本 Step 只裁剪 `L3-capability-hub` 相关依赖边,不复制 27 仓总矩阵。

---

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓向哪些仓 / 系统提供哪些能力? | 向 `L2-runtime`、`L2-tools`、`L0-sdk` 以及后续产品 / 生态入口提供能力身份、注册目录、接入描述和治理 / 方法关系摘要等能力接入事实;向 `L1-governance` 提供能力接入状态和反馈线索;通过 `L0-bus` 发出能力级变化信号。 |
| 本仓依赖哪些仓 / 系统提供哪些能力? | 编译期只依赖 `L0-core` 的共享契约和基础引用;事件协作依赖 `L0-bus` 作为能力变化协作通道;运行期 / 事件协作依赖 `L1-governance` 的正式治理结论或 policy 结果接缝;运行期依赖外部 MCP / A2A / API 系统作为 adapter descriptor 和外部能力接入对象。 |
| 这些关系在全局依赖基线中分别是什么边? | `L3-capability-hub -> L0-core` 是编译期依赖;`L3-capability-hub -> L0-bus` 是事件协作;`L3-capability-hub -> 外部 MCP / A2A / API` 是运行期集成边;`L2-runtime` 和 `L2-tools` 运行期消费 `L3-capability-hub`;`L0-sdk` 运行期封装 L3 能力;`L1-governance` 与 capability-hub 是运行期 / 事件协作接缝。 |
| 哪些全局依赖边需要进入本仓需求主链,哪些应被裁剪出去? | 进入主链: `L0-core`、`L0-bus`、外部 MCP/A2A/API、`L1-governance`、`L2-runtime`、`L2-tools`、`L0-sdk` 的受控消费 / 接缝关系。裁剪出去: `L6-marketplace` listing / transaction、`L4-observability` store、finance/cost ledger、KMS/Vault secret 平台、LLM routing、provider runtime、method-library 源码 /正文依赖。 |
| 每条进入主链的关系属于编译期依赖、运行期依赖,还是事件协作依赖? | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作依赖;外部 MCP/A2A/API 是运行期外部系统集成边界;`L1-governance` 是运行期 / 事件协作接缝;`L2-runtime`、`L2-tools`、`L0-sdk` 是运行期下游消费关系。 |
| 哪些依赖是闭环前置? | 对能力接入 truth 成立而言,`L0-core`、`L0-bus`、外部 MCP/A2A/API 接入对象类别、`L1-governance` 结果接缝、`L2-runtime` / `L2-tools` 消费边界是闭环前置;`L0-sdk` 是官方客户端曝光边界的前置,但不阻塞本仓核心 truth 自身成立。 |
| 哪些依赖失效时会影响本仓当前阶段能力? | `L0-core` 失效会导致共享身份和引用基线不成立;`L0-bus` 失效会导致能力变化不能成为平台协作信号;外部 MCP/A2A/API 接入对象不可描述会导致 adapter descriptor 无法验证;`L1-governance` 结果接缝失效会导致正式可用 / 可见边界不能闭合;runtime/tools 消费边界缺失会导致本仓输出退化为静态目录。 |
| 哪些关系只是消费 / 引用,哪些关系会形成强阻塞? | `L2-runtime`、`L2-tools`、`L0-sdk` 主要是消费方;`L3-method-library` 是 body-free relation 引用边界,不形成源码依赖;`L6-marketplace`、`L5-console`、`L4-observability` 是后续消费或横切接缝。强阻塞集中在 `L0-core`、`L0-bus`、governance 结果接缝、外部接入对象类别和主要执行侧消费边界。 |
| 哪些依赖虽然存在,但不属于当前阶段前置条件? | `L6-marketplace` listing / transaction、`L5-console` 管理体验、`L4-observability` 物理存储、KMS/Vault secret 托管平台、finance/cost ledger、provider 原始账单、LLM routing 和 method-library 正文依赖均不属于当前需求主链前置。 |

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 6 处理 |
|---|---|---|---|
| README 依赖段 | 写 `quantalithos-governance`、外部 Anthropic/OpenAI/API/MCP/KMS、`tools`、`runtime`、`marketplace`。 | 把治理、secret、执行、外部 provider 和 marketplace 消费混成同一依赖层级。 | 只保留 governance seam、外部 MCP/A2A/API 接入对象和 runtime/tools 下游消费;secret/cost/marketplace 执行裁剪。 |
| 旧 `00` §6 功能依赖 | F-001/F-003/F-004/F-005/F-006/F-008/F-009/F-010 直接依赖 core/bus、KMS/Vault、governance、marketplace、runtime。 | 将功能依赖、外部系统、NFR、执行和交易边界混写,且提前出现接口名。 | 本步不用旧功能名作为依赖真相;只在能力级裁剪关系。 |
| 旧 `00` §12 接口 | 写 governance(policy.updated/shared_rules)、KMS/Vault、runtime/tools(QueryCapabilities/provider lookup)。 | 已滑入事件名、接口名和实现 / 查询动作。 | 后移 Step 12;本步只说能力级协作关系和依赖类型。 |
| 旧 `01/02/03` | 把 Postgres、KMS/Vault、provider adapters、cost worker、query cache 等作为架构前置。 | 架构实现反向污染需求依赖。 | 作为 historical material;当前只认全局依赖裁剪和 Step 2~5 边界。 |
| 旧 `05/06` | 将 KMS/Vault、runtime-tools dry-run、observability-finance-marketplace 环境作为验收前置。 | 测试 / 验收环境反向扩张需求主链。 | 后续 05/06 重写时再裁剪证据环境;Step 6 不定稿。 |

---

## 6. 设计取舍

### 6.1 依赖主轴取舍

| 方案 | 依赖主轴 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 沿用旧“registry + provider contract + policy decision + cost + marketplace”依赖主轴 | 旧材料内容完整。 | 把执行、secret、成本、交易和 governance truth 混入 capability-hub,违反 Step 2 / Step 4。 | 不采用。 |
| 方案 B | 只写 `L0-core` / `L0-bus` / 外部 MCP-A2A-API | 严格贴合全局矩阵行。 | 会漏掉用户强调必须闭合的 governance seam、method relation、SDK exposure 和 runtime/tools 消费边界。 | 不采用。 |
| 方案 C | 以能力接入 truth 为中心,裁剪出编译期基线、事件主干、外部接入对象、治理结果接缝、执行侧消费、SDK exposure 和 method relation 边界 | 能同时满足全局裁剪和本仓重点边界,且不会把相邻仓实现写成本仓 truth。 | 需要在后续 Step 7/11/12 继续闭合 relation / 数据 / 接口细节。 | 采用。 |

### 6.2 关键边界取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| `L0-core` 是否是编译期依赖 | 是,且当前唯一编译期依赖。 | 全局矩阵明确 `L3-capability-hub` 编译期依赖 `L0-core`;其他关系不得写入 package dependency。 |
| `L0-bus` 是否是编译期依赖 | 否,是事件协作依赖。 | 能力变化需要平台协作信号,但 bus 不等于业务仓源码依赖。 |
| 外部 MCP/A2A/API 是否进入外部系统依赖 | 是,但只作为外部能力接入对象和 adapter descriptor 目标。 | Capability Hub 的存在主题就是外部能力接入;但本仓不执行外部调用或 provider runtime。 |
| `L1-governance` 是否进入主链 | 是,作为治理结果 / policy 结果接缝。 | Step 4 已把 governance seam 列为目标;但 approval execution 和 Policy truth 不归本仓。 |
| `L3-method-library` 是否成为直接依赖 | 否,只保留 method asset relation 边界。 | 相邻文档明确二者分别拥有方法资产定义和外部能力注册;关系需要闭合但不能变成源码或正文依赖。 |
| `L2-runtime` / `L2-tools` 是否进入主链 | 是,作为主要系统消费方和执行侧消费边界。 | 本仓不执行 runtime/tools,但能力接入事实必须被执行侧稳定消费。 |
| `L0-sdk` 是否进入主链 | 是,作为官方客户端曝光边界;不作为本仓编译期依赖。 | Step 4 要求闭合 SDK exposure boundary,但 SDK client 实现归 `L0-sdk`。 |
| `L6-marketplace` 是否进入主链 | 否。 | marketplace listing / transaction 是 Step 4 非目标;后续最多作为只读消费或引用接缝审计。 |
| KMS/Vault、finance/cost、observability 是否进入主链 | 否。 | secret 平台、成本账本和观测存储均已排出本仓 truth;后续可作为安全 / NFR / 测试环境候选重新裁剪。 |

---

## 7. 结构化中间产物

### 7.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、基础引用和跨仓一致性基线 | 是 | capability identity、registry 引用和跨仓接入事实无法获得稳定表达基线。 |
| 输入 / 输出 | `L0-bus` | 能力接入事实变化的事件协作通道 | 是 | 能力注册、描述、状态和可见性变化只能停留在本地查询或手工同步,无法形成平台协作信号。 |
| 输入 / 输出 | `L1-governance` | 治理批准、policy 结果或能力使用约束的正式接缝;能力接入状态和反馈线索 | 是,对正式可用 / 可见边界是前置 | 本仓只能维护未治理的草稿或局部目录,不能稳定说明哪些能力可进入正式接入语境。 |
| 输出 | `L2-runtime` | 能力身份、注册目录、接入描述和治理 / 方法关系摘要 | 是,作为主要执行侧消费边界 | runtime 会重复保存外部能力配置或私自解释可用能力,access 与 execution 分离失效。 |
| 输出 | `L2-tools` | 外部 MCP / A2A / API 能力接入事实和受控消费边界 | 是,作为工具侧消费边界 | tools 会把 MCP/A2A/API 接入事实写成本地工具定义或执行配置,形成多 truth。 |
| 输出 | `L0-sdk` | 可被官方客户端封装的 L3 服务端能力边界和只读消费语义 | 否,不阻塞本仓核心 truth;对 SDK exposure 前置 | SDK 只能后置或私补 capability-hub client 语义,服务端能力边界难以被统一封装。 |
| 协作边界 | `L3-method-library` | capability 与 method asset 的 body-free relation 约束 | 否,不形成直接依赖 | 若后续不闭合 relation,方法资产可能私有引用外部能力;但当前不能把方法资产正文拉入本仓。 |
| 输出候选 | `L5-console` | 管理体验可能消费能力接入事实 | 否 | 管理入口延迟,不阻塞能力接入 truth;不得把 console 状态写成本仓依赖。 |
| 输出候选 | `L6-marketplace` | 生态入口可能只读消费能力可发现性线索 | 否 | marketplace listing / transaction 延迟;不影响本仓核心能力接入 truth。 |
| 协作候选 | `L4-observability` | 观测 / 审计系统可能消费能力变化或安全摘要 | 否 | 横切观测延迟;不得把 observability store 写成本仓 truth。 |

### 7.2 外部系统依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | 外部 MCP server / MCP ecosystem | 外部 MCP 能力作为被登记、描述和治理接缝引用的接入对象 | 是,对 MCP 类 adapter descriptor 前置;单个外部实例不可用不阻塞仓级闭环 | MCP 类能力只能停留在占位或草稿,不能形成可验证的接入描述语义。 |
| 输入 | 外部 A2A node / A2A ecosystem | 外部 Agent-to-Agent 能力或节点作为被登记、描述和身份可信审查的接入对象 | 是,对 A2A 类 adapter descriptor 前置;单个节点不可用不阻塞仓级闭环 | A2A 类能力无法形成身份、注册和接入描述边界,后续安全 / 审查语义无法落地。 |
| 输入 | 外部 API / provider API surface | 外部 API 能力作为 adapter descriptor 的接入对象和能力类型来源 | 是,对 API 类 adapter descriptor 前置;具体 provider runtime 不归本仓 | API 类能力无法稳定表达接入方式、约束摘要和外部连接边界。 |
| 外部边界候选 | secret / KMS / Vault 系统 | 仅可能在后续作为 secret reference 或安全基础设施接缝 | 否 | 本仓不得因密钥系统缺失而改写为 secrets 平台;涉及敏感材料时后续 Step 10/11/13 再裁剪。 |
| 外部边界候选 | finance / billing / provider raw billing | 仅可能作为后续成本 / 账单外部来源或事件协作背景 | 否 | 成本统计延迟不阻塞能力身份、注册和接入描述 truth;不得把 CostRecord 写成当前主链。 |
| 外部边界候选 | external provider runtime / failover backend | 外部调用、重试、路由、故障转移执行环境 | 否 | 调用执行由 runtime/provider adapter 边界处理;本仓不拥有 provider runtime 状态。 |

### 7.3 仓际能力关系结论

| 关系类别 | 关联对象 | 结论 |
|---|---|---|
| 编译期输入 | `L0-core` | 本仓唯一可进入 package dependency 的内部上游。 |
| 事件协作输入 / 输出 | `L0-bus` | 本仓通过事件协作使能力接入事实变化可被平台感知;不得把 bus 写成业务 truth。 |
| 治理接缝 | `L1-governance` | 本仓只消费 / 引用治理结论或 policy 结果并反馈能力接入线索;不执行 approval,不拥有 Policy truth。 |
| 主要下游消费 | `L2-runtime`、`L2-tools` | 二者消费能力接入事实,但执行、工具调用、runtime 状态和 provider 调用结果不回写成本仓 truth。 |
| 客户端曝光 | `L0-sdk` | SDK 封装本仓服务端能力边界,但 SDK client、language binding、package candidate 不属于本仓。 |
| 方法资产关系 | `L3-method-library` | 只保留 capability 与 method asset 的 body-free relation 约束,不建立直接源码或正文依赖。 |
| 生态 / 管理消费 | `L5-console`、`L6-marketplace` | 当前不进入核心主链;后续只可作为只读消费或引用边界,不得拥有本仓 registry truth。 |
| 横切观测 / 成本 / 安全基础设施 | `L4-observability`、KMS/Vault、finance/billing | 当前不进入需求主链前置;后续若需要,按安全、非功能、测试或配置边界重新裁剪。 |

### 7.4 闭环前置依赖结论

| 前置项 | 是否闭环前置 | 说明 |
|---|---|---|
| `L0-core` | 是 | 没有共享契约和基础引用,capability identity 与跨仓引用无法稳定表达。 |
| `L0-bus` | 是 | 没有事件协作通道,能力接入事实变化不能形成平台级协作信号。 |
| 外部 MCP / A2A / API 接入对象类别 | 是 | 没有外部接入对象类别,adapter descriptor 会退化为抽象配置清单。 |
| `L1-governance` 结果接缝 | 是,对正式可用 / 可见边界 | 没有正式治理结果接缝,能力只能作为草稿或未治理目录存在。 |
| `L2-runtime` / `L2-tools` 消费边界 | 是,对能力接入 truth 的消费闭环 | 没有执行侧消费边界,本仓输出难以证明不是静态目录。 |
| `L0-sdk` exposure boundary | 条件前置 | 对官方客户端封装和产品 / 生态统一消费前置;不阻塞本仓核心 truth 本身成立。 |
| `L3-method-library` relation boundary | 条件前置 | 对方法资产与 capability 关系可解释前置;不形成当前依赖主链。 |
| marketplace / observability / finance / KMS | 否 | 均为后续接缝或外部基础设施候选,不得作为当前主链前置。 |

### 7.5 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L3-capability-hub` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 本仓需要共享契约、基础引用和跨仓一致性基线表达能力接入 truth。 |
| `L0-bus` | `L3-capability-hub` 通过 `L0-bus` 发布能力事件 | 协作方 | 事件协作 | 是 | 能力接入事实变化需要平台级协作信号,但不形成业务仓源码依赖。 |
| 外部 MCP / A2A / API | `L3-capability-hub` 运行期依赖外部 MCP / A2A / API 集成 | 依赖方 | 运行期 | 是 | 外部能力接入对象是本仓 adapter descriptor 和 registry 语义成立的前置;不代表本仓执行调用。 |
| `L1-governance` | governance 与 capability-hub 运行期 / 事件协作,capability-hub 消费能力使用约束并反馈能力线索 | 协作方 | 运行期 / 事件协作 | 是 | governance seam 是 Step 4 目标;但 approval execution 和 Policy truth 必须留在 governance。 |
| `L2-runtime` | `L2-runtime` 运行期消费 `L3-capability-hub` 能力 | 被依赖方 | 运行期 | 是 | runtime 是主要执行侧消费者;本仓只提供能力接入事实,不拥有 runtime execution。 |
| `L2-tools` | `L2-tools` 运行期消费 `L3-capability-hub` MCP / A2A 能力 | 被依赖方 | 运行期 | 是 | tools 是主要工具侧消费者;工具调用和工具执行 truth 不归本仓。 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1 / L2 / L3 / L4 API | 被依赖方 | 运行期 | 是 | SDK exposure boundary 是本仓目标之一;SDK client 和 language package 不归本仓。 |
| `L3-method-library` | 同属 L3,但职责分别是方法资产定义与外部能力注册 | 相邻仓 / relation 边界 | 无直接依赖 | 否 | 只保留 body-free relation 约束,不建立直接源码、正文或运行期强依赖。 |
| `L6-marketplace` | `L6-marketplace` 运行期消费 method / tool / role 发布审核能力并按需发布生态资产事件 | 下游候选 / 协作方 | 运行期 / 事件协作候选 | 否 | marketplace listing / transaction 是非目标;后续最多只读消费或引用。 |
| `L5-console` | `L5-console` 经 SDK 消费 L1 / L2 / L3 / L4 管理 API | 下游候选 | 运行期候选 | 否 | 管理体验不是能力接入 truth 成立的前置,后续通过 SDK / 管理接口边界审计。 |
| `L4-observability` | `L4-observability` 通过 `L0-bus` 消费 tap / audit material | 协作候选 | 事件协作候选 | 否 | 观测存储是横切系统,不成为本仓业务 truth 或当前主链前置。 |
| secret / KMS / Vault | 全局矩阵未给出本仓正式内部仓边;旧材料写作外部依赖 | 外部基础设施候选 | 运行期候选 | 否 | 本仓不做 secrets 平台;后续仅允许 secret reference / 安全接缝审计。 |
| finance / billing / raw provider billing | 全局矩阵未给出本仓正式内部仓边;旧材料写作 cost accounting | 外部 / 横切候选 | 运行期 / 事件协作候选 | 否 | cost/billing 是非目标,不得作为 capability registry truth。 |

### 7.6 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享契约、基础引用和跨仓一致性基线。 | `01-架构设计.md`、`03-详细设计.md`、`07-实施计划.md` |
| 事件协作依赖 | `L0-bus` | 发布 / 协作能力接入事实变化信号,不让 bus 拥有业务 truth。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md`、`07-实施计划.md` |
| 运行期依赖 | 外部 MCP / A2A / API | 将外部能力作为接入对象和 adapter descriptor 目标,不拥有外部 provider runtime。 | `01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` |
| 运行期 / 事件协作依赖 | `L1-governance` | 消费 / 引用治理结论或 policy 结果,提供能力接入反馈线索。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` |
| 运行期依赖 | `L2-runtime` | 向 runtime 提供能力接入事实、描述和可见性边界;不执行 runtime loop。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md` |
| 运行期依赖 | `L2-tools` | 向 tools 提供 MCP / A2A / API 能力接入事实;不执行工具调用。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md` |
| 运行期依赖 | `L0-sdk` | 提供可被 SDK 封装的服务端能力边界;不实现 SDK client。 | `01-架构设计.md`、`03-详细设计.md`、`07-实施计划.md` |
| 无直接依赖 / 关系边界 | `L3-method-library` | 保留 capability 与 method asset 的 body-free relation 约束。 | Step 7、Step 10、Step 11、Step 12 |

### 7.7 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L3-capability-hub -> L2-runtime / L2-tools` 源码级依赖 | 会把 runtime execution、tool execution、agent loop、provider 调用结果或执行状态混入 capability registry truth。 | 运行期能力边界、只读能力接入事实、事件协作或 SDK / 正式服务边界。 |
| `L2-runtime / L2-tools -> L3-capability-hub` 源码级实现依赖 | 消费能力接入事实不等于链接本仓业务实现,否则执行仓和能力仓会形成强耦合。 | 运行期消费、SDK 封装、正式查询 / 快照 / 引用边界。 |
| `L3-capability-hub -> L1-governance` 审批执行依赖 | 会把 governance approval、Policy effective fact 或 shared rules truth 写成本仓 truth。 | 使用治理结果引用、能力约束摘要、状态引用或事件协作接缝。 |
| `L1-governance -> L3-capability-hub` 以 capability whitelist 反向定义 Policy truth | 会让能力目录、缓存或白名单反向成为治理真相。 | Governance 拥有正式治理结论;capability-hub 只消费约束并反馈能力线索。 |
| `L3-capability-hub -> L3-method-library` 正文 / 源码依赖 | 会把 Method Content、TaskDefinition、ProcessTemplateDef、AIPolicyDef 等方法资产正文并入能力仓。 | 只保存 body-free method asset ref / relation 语义,具体字段后续 Step 11/12 裁剪。 |
| `L3-capability-hub -> L0-sdk` 编译期或客户端实现依赖 | 会把 SDK client、language binding、package candidate 或开发者体验写成本仓职责。 | 本仓提供服务端能力边界;SDK 通过运行期边界封装。 |
| `L3-capability-hub -> 外部 MCP / A2A / API` 执行网关依赖 | 会把外部调用、重试、路由、provider runtime 和执行结果写成本仓 truth。 | 本仓只登记、描述和治理接缝引用外部能力;执行由 runtime/tools/provider adapter 边界处理。 |
| `L3-capability-hub -> KMS/Vault` 作为核心 truth 依赖 | 会把 secrets 平台和密钥生命周期管理变成本仓主线。 | 后续仅可使用 secret reference / 安全基础设施接缝,不保存 secret 正文。 |
| `L3-capability-hub -> finance / billing / raw provider billing` | 会把成本、账单和 provider 原始账单写成能力接入 truth。 | 若后续需要,通过观测 / 财务事件或摘要协作,不进入当前需求主链。 |
| `L3-capability-hub -> L6-marketplace` listing / transaction 依赖 | marketplace 上架、定价、购买、订单、结算和履约不是本仓职责。 | marketplace 可只读消费能力可发现性线索或引用,交易留在 `L6-marketplace`。 |
| `L3-capability-hub -> L4-observability` 直接真相写入 | observability 是横切观测,不能成为 capability registry、adapter descriptor 或 governance seam 的 truth store。 | 通过 `L0-bus`、audit material 或 telemetry 边界协作,具体后续再裁剪。 |

### 7.8 依赖裁剪图

#### 依赖裁剪图: L3-capability-hub

```text
+--------------------+
| L3-capability-hub |
| capability access |
+---------+----------+
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
```

图示说明:

- 本图只展示 `L3-capability-hub` 当前 Step 6 从全局基线裁剪出的相关依赖边,不展示全 27 仓。
- `[compile]` 仅适用于 `L0-core`;`[runtime]` 和 `[event]` 不得写成 package dependency。
- 图中箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、事件传播时序或实现流程。
- `L3-method-library`、`L6-marketplace`、`L5-console`、`L4-observability`、KMS/Vault 和 finance/billing 当前不进入依赖主链;它们只作为关系边界、候选消费方或后续审计对象记录。

#### path dependency 判定结论

| 关联项目 | 依赖类型 | 是否允许写入 `Cargo.toml` / package dependency | 当前处理 |
|---|---|---|---|
| `L0-core` | 编译期依赖 | 是 | 后续可作为唯一内部 path dependency 候选继续展开。 |
| `L0-bus` | 事件协作依赖 | 否 | 只保留事件协作主干语义,后续通过事件协作边界讨论。 |
| `L1-governance` | 运行期 / 事件协作依赖 | 否 | 通过治理结果引用、状态引用或事件协作接缝协作。 |
| `L2-runtime` | 运行期依赖 | 否 | 通过正式服务边界、查询 / 快照边界或受控消费面协作。 |
| `L2-tools` | 运行期依赖 | 否 | 通过正式服务边界、查询 / 快照边界或受控消费面协作。 |
| `L0-sdk` | 运行期依赖 | 否 | 由 SDK 作为下游消费方封装本仓服务端能力边界。 |
| `L3-method-library` | 无直接依赖 | 否 | 当前只保留 body-free relation 边界,不落为源码依赖。 |
| 外部 MCP / A2A / API | 运行期依赖 | 否 | 仅作为外部接入对象和 adapter descriptor 目标,后续通过外部集成边界讨论。 |

### 7.9 旧材料差异审计

| 旧口径 | 当前 Step 6 处理 | 后续落点 |
|---|---|---|
| Runtime / tools 调外部能力必须经过 hub 执行 | 裁剪为 runtime/tools 消费能力接入事实,不经过 hub 执行调用。 | Step 7、Step 10、Step 12 |
| governance Policy 下发直接更新白名单 | 裁剪为 governance 结果 / policy 结果接缝,不让本仓拥有 Policy truth。 | Step 10、Step 11、Step 12 |
| Provider Contract + KMS/Vault 是主链依赖 | 裁剪为 adapter descriptor 与 secret reference 候选;KMS/Vault 不进入当前前置。 | Step 7、Step 10、Step 11、Step 13 |
| Cost Accounting / CostRecord 是主链 | 裁剪为非目标;若后续需要只作为 observability / finance 协作候选。 | Step 13、Step 14 |
| marketplace metadata / listing 是输出主链 | 裁剪为后续只读消费或引用候选;listing / transaction 不归本仓。 | Step 12、Step 15 |
| LLM routing 依赖 runtime + capability-hub | 当前排除为非目标 / future,不进入依赖主链。 | Step 15 |
| QueryCapabilities / provider lookup 是当前依赖表达 | 本步不写接口名;后续 Step 12 重新裁剪接口边界。 | Step 12 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 17 装配正式文档时可使用的 §6 候选文本。当前不得直接写入正式 `00-需求文档.md`。

### 8.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、基础引用和跨仓一致性基线 | 是 | capability identity、registry 引用和跨仓接入事实无法获得稳定表达基线。 |
| 输入 / 输出 | `L0-bus` | 能力接入事实变化的事件协作通道 | 是 | 能力注册、描述、状态和可见性变化只能停留在本地查询或手工同步,无法形成平台协作信号。 |
| 输入 / 输出 | `L1-governance` | 治理批准、policy 结果或能力使用约束的正式接缝;能力接入状态和反馈线索 | 是,对正式可用 / 可见边界是前置 | 本仓只能维护未治理的草稿或局部目录,不能稳定说明哪些能力可进入正式接入语境。 |
| 输出 | `L2-runtime` | 能力身份、注册目录、接入描述和治理 / 方法关系摘要 | 是,作为主要执行侧消费边界 | runtime 会重复保存外部能力配置或私自解释可用能力,access 与 execution 分离失效。 |
| 输出 | `L2-tools` | 外部 MCP / A2A / API 能力接入事实和受控消费边界 | 是,作为工具侧消费边界 | tools 会把 MCP/A2A/API 接入事实写成本地工具定义或执行配置,形成多 truth。 |
| 输出 | `L0-sdk` | 可被官方客户端封装的 L3 服务端能力边界和只读消费语义 | 否,不阻塞本仓核心 truth;对 SDK exposure 前置 | SDK 只能后置或私补 capability-hub client 语义,服务端能力边界难以被统一封装。 |
| 协作边界 | `L3-method-library` | capability 与 method asset 的 body-free relation 约束 | 否,不形成直接依赖 | 若后续不闭合 relation,方法资产可能私有引用外部能力;但当前不能把方法资产正文拉入本仓。 |

### 8.2 外部系统依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | 外部 MCP server / MCP ecosystem | 外部 MCP 能力作为被登记、描述和治理接缝引用的接入对象 | 是,对 MCP 类 adapter descriptor 前置;单个外部实例不可用不阻塞仓级闭环 | MCP 类能力只能停留在占位或草稿,不能形成可验证的接入描述语义。 |
| 输入 | 外部 A2A node / A2A ecosystem | 外部 Agent-to-Agent 能力或节点作为被登记、描述和身份可信审查的接入对象 | 是,对 A2A 类 adapter descriptor 前置;单个节点不可用不阻塞仓级闭环 | A2A 类能力无法形成身份、注册和接入描述边界,后续安全 / 审查语义无法落地。 |
| 输入 | 外部 API / provider API surface | 外部 API 能力作为 adapter descriptor 的接入对象和能力类型来源 | 是,对 API 类 adapter descriptor 前置;具体 provider runtime 不归本仓 | API 类能力无法稳定表达接入方式、约束摘要和外部连接边界。 |
| 外部边界候选 | secret / KMS / Vault 系统 | 仅可能在后续作为 secret reference 或安全基础设施接缝 | 否 | 本仓不得因密钥系统缺失而改写为 secrets 平台;涉及敏感材料时后续 Step 10/11/13 再裁剪。 |
| 外部边界候选 | finance / billing / provider raw billing | 仅可能作为后续成本 / 账单外部来源或事件协作背景 | 否 | 成本统计延迟不阻塞能力身份、注册和接入描述 truth;不得把 CostRecord 写成当前主链。 |

### 8.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L3-capability-hub` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 本仓需要共享契约、基础引用和跨仓一致性基线表达能力接入 truth。 |
| `L0-bus` | `L3-capability-hub` 通过 `L0-bus` 发布能力事件 | 协作方 | 事件协作 | 是 | 能力接入事实变化需要平台级协作信号,但不形成业务仓源码依赖。 |
| 外部 MCP / A2A / API | `L3-capability-hub` 运行期依赖外部 MCP / A2A / API 集成 | 依赖方 | 运行期 | 是 | 外部能力接入对象是本仓 adapter descriptor 和 registry 语义成立的前置;不代表本仓执行调用。 |
| `L1-governance` | governance 与 capability-hub 运行期 / 事件协作,capability-hub 消费能力使用约束并反馈能力线索 | 协作方 | 运行期 / 事件协作 | 是 | governance seam 是 Step 4 目标;但 approval execution 和 Policy truth 必须留在 governance。 |
| `L2-runtime` | `L2-runtime` 运行期消费 `L3-capability-hub` 能力 | 被依赖方 | 运行期 | 是 | runtime 是主要执行侧消费者;本仓只提供能力接入事实,不拥有 runtime execution。 |
| `L2-tools` | `L2-tools` 运行期消费 `L3-capability-hub` MCP / A2A 能力 | 被依赖方 | 运行期 | 是 | tools 是主要工具侧消费者;工具调用和工具执行 truth 不归本仓。 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1 / L2 / L3 / L4 API | 被依赖方 | 运行期 | 是 | SDK exposure boundary 是本仓目标之一;SDK client 和 language package 不归本仓。 |
| `L3-method-library` | 同属 L3,但职责分别是方法资产定义与外部能力注册 | 相邻仓 / relation 边界 | 无直接依赖 | 否 | 只保留 body-free relation 约束,不建立直接源码、正文或运行期强依赖。 |
| `L6-marketplace` | `L6-marketplace` 运行期消费 method / tool / role 发布审核能力并按需发布生态资产事件 | 下游候选 / 协作方 | 运行期 / 事件协作候选 | 否 | marketplace listing / transaction 是非目标;后续最多只读消费或引用。 |
| `L4-observability` | `L4-observability` 通过 `L0-bus` 消费 tap / audit material | 协作候选 | 事件协作候选 | 否 | 观测存储是横切系统,不成为本仓业务 truth 或当前主链前置。 |

### 8.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享契约、基础引用和跨仓一致性基线。 | `01-架构设计.md`、`03-详细设计.md`、`07-实施计划.md` |
| 事件协作依赖 | `L0-bus` | 发布 / 协作能力接入事实变化信号,不让 bus 拥有业务 truth。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md`、`07-实施计划.md` |
| 运行期依赖 | 外部 MCP / A2A / API | 将外部能力作为接入对象和 adapter descriptor 目标,不拥有外部 provider runtime。 | `01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` |
| 运行期 / 事件协作依赖 | `L1-governance` | 消费 / 引用治理结论或 policy 结果,提供能力接入反馈线索。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` |
| 运行期依赖 | `L2-runtime` | 向 runtime 提供能力接入事实、描述和可见性边界;不执行 runtime loop。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md` |
| 运行期依赖 | `L2-tools` | 向 tools 提供 MCP / A2A / API 能力接入事实;不执行工具调用。 | `01-架构设计.md`、`03-详细设计.md`、`05-测试方案.md` |
| 运行期依赖 | `L0-sdk` | 提供可被 SDK 封装的服务端能力边界;不实现 SDK client。 | `01-架构设计.md`、`03-详细设计.md`、`07-实施计划.md` |

### 8.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L3-capability-hub -> L2-runtime / L2-tools` 源码级依赖 | 会把 runtime execution、tool execution、agent loop、provider 调用结果或执行状态混入 capability registry truth。 | 运行期能力边界、只读能力接入事实、事件协作或 SDK / 正式服务边界。 |
| `L3-capability-hub -> L1-governance` 审批执行依赖 | 会把 governance approval、Policy effective fact 或 shared rules truth 写成本仓 truth。 | 使用治理结果引用、能力约束摘要、状态引用或事件协作接缝。 |
| `L3-capability-hub -> L3-method-library` 正文 / 源码依赖 | 会把 Method Content、TaskDefinition、ProcessTemplateDef、AIPolicyDef 等方法资产正文并入能力仓。 | 只保存 body-free method asset ref / relation 语义,具体字段后续 Step 11/12 裁剪。 |
| `L3-capability-hub -> 外部 MCP / A2A / API` 执行网关依赖 | 会把外部调用、重试、路由、provider runtime 和执行结果写成本仓 truth。 | 本仓只登记、描述和治理接缝引用外部能力;执行由 runtime/tools/provider adapter 边界处理。 |
| `L3-capability-hub -> KMS/Vault` 作为核心 truth 依赖 | 会把 secrets 平台和密钥生命周期管理变成本仓主线。 | 后续仅可使用 secret reference / 安全基础设施接缝,不保存 secret 正文。 |
| `L3-capability-hub -> finance / billing / raw provider billing` | 会把成本、账单和 provider 原始账单写成能力接入 truth。 | 若后续需要,通过观测 / 财务事件或摘要协作,不进入当前需求主链。 |
| `L3-capability-hub -> L6-marketplace` listing / transaction 依赖 | marketplace 上架、定价、购买、订单、结算和履约不是本仓职责。 | marketplace 可只读消费能力可发现性线索或引用,交易留在 `L6-marketplace`。 |

### 8.6 依赖裁剪图

#### 依赖裁剪图: L3-capability-hub

```text
+--------------------+
| L3-capability-hub |
| capability access |
+---------+----------+
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
```

图示说明:

- 本图只展示 `L3-capability-hub` 当前 Step 6 从全局基线裁剪出的相关依赖边,不展示全 27 仓。
- `[compile]` 仅适用于 `L0-core`;`[runtime]` 和 `[event]` 不得写成 package dependency。
- 图中箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、事件传播时序或实现流程。
- `L3-method-library`、`L6-marketplace`、`L5-console`、`L4-observability`、KMS/Vault 和 finance/billing 当前不进入依赖主链;它们只作为关系边界、候选消费方或后续审计对象记录。

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 6 | 后续处理 |
|---|---|---|---|---|
| OQ-CH-006-001 | governance seam 的最小引用内容是 approval ref、policy result ref、scope summary 还是状态引用。 | pending | 否 | Step 10 / Step 11 / Step 12 处理。 |
| OQ-CH-006-002 | method-library asset relation 是否进入 Step 7 核心能力闭环,以及 relation 是否只允许 body-free ref。 | pending | 否 | Step 7 / Step 11 / Step 12 处理。 |
| OQ-CH-006-003 | `L0-sdk` exposure 是核心能力节点还是接口章节中的对外能力边界。 | pending | 否 | Step 7 / Step 12 处理。 |
| OQ-CH-006-004 | 外部 API / provider API surface 是否需要区分普通 API、LLM provider API 和 provider runtime。 | pending | 否 | Step 7 / Step 10 / Step 11 / Step 12 处理。 |
| OQ-CH-006-005 | secret reference 是否需要作为 adapter descriptor 的约束摘要出现,以及如何避免进入 secret/KMS 平台。 | pending | 否 | Step 10 / Step 11 / Step 13 处理。 |
| OQ-CH-006-006 | marketplace 是否在当前 00 中完全只保留候选消费方,还是需要 Step 12 写只读 exposure 边界。 | pending | 否 | Step 12 / Step 15 处理。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 README / 旧 00~06 把执行、secret、cost、marketplace、policy refresh 写成依赖主链 | historical_conflict_not_blocker | 冲突说明旧材料不能继承,但全局依赖规则和 Step 2~5 已足以裁剪 Step 6。 | 记录为 historical material,并在禁止依赖表中给出正确协作方式。 |
| `L3-method-library` 与 capability relation 未定义字段 | not_blocker_for_step_06 | Step 6 只需判定无直接依赖并保留 body-free relation 边界;字段归 Step 11/12。 | 后续 Step 7 / 11 / 12 闭合。 |
| governance seam 字段未闭合 | not_blocker_for_step_06 | Step 6 可确认运行期 / 事件协作接缝和禁止 approval truth 合并;字段后续再定。 | 后续 Step 10 / 11 / 12 闭合。 |
| 外部 MCP/A2A/API 协议细节未闭合 | not_blocker_for_step_06 | Step 6 只确认外部系统依赖类别和失效影响;协议字段和适配细节不属于本步。 | 后续 Step 7 / 11 / 12 / 13 闭合。 |
| SDK exposure 的接口形态未闭合 | not_blocker_for_step_06 | Step 6 只确认 SDK 为运行期消费方,不定义 client 或 API。 | 后续 Step 12 闭合。 |

结论: 未发现阻塞 `00-需求文档.md` Step 6 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确本仓向谁提供能力 | pass | 已覆盖 `L2-runtime`、`L2-tools`、`L0-sdk`、governance 反馈和候选消费方。 |
| 已明确本仓依赖谁的前置能力 | pass | 已覆盖 `L0-core`、`L0-bus`、外部 MCP/A2A/API、`L1-governance`。 |
| 已区分内部仓依赖与外部系统依赖 | pass | 内部仓和外部系统分别成表。 |
| 已指出闭环前置与失效影响 | pass | 闭环前置依赖结论和两个依赖表均有失效影响。 |
| 已使用依赖裁剪固定表 | pass | 已包含本仓依赖裁剪表、依赖类型分类表、禁止依赖表。 |
| 已绘制依赖裁剪 ASCII 图 | pass | 图只展示本仓相关边并标注 `[compile]` / `[runtime]` / `[event]`。 |
| 未复制 27 仓总依赖矩阵 | pass | 只裁剪本仓相关关系。 |
| 未把运行期 / 事件协作写成编译期依赖 | pass | 只有 `L0-core` 是编译期依赖。 |
| 未写角色、接口名、事件名、DTO 或核心能力步骤 | pass | 旧接口名只作为历史差异审计出现,回填草稿不使用接口名。 |
| 旧材料冲突已记录 | pass | 已记录 runtime/tools、governance、KMS/Vault、cost、marketplace、LLM routing 等冲突。 |
| 是否可进入 Step 7 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
