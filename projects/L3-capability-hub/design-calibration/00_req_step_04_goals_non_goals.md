# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-07-06
> 当前状态: `completed_stop_review`
> 粒度参考: `projects/L1-governance/design-calibration/00_req_step_04_goals_non_goals.md`

---

## 0. 当前 Step 状态

| 项 | 记录 |
|---|---|
| 文档 | `projects/L3-capability-hub/00-需求文档.md` |
| Step | Step 4 目标与非目标 |
| 当前入口 | `Step 4 已完成,等待是否进入 Step 5` |
| gate_status | pass |
| next_allowed_action | `wait_user_review_to_step_05` |
| 正式文档写入 | blocked: 当前只写 Step 4 中间产物,不修改正式 `00-需求文档.md` |
| 当前策略 | 从头开始;每完成一个 Step 停审;不自动跨 Step |

### 0.1 Step 内计划

| 序号 | 动作 | 状态 | 结果 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1~3 | done | 确认用户已同意进入 Step 4,且当前不得自动进入 Step 5 或正式文档。 |
| 2 | 读取需求 SOP Step 4 和书写规范 4.4 | done | 确认本章只输出目标表、非目标表和范围收束结论。 |
| 3 | 读取 `L1-governance` Step 4 粒度参考 | done | 对齐 Step 结构、诊断深度和停审方式,不复制治理领域内容。 |
| 4 | 读取 README、旧 `00/01/02/03/05/06` 的目标 / 非目标线索 | done | 识别旧目标污染:白名单、Provider Contract、KMS、Policy refresh、Cost、QueryCapabilities、marketplace、LLM routing。 |
| 5 | 读取 `L3-method-library`、`L1-governance`、`L0-sdk` 的正式边界 | done | 确认 method asset body、governance approval truth、SDK client truth 不得进入当前目标范围。 |
| 6 | 回答 Step 4 四个 SOP 问题 | done | 形成目标、验证方式、非目标和相邻仓 / 后续阶段归属结论。 |
| 7 | 诊断旧材料目标污染 | done | 将旧功能、规则、NFR、测试、验收和实现口径全部后置或排除。 |
| 8 | 做设计取舍 | done | 采用“能力接入 truth 边界 + identity / registry + adapter descriptor + seam 边界”目标主线。 |
| 9 | 形成结构化目标表、非目标表和范围收束结论 | done | 为正式 §4 提供可回填候选。 |
| 10 | 做 blocker 判定并停审 | done | 未发现阻塞 Step 4 的上游 blocker,等待用户确认是否进入 Step 5。 |

---

## 1. 本步目标

把 `L3-capability-hub` 当前这轮需求要达成的状态、边界和能力范围收束清楚:本仓为什么只围绕外部 MCP / A2A / API 能力接入 truth 成立,本次需求完成后哪些边界必须被稳定建立,以及哪些相关事项虽然经常一起出现,但明确不纳入 capability-hub 的当前范围。

本步只写目标与非目标,不写:

- 用户与角色
- 使用方与依赖
- 核心能力闭环
- 用户故事
- 功能需求
- 业务规则
- 数据归属
- 接口设计
- 非功能指标
- 验收标准

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 固定本仓只承接“能力注册 / 外部 MCP / A2A / API 集成中心”的来源主题。 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 固定本仓是一处能力接入真相仓,先闭合 capability identity、registry 和 adapter descriptor。 |
| `design-calibration/00_req_step_03_problem_context.md` | 已完成 | 固定当前要解决的是外部能力正式接入语义未统一、相邻语境混写和旧问题层污染。 |
| `standards/document/需求文档讨论流程_SOP.md` | 已读 | 约束 Step 4 只回答目标、验证方式、非目标和相邻仓 / 后续阶段处理。 |
| `standards/document/需求文档书写规范.md` | 已读 | 约束正式 §4 使用目标表与非目标表,目标写状态 / 边界 / 能力范围,非目标写具体排除项。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读 | 约束 Step 文件必须记录输入、诊断、取舍、结构化产物与停审门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读 | 约束目标层不能提前写成功能名、接口名、对象字段、实现结构或测试门禁。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读 | 提供 `L3-capability-hub` 作为 L3 方法能力层横切能力的全局依赖背景。 |
| `projects/L3-capability-hub/README.md` | 已读 | 作为旧仓使命和越界目标污染样本输入。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | 已读 | 作为旧目标 / 非目标和旧指标污染诊断输入。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | 已读 | 作为旧系统边界、职责边界和子域目标污染输入。 |
| 旧 `projects/L3-capability-hub/02-概要设计.md` | 已读 | 作为旧“目标与非目标”以及旧约束条件污染输入。 |
| 旧 `projects/L3-capability-hub/03-详细设计.md` ~ `06-验收标准.md` | 已读 | 作为旧对象、旧测试门禁和旧验收指标反向污染目标层的样本输入。 |
| `projects/L3-method-library/00-需求文档.md` | 已读 | 固定方法资产定义正文不归本仓,本仓只允许后续讨论 asset relation。 |
| `projects/L1-governance/00-需求文档.md` | 已读 | 固定 governance approval / policy effective fact 不归本仓,本仓只允许后续讨论治理结果接缝。 |
| `projects/L0-sdk/00-需求文档.md` | 已读 | 固定 SDK client / package / 三语言接入 truth 不归本仓,本仓只允许后续讨论 exposure boundary。 |
| `projects/L1-governance/design-calibration/00_req_step_04_goals_non_goals.md` | 已读 | 仅作为 Step 4 粒度和组织方式参考,不作为领域来源。 |

---

## 3. SOP 问题回答

### 3.1 本次需求结束后,应成立哪些状态、边界或能力？

本次需求结束后,应成立以下目标:

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立能力接入 truth 的需求边界 | 明确 `L3-capability-hub` 本轮需求收束对象是外部 MCP / A2A / API 能力的接入事实,不是运行执行、方法资产定义、治理审批、客户端封装、交易展示或外部基础设施。 | 后续章节不把 runtime/tools execution、method asset body、governance approval truth、SDK client、marketplace listing、secret/KMS 或 cost/billing 写成本仓真相。 |
| 收束 capability identity 与 registry 范围 | 明确本仓目标包含“哪些外部能力以何种稳定身份进入正式接入语境、如何在注册目录中被识别和归档”的需求范围,但不提前定对象字段、接口名或状态机。 | Step 7 / Step 9 / Step 11 / Step 14 能把 identity、registry、状态和验收回指到能力接入 truth,且不混入 ToolDefinition 或 runtime execution state。 |
| 收束 adapter descriptor 范围 | 明确本仓目标包含外部 MCP / A2A / API 接入描述语义,用于表达接入方式、能力类型、约束摘要和外部连接边界;旧 `Provider Contract` 只作为历史线索重新裁剪。 | 后续章节能区分 adapter descriptor、provider runtime、secret reference、quota、cost 和外部 API 产品本体,不得把本仓写成 secret/KMS 或 provider runtime 平台。 |
| 收束 governance approval / policy 结果接缝 | 明确本仓只需要在需求层说明能力接入如何引用治理批准或 policy 结果,不执行 approval、不生成 policy truth、不让 capability whitelist 反向定义 governance。 | Step 6 / Step 10 / Step 11 / Step 12 能将治理关系写成引用、摘要、状态引用或事件协作,不出现本仓执行治理审批或拥有 Policy effective fact。 |
| 收束 method-library asset relation | 明确本仓可描述 capability 与 method asset 的关系边界,但不保存方法资产正文、不定义方法资产版本、不接管 method-library 发布语义。 | 后续章节若出现方法资产关系,必须以 body-free ref / relation 语义表达,不能把 Method Content、TaskDefinition、AIPolicyDef 或 ProcessTemplateDef 正文写入本仓。 |
| 收束 SDK exposure boundary | 明确本仓需求可以为 SDK 暴露 / 消费服务端能力提供稳定边界,但不实现 SDK client、多语言 package、端侧缓存或开发者体验。 | Step 6 / Step 12 能区分服务端 capability exposure 与 `L0-sdk` 客户端封装;不得把 SDK API、language binding 或发布候选写成本仓功能。 |
| 建立旧材料后置审计边界 | 明确旧文档中的白名单、Provider Contract、QueryCapabilities、CostRecord、KMS/Vault、marketplace metadata、P95、30s、100% 等只作为后续审计输入。 | 后续 Step 对功能、规则、数据、接口、NFR 和验收逐项重新校准,不得跳过本轮讨论直接继承旧目标、旧对象或旧指标。 |

### 3.2 这些目标如何被验证？

这些目标不是通过本步直接写测试用例或接口来验证,而是通过后续章节能否持续守住边界来验证:

- Step 5 用户与角色不把相邻仓 owner、执行者、客户端或基础设施操作者误写成本仓固有角色。
- Step 6 使用方与依赖不新增反向 truth,只保留 capability-hub 对 method-library、governance、SDK 和运行边界的必要协作。
- Step 7 核心能力闭环必须围绕 capability identity、capability registry、adapter descriptor 和必要 seam 展开,不能反向吸入 execution、secret、cost 或 listing。
- Step 9 功能需求不能直接复刻旧 `RegisterProvider`、`QueryCapabilities`、`CostRecord`、`KMS/Vault` 等对象名或接口名。
- Step 10 / Step 11 / Step 12 能分别把规则、数据和接口回指到目标表,同时守住相邻仓边界。
- Step 13 / Step 14 若保留性能、审计、覆盖率或安全门禁,必须证明它们属于 capability-hub 真正拥有的范围,而不是旧材料沿袭。

### 3.3 哪些事项虽然相关,但明确不纳入当前范围？

| 非目标 | 不做原因 |
|---|---|
| runtime execution / tools execution / 外部工具实际调用 | 属于 L2 执行边界;本仓只收束能力接入事实,不执行外部 MCP、A2A、API 或 provider 调用。 |
| provider runtime / provider failover / retry / routing 执行 | 属于运行时或 provider adapter 执行边界;本仓不拥有 provider runtime 状态或调用编排。 |
| method asset definition body / Method Content / TaskDefinition / ProcessTemplateDef / AIPolicyDef 正文 | 属于 `L3-method-library`;本仓只允许后续讨论 capability 与 method asset 的引用关系。 |
| governance approval execution / Policy effective fact / shared_rules truth | 属于 `L1-governance`;本仓只允许后续讨论治理结果引用或接缝,不得执行审批或拥有治理真相。 |
| SDK client / Rust-Python-TypeScript package / developer experience / local candidate | 属于 `L0-sdk`;本仓只提供可被 SDK 消费的服务端能力边界。 |
| secret/KMS/Vault 平台、API key 托管产品、密钥生命周期管理 | 属于安全基础设施或后续 adapter / secret reference 边界;本仓不成为 secrets 平台。 |
| cost accounting / billing / finance ledger / provider 原始账单 | 属于 finance / observability / 外部 provider 对账边界;本仓不把成本记录作为能力接入 truth。 |
| marketplace listing / transaction / purchase / pricing / commercial fulfillment | 属于 `L6-marketplace`;本仓不拥有 listing 或交易真相,后续最多审计只读 exposure / reference。 |
| LLM routing / model selection / prompt routing / provider orchestration | 属于 future 或 runtime/provider orchestration 边界;不纳入当前能力接入需求主链。 |
| observability log store / metrics / trace storage / alert stream | 属于 `L4-observability`;本仓后续只可输出必要业务事件或安全摘要,不替代观测存储。 |
| 具体功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置、实施计划 | 分别后置到 Step 5~17 和后续正式文档;Step 4 不定稿功能名、字段、协议、指标或实现边界。 |

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

必须交给相邻仓的事项:

- 方法资产正文、版本与发布语义交给 `L3-method-library`。
- 治理裁决、审批事实和 policy effective truth 交给 `L1-governance`。
- 官方客户端、多语言 package 和开发者体验交给 `L0-sdk`。
- runtime / tools 执行、provider orchestration、failover、retry 和真实外部调用交给 L2 执行边界。
- marketplace listing、交易、定价、购买和履约交给 `L6-marketplace`。
- secret/KMS、cost/billing、metrics、trace storage 和告警交给相应基础设施或相邻横切能力。

必须后续阶段处理的事项:

- 用户与角色后移 Step 5。
- 使用方与依赖后移 Step 6。
- 核心能力闭环后移 Step 7。
- 用户故事后移 Step 8。
- 功能需求后移 Step 9。
- 业务规则与边界约束后移 Step 10。
- 数据归属后移 Step 11。
- 接口与依赖后移 Step 12。
- 非功能需求后移 Step 13。
- 验收标准后移 Step 14。
- 风险、追溯矩阵和正式文档装配后移 Step 15~17。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 当前处理 |
|---|---|---|---|
| `README.md` 仓使命 | “能力池 = MCP Server 注册表 + A2A Node Directory + Provider Contract + 白名单 / 成本记账”。 | 把能力身份 / 注册与 provider secret、cost 和记账、执行白名单混成一仓。 | 只保留“外部能力接入中心”线索,不继承 Provider Contract / cost / execution 主线。 |
| 旧 `00-需求文档.md` §3.1 | 目标直接写白名单 100%、A2A 身份校验、Provider Contract、Policy `<30s`、成本覆盖率。 | 目标层混入功能、规则、NFR、测试和验收。 | 改写为状态 / 边界 / 能力范围目标;旧指标后置到 Step 13 / Step 14 候选审计。 |
| 旧 `00-需求文档.md` §3.2 | 非目标只排除工具执行、业务逻辑、会话、marketplace、全功能 secrets。 | 方向部分正确,但遗漏 governance、SDK、method body、provider runtime、cost / billing、LLM routing 等关键边界。 | 非目标补齐为相邻仓和横切基础设施的具体排除项。 |
| 旧 `01-架构设计.md` §4.2 / §5 | 直接把 QueryCapabilities、Cost Accounting、Provider Contract 设成“做什么”的主线 | 架构和对象反向定义了需求目标。 | 不继承旧功能名和子域名;后续 Step 7 再重新裁剪核心能力节点。 |
| 旧 `02-概要设计.md` §3 / §4 | 目标与约束中把 policy-aware access、KMS/Vault、CostRecord、P95、明文 key 为 0 提前定稿。 | 旧目标被约束、NFR 和实现依赖污染。 | Step 4 只保留边界目标,旧约束后移到规则、接口、NFR 或验收候选审计。 |
| 旧 `03/05/06` | 详细设计、测试和验收已冻结旧对象、旧接口和旧门禁。 | 下游文档反向支配需求范围。 | 仅作 historical material,不得反向继承为当前目标。 |

---

## 5. 改动前后对比

| 项 | restart 前活跃口径 | 当前 Step 4 口径 | 原因 |
|---|---|---|---|
| 目标主线 | 白名单、Provider Contract、Policy update、Cost、QueryCapabilities 并列为目标 | 能力接入 truth、identity / registry、adapter descriptor 和必要 seam 作为目标 | 先守住 capability-hub 为什么成立,不把功能名和指标写成目标。 |
| 目标表达 | 指标 / 功能 / 测试化表述较多 | 状态 / 边界 / 能力范围表述 | 对齐 4.4 书写规范。 |
| 非目标范围 | 只排除工具执行、会话、marketplace、全功能 secrets | 补齐 execution、provider runtime、method body、governance truth、SDK client、secret、cost、marketplace、LLM routing、observability 等 | 对齐 Step 2 边界与用户给定重点边界。 |
| 历史材料处理 | 旧对象和旧指标容易被当成默认延续 | 旧对象和旧指标全部降级为后续审计输入 | 避免旧详细设计、测试和验收倒灌当前目标层。 |

---

## 6. 设计取舍

### 6.1 目标主轴取舍

| 方案 | 表达方式 | 优点 | 缺点 | 结论 |
|---|---|---|---|---|
| 方案 A | 保留旧 G-1~G-6 目标表 | 承接旧文档,看起来“可验”。 | 混入功能、规则、NFR、测试和旧对象,且与 Step 2 非职责冲突。 | 不采用。 |
| 方案 B | 只写“统一能力接入中心”一个总目标 | 简洁。 | 太空泛,不能约束 identity、registry、adapter descriptor 和相邻 seam。 | 不采用。 |
| 方案 C | 按能力接入 truth、identity / registry、adapter descriptor、governance seam、method relation、SDK exposure 拆目标 | 能回应 Step 2 / Step 3,并支撑后续可落码拆解。 | 需要后续 Step 7~14 再展开功能、规则、数据和验收。 | 采用。 |
| 方案 D | 按旧对象拆目标:`MCPServer`、`A2ANode`、`ProviderContract`、`CapabilityDecision`、`CostRecord` | 接近旧实现。 | 提前固化对象,会污染后续数据归属和详细设计。 | 不采用。 |

### 6.2 关键议题取舍

| 议题 | 方案 A | 方案 B | 当前结论 |
|---|---|---|---|
| 是否把 `Provider Contract` 写成目标 | 写成 provider 合同与 key / quota / cost 管理目标。 | 改写为 `adapter descriptor` 边界目标,不承诺 secret、quota、cost。 | 采用 B。 |
| 是否把白名单 / allow-deny 写成目标 | 写成白名单 100% 生效和未白名单 100% 拦截。 | 写成 governance approval / policy 结果接缝目标,具体规则后置。 | 采用 B。 |
| 是否把 `QueryCapabilities` 写成目标 | 写成查询接口和高频读路径目标。 | 后置 Step 7 / Step 9 / Step 12 / Step 13 重新命名和裁剪。 | 采用 B。 |
| 是否把成本记账写成目标 | 写成外部调用成本 100% 覆盖。 | 排为非目标;若需要只作为 finance / observability 事件接缝后续审计。 | 采用 B。 |
| 是否把 KMS / Vault 写成目标 | 写成 API key 加密托管目标。 | 排除 secret/KMS 平台;后续只允许讨论 secret reference / adapter requirement。 | 采用 B。 |
| 是否把 marketplace metadata 写成目标 | 写成能力元数据发布。 | 排除 marketplace listing / transaction;后续仅审计只读 exposure 或引用接缝。 | 采用 B。 |
| 是否把 LLM routing 写成目标 | 写成模型路由增强。 | 排为非目标 / future,不进入当前需求主链。 | 采用 B。 |

---

## 7. 结构化中间产物

### 7.1 目标结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立能力接入 truth 的需求边界 | 明确 `L3-capability-hub` 本轮需求收束对象是外部 MCP / A2A / API 能力的接入事实,不是运行执行、方法资产定义、治理审批、客户端封装、交易展示或外部基础设施。 | 后续章节不把 runtime/tools execution、method asset body、governance approval truth、SDK client、marketplace listing、secret/KMS 或 cost/billing 写成本仓真相。 |
| 收束 capability identity 与 registry 范围 | 明确本仓目标包含“哪些外部能力以何种稳定身份进入正式接入语境、如何在注册目录中被识别和归档”的需求范围,但不提前定对象字段、接口名或状态机。 | Step 7 / Step 9 / Step 11 / Step 14 能把 identity、registry、状态和验收回指到能力接入 truth,且不混入 ToolDefinition 或 runtime execution state。 |
| 收束 adapter descriptor 范围 | 明确本仓目标包含外部 MCP / A2A / API 接入描述语义,用于表达接入方式、能力类型、约束摘要和外部连接边界;旧 `Provider Contract` 只作为历史线索重新裁剪。 | 后续章节能区分 adapter descriptor、provider runtime、secret reference、quota、cost 和外部 API 产品本体,不得把本仓写成 secret/KMS 或 provider runtime 平台。 |
| 收束 governance approval / policy 结果接缝 | 明确本仓只需要在需求层说明能力接入如何引用治理批准或 policy 结果,不执行 approval、不生成 policy truth、不让 capability whitelist 反向定义 governance。 | Step 6 / Step 10 / Step 11 / Step 12 能将治理关系写成引用、摘要、状态引用或事件协作,不出现本仓执行治理审批或拥有 Policy effective fact。 |
| 收束 method-library asset relation | 明确本仓可描述 capability 与 method asset 的关系边界,但不保存方法资产正文、不定义方法资产版本、不接管 method-library 发布语义。 | 后续章节若出现方法资产关系,必须以 body-free ref / relation 语义表达,不能把 Method Content、TaskDefinition、AIPolicyDef 或 ProcessTemplateDef 正文写入本仓。 |
| 收束 SDK exposure boundary | 明确本仓需求可以为 SDK 暴露 / 消费服务端能力提供稳定边界,但不实现 SDK client、多语言 package、端侧缓存或开发者体验。 | Step 6 / Step 12 能区分服务端 capability exposure 与 `L0-sdk` 客户端封装;不得把 SDK API、language binding 或发布候选写成本仓功能。 |
| 建立旧材料后置审计边界 | 明确旧文档中的白名单、Provider Contract、QueryCapabilities、CostRecord、KMS/Vault、marketplace metadata、P95、30s、100% 等只作为后续审计输入。 | 后续 Step 对功能、规则、数据、接口、NFR 和验收逐项重新校准,不得跳过本轮讨论直接继承旧目标、旧对象或旧指标。 |

### 7.2 非目标结论

| 非目标 | 不做原因 |
|---|---|
| runtime execution / tools execution / 外部工具实际调用 | 属于 L2 执行边界;本仓只收束能力接入事实,不执行外部 MCP、A2A、API 或 provider 调用。 |
| provider runtime / provider failover / retry / routing 执行 | 属于运行时或 provider adapter 执行边界;本仓不拥有 provider runtime 状态或调用编排。 |
| method asset definition body / Method Content / TaskDefinition / ProcessTemplateDef / AIPolicyDef 正文 | 属于 `L3-method-library`;本仓只允许后续讨论 capability 与 method asset 的引用关系。 |
| governance approval execution / Policy effective fact / shared_rules truth | 属于 `L1-governance`;本仓只允许后续讨论治理结果引用或接缝,不得执行审批或拥有治理真相。 |
| SDK client / Rust-Python-TypeScript package / developer experience / local candidate | 属于 `L0-sdk`;本仓只提供可被 SDK 消费的服务端能力边界。 |
| secret/KMS/Vault 平台、API key 托管产品、密钥生命周期管理 | 属于安全基础设施或后续 adapter / secret reference 边界;本仓不成为 secrets 平台。 |
| cost accounting / billing / finance ledger / provider 原始账单 | 属于 finance / observability / 外部 provider 对账边界;本仓不把成本记录作为能力接入 truth。 |
| marketplace listing / transaction / purchase / pricing / commercial fulfillment | 属于 `L6-marketplace`;本仓不拥有 listing 或交易真相,后续最多审计只读 exposure / reference。 |
| LLM routing / model selection / prompt routing / provider orchestration | 属于 future 或 runtime/provider orchestration 边界;不纳入当前能力接入需求主链。 |
| observability log store / metrics / trace storage / alert stream | 属于 `L4-observability`;本仓后续只可输出必要业务事件或安全摘要,不替代观测存储。 |
| 具体功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置、实施计划 | 分别后置到 Step 5~17 和后续正式文档;Step 4 不定稿功能名、字段、协议、指标或实现边界。 |

### 7.3 范围收束结论

本次需求的 Step 4 范围是把 `L3-capability-hub` 收束为外部 MCP / A2A / API 能力接入 truth 的需求边界,并固定以下方向:

- 能力身份与注册目录属于本仓目标范围。
- 接入描述语义属于本仓目标范围。
- governance、method-library 和 SDK 只通过接缝或消费边界协作。
- execution、secret、cost、marketplace、LLM routing 和旧实现对象不进入当前目标范围。

后续 Step 必须围绕这些目标拆解角色、依赖、核心能力、功能、规则、数据、接口、NFR 和验收,不得由旧 README、旧正式文档或实现想象反向扩张。

---

## 8. 回填草稿

以下内容供 Step 17 组装正式 `00-需求文档.md` 时回填到 §4:

```md
## 4. 目标与非目标

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/00_req_step_04_goals_non_goals.md` 的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节,了解本章目标与非目标如何从旧材料中收敛而来。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立能力接入 truth 的需求边界 | 明确 `L3-capability-hub` 本轮需求收束对象是外部 MCP / A2A / API 能力的接入事实,不是运行执行、方法资产定义、治理审批、客户端封装、交易展示或外部基础设施。 | 后续章节不把 runtime/tools execution、method asset body、governance approval truth、SDK client、marketplace listing、secret/KMS 或 cost/billing 写成本仓真相。 |
| 收束 capability identity 与 registry 范围 | 明确本仓目标包含“哪些外部能力以何种稳定身份进入正式接入语境、如何在注册目录中被识别和归档”的需求范围,但不提前定对象字段、接口名或状态机。 | 后续章节能把 identity、registry、状态和验收回指到能力接入 truth,且不混入 runtime execution state。 |
| 收束 adapter descriptor 范围 | 明确本仓目标包含外部 MCP / A2A / API 接入描述语义,用于表达接入方式、能力类型、约束摘要和外部连接边界。 | 后续章节能区分 adapter descriptor、provider runtime、secret reference、quota、cost 和外部 API 产品本体,不得把本仓写成 secret/KMS 或 provider runtime 平台。 |
| 收束 governance approval / policy 结果接缝 | 明确本仓只需要在需求层说明能力接入如何引用治理批准或 policy 结果,不执行 approval、不生成 policy truth、不让 capability whitelist 反向定义 governance。 | 后续章节能将治理关系写成引用、摘要、状态引用或事件协作,不出现本仓执行治理审批或拥有 Policy effective fact。 |
| 收束 method-library asset relation | 明确本仓可描述 capability 与 method asset 的关系边界,但不保存方法资产正文、不定义方法资产版本、不接管 method-library 发布语义。 | 后续章节若出现方法资产关系,必须以 body-free ref / relation 语义表达,不能把方法资产正文写入本仓。 |
| 收束 SDK exposure boundary | 明确本仓需求可以为 SDK 暴露 / 消费服务端能力提供稳定边界,但不实现 SDK client、多语言 package、端侧缓存或开发者体验。 | 后续章节能区分服务端 capability exposure 与 `L0-sdk` 客户端封装;不得把 SDK API、language binding 或发布候选写成本仓功能。 |
| 建立旧材料后置审计边界 | 明确旧文档中的白名单、Provider Contract、QueryCapabilities、CostRecord、KMS/Vault、marketplace metadata、P95、30s、100% 等只作为后续审计输入。 | 后续 Step 对功能、规则、数据、接口、NFR 和验收逐项重新校准,不得跳过本轮讨论直接继承旧目标、旧对象或旧指标。 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| runtime execution / tools execution / 外部工具实际调用 | 属于 L2 执行边界;本仓只收束能力接入事实,不执行外部 MCP、A2A、API 或 provider 调用。 |
| provider runtime / provider failover / retry / routing 执行 | 属于运行时或 provider adapter 执行边界;本仓不拥有 provider runtime 状态或调用编排。 |
| method asset definition body / Method Content / TaskDefinition / ProcessTemplateDef / AIPolicyDef 正文 | 属于 `L3-method-library`;本仓只允许后续讨论 capability 与 method asset 的引用关系。 |
| governance approval execution / Policy effective fact / shared_rules truth | 属于 `L1-governance`;本仓只允许后续讨论治理结果引用或接缝,不得执行审批或拥有治理真相。 |
| SDK client / Rust-Python-TypeScript package / developer experience / local candidate | 属于 `L0-sdk`;本仓只提供可被 SDK 消费的服务端能力边界。 |
| secret/KMS/Vault 平台、API key 托管产品、密钥生命周期管理 | 属于安全基础设施或后续 adapter / secret reference 边界;本仓不成为 secrets 平台。 |
| cost accounting / billing / finance ledger / provider 原始账单 | 属于 finance / observability / 外部 provider 对账边界;本仓不把成本记录作为能力接入 truth。 |
| marketplace listing / transaction / purchase / pricing / commercial fulfillment | 属于 `L6-marketplace`;本仓不拥有 listing 或交易真相,后续最多审计只读 exposure / reference。 |
| LLM routing / model selection / prompt routing / provider orchestration | 属于 future 或 runtime/provider orchestration 边界;不纳入当前能力接入需求主链。 |
| observability log store / metrics / trace storage / alert stream | 属于 `L4-observability`;本仓后续只可输出必要业务事件或安全摘要,不替代观测存储。 |
| 具体功能清单、业务规则、数据归属、接口、NFR、验收、架构、配置、实施计划 | 分别后置到后续需求 Step 和正式设计文档;Step 4 不定稿功能名、字段、协议、指标或实现边界。 |

### 4.3 范围收束

本章把 `L3-capability-hub` 收束为外部 MCP / A2A / API 能力接入 truth 的需求边界:能力身份与注册目录属于本仓目标范围;接入描述语义属于本仓目标范围;governance、method-library 和 SDK 只通过接缝或消费边界协作;execution、secret、cost、marketplace 和 LLM routing 不进入当前目标范围。
```

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 4 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-014` | `adapter descriptor` 是否完全替代旧 `Provider Contract`,还是保留为不同层级概念。 | pending | 否 | Step 7 / Step 11 / Step 12 重新裁剪。 |
| `OQ-CH-015` | governance seam 最终保存 approval ref、policy effective ref、scope summary 还是仅保存状态引用。 | pending | 否 | Step 6 / Step 10 / Step 11 / Step 12 讨论。 |
| `OQ-CH-016` | capability 与 method asset 的关系是否只允许 body-free ref / relation。 | pending | 否 | Step 7 / Step 11 / Step 12 讨论。 |
| `OQ-CH-017` | SDK exposure 是核心能力节点还是接口章节约束。 | pending | 否 | Step 7 / Step 12 讨论。 |
| `OQ-CH-018` | cost / audit 是否完全排除,还是仅保留业务事件 / observability / finance 接缝。 | pending | 否 | Step 10 / Step 12 / Step 13 / Step 14 审计。 |
| `OQ-CH-019` | 白名单 / allow-deny 是否进入本仓规则语义,还是仅作为 governance / runtime 结果消费视图。 | pending | 否 | Step 7 / Step 10 / Step 11 / Step 12 讨论。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧目标和非目标严重混入功能、规则、NFR、测试和验收 | `historical_conflict_not_blocker` | 冲突说明旧材料不能继承,但已有 Step 2 / Step 3 支撑当前目标重写。 | 已记录为 historical material;后续 Step 逐项重新裁剪。 |
| `adapter descriptor` 与 `Provider Contract` 命名未最终闭合 | `not_blocker_for_step_04` | Step 4 只需确认接入描述语义目标,具体对象和字段后移。 | Step 7 / Step 11 / Step 12 处理。 |
| governance seam 字段未闭合 | `not_blocker_for_step_04` | Step 4 只需排除 governance approval execution 并确认接缝方向。 | Step 6 / Step 10 / Step 11 / Step 12 处理。 |
| cost / audit 是否保留事件接缝未闭合 | `not_blocker_for_step_04` | Step 4 已排除 cost accounting 作为目标;若需协作接缝后续再裁剪。 | Step 10 / Step 12 / Step 13 / Step 14 处理。 |

结论: 未发现阻塞 `00-需求文档.md` Step 4 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每个目标都可验证 | pass | 验证方式绑定到后续章节是否越界和是否可追溯。 |
| 每个非目标具体且有边界作用 | pass | 均指向相邻仓、横切基础设施或后续阶段。 |
| 未把功能需求写成目标 | pass | 未把 Register / Query / Refresh / Record 等功能名作为目标。 |
| 未把实现方案写成目标 | pass | 未写 Rust、PostgreSQL、KMS adapter、repository、cache 或 event payload。 |
| 未把旧指标写成目标 | pass | 旧 P95、30s、100% 覆盖率全部后置。 |
| 未展开用户、依赖、核心能力、功能、规则、数据、接口、NFR、验收 | pass | 仅给出后续落点。 |
| 是否可进入 Step 5 | `blocked_until_user_confirm` | 必须等待用户确认后才能继续。 |
