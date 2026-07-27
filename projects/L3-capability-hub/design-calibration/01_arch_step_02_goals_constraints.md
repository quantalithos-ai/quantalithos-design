# L3-capability-hub 01 架构 Step 2: 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力、§3 约束条件
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md` 与 `01_arch_step_01_requirement_baseline.md` 推导架构目标与约束;旧 README 和旧 `01-架构设计.md` 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 明确架构目标与约束 |
| 输出文件 | `design-calibration/01_arch_step_02_goals_constraints.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 2;`架构设计书写规范.md` §4.2 / §4.3 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;正式 `00-需求文档.md` §4 / §7 / §10 / §11 / §13 / §14 / §15 |
| 已读取历史输入 | yes:`README.md`;旧 `01-架构设计.md` §1~§5 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 2;`L3-method-library` Step 2;`L0-sdk` Step 2 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 1 进入 Step 2 |
| next_allowed_action | Step 2 已完成,等待用户确认后进入 Step 3。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入架构目标思考。 |
| 架构目标:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入架构目标写入。 |
| 架构目标:再写入 | done | 业务背景 / 驱动力 / 架构目标表 | pass | 进入不可变约束思考。 |
| 不可变约束:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入不可变约束写入。 |
| 不可变约束:再写入 | done | 不可变约束表 | pass | 进入当前阶段取舍思考。 |
| 当前阶段取舍:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入当前阶段取舍写入。 |
| 当前阶段取舍:再写入 | done | 当前阶段可接受取舍表 | pass | 进入架构非目标思考。 |
| 架构非目标:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入架构非目标写入。 |
| 架构非目标:再写入 | done | 架构非目标表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 3。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 2 目标是把已收稳的边界、能力和数据前提转译成结构目标、不可变约束、可接受取舍和架构非目标。 | 本 Step 不写系统上下文、容器、依赖图、数据库、协议、状态机或技术方案。 |
| `standards/document/架构设计书写规范.md` | §4.2 要求业务背景短文、驱动力清单、架构目标表;§4.3 要求不可变约束、当前阶段可接受取舍和架构非目标。 | 四类结论必须分开,目标写结构性结果,约束写红线,取舍写有意识收缩,非目标写范围排除。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 产物必须先思考再写入,并记录 flow、ledger 和恢复门禁。 | 本文件保留过程判断、结构化结论、回填草稿和停审。 |
| `standards/document/设计文档编写通则.md` | 正式文档只承载收口结论,过程材料保留在 `design-calibration`。 | 正式 `01-架构设计.md` 仍不能修改,只能在 Step 16 装配。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 设计过程不能制造多真相源、跳过 schema / state / boundary 闭口,也不能压缩必要字段和约束。 | 本 Step 只收束架构目标和边界,把 API / DTO / event / state / storage / evidence / implementation boundary 明确后移。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;其他仓应按运行期、事件、ref、summary 或消费边界表达。 | 不可变约束必须防止 governance、runtime、tools、SDK、method-library、observability、marketplace 或外部 provider 成为源码级业务依赖。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已收敛 ARB-CH-001~013、AHC-CH-001~011、ARR-CH-001~010。 | Step 2 只能从这些需求基线、硬约束和风险口径推导目标与约束。 |
| `00-需求文档.md` §4 | 目标是建立 capability access truth、identity / registry、adapter descriptor、governance seam、method relation、SDK exposure boundary 和旧材料后置审计边界。 | 架构目标必须围绕 access truth 和核心边界展开,不能复活旧 Provider Contract / Cost / KMS / QueryCapabilities 主线。 |
| `00-需求文档.md` §7 | 核心闭环为 C-CH-1~C-CH-5:稳定身份、受控注册目录、可解释 descriptor、governance / method seam、formal exposure / change awareness。 | 架构目标必须以五段闭环作为结构主线。 |
| `00-需求文档.md` §10 | `BR-CH-001~037` 与 `BR-CH-E001` 已把 truth 不变量、禁止行为、显式变化、相邻仓边界、治理约束和审计约束写成规则。 | 不可变约束必须保护 identity、registry、descriptor、seam、relation、exposure、派生 / 维护不反写和 forbidden body。 |
| `00-需求文档.md` §11 | 数据分为 truth / snapshot / ref / forbidden body;controlled consumer view / `CapabilityDecision` 类结果只能是快照。 | 目标与约束必须显式防止 snapshot / ref 升级为 truth。 |
| `00-需求文档.md` §13 | NFR 强调核心闭环不被外围阻塞、truth 完整性优先、禁止正文、安全摘要不替代 truth、关键变化可追溯、派生视图可滞后但不得反写。 | Step 2 可承接结构性质量目标,但不继承旧 P95 / Policy 30s / SLA / 成本覆盖率。 |
| `00-需求文档.md` §14 | `VF-CH-001~013` 将核心闭环断裂、identity / registry / descriptor / seam / relation / exposure 被替代、forbidden body 入仓、非 core 编译依赖和旧口径回流列为否决项。 | 不可变约束和非目标必须能够支撑这些 VETO。 |
| `00-需求文档.md` §15 | governance seam、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、marketplace / console / observability、formal exposure 延迟和 API / DTO / state / boundary 等仍挂起。 | 当前阶段取舍必须写清后移口径,不得在 Step 2 自行闭口。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| `projects/L3-capability-hub/README.md` | historical material | 保留“外部 MCP / A2A / API 能力接入中心、能力池、治理联动”线索;不继承 runtime 必经 hub、Provider key、Cost、KMS、marketplace、LLM routing。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | historical material | 只审计旧目标、旧四子域、旧指标和旧技术假设;不作为新版架构基线。 |
| `L1-governance` Step 2 | reference material | 参考结构目标、不可变约束、当前取舍、非目标和旧材料差异审计的粒度。 |
| `L3-method-library` Step 2 | reference material | 参考 full-restart 下的过程记录和结构化中间产物密度。 |
| `L0-sdk` Step 2 | reference material | 参考 SDK exposure / client boundary 的裁剪方式。 |

---

## 3. 整体模块骨架

Step 2 只回答“架构必须确保什么成立、绝不能碰什么、当前有意识不做深什么、哪些事项明确不展开”。本 Step 不定义系统上下文、职责边界、限界上下文、容器、依赖方向、数据一致性、通信、技术选型、ADR、API、DTO、状态、存储、配置、测试证据或实施边界。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 架构目标 | capability-hub 架构必须确保哪些结构性结果成立。 | 不复制功能需求,不写接口、事件、状态、对象 schema 或技术方案。 | 业务背景、驱动力、架构目标表。 |
| 不可变约束 | 哪些边界一旦被破坏,本仓架构就失效。 | 不写普通偏好、待办项、性能口号或实现机制。 | 不可变约束表。 |
| 当前阶段取舍 | 哪些潜在相关内容当前有意识收缩或后移。 | 不把明确边界外职责写成“以后再做”。 | 当前阶段可接受取舍表。 |
| 架构非目标 | 哪些事项明确不属于当前架构主线。 | 不替相邻仓设计,不重复取舍表。 | 架构非目标表。 |
| 旧材料差异审计 | 旧 README / 旧 `01` 哪些线索可保留,哪些必须废弃或降级。 | 不继承旧对象、旧指标、旧子域或旧技术选型。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入职责边界讨论。 | 不提前通过 Step 3 门禁,不创建 Step 3 文件。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 架构目标:先思考

问题回答:

- 这个仓值得单独做架构设计,不是因为它要提供一个更大的 provider / tool gateway,而是因为外部 MCP / A2A / API 能力接入事实需要一个独立、可追溯、可被下游消费的 truth owner。
- 架构必须确保 capability identity、registry、adapter descriptor、governance seam、body-free method relation、formal exposure 和 change / consumer impact 作为连续结构成立。
- 架构目标要表达“结构性结果”,不是功能项。比如“支持注册 MCP server”是功能线索,“承载稳定 capability identity 与受控 registry 的接入 truth”才是架构目标。
- Step 1 已把 `L0-core` 限定为唯一编译期依赖候选,把 `L0-bus` 限定为事件协作;架构目标必须允许相邻仓协作,但不能让相邻仓 truth 侵入本仓。
- formal exposure 必须是服务端正式边界;controlled consumer view 或 `CapabilityDecision` 类结果只能是由正式接入事实派生的快照,不能成为 runtime allow / deny decision 或 query truth。
- 当前可以判断的目标是结构目标、边界目标和可解释目标;不能量化为旧 `QueryCapabilities P95 < 50ms`、`Policy refresh < 30s`、未白名单拦截率、成本覆盖率或 SLA。

诊断:

- 旧 `01` 的目标把统一能力入口、白名单拦截、provider key / quota / cost、Policy refresh、QueryCapabilities 和 KMS / Vault 混成一个运行中心,与新版 capability access truth 定位冲突。
- 若目标只写“能力池 / registry”,后续容易退化成 allowlist、runtime cache 或 marketplace listing;因此必须把 identity、registry、descriptor、seam、relation、exposure 连续写入架构目标。
- 若目标不包含“外围增强隔离”,管理入口、搜索、候选发现、SDK 说明、生态发现和审计导出会被误认为核心闭环前置。
- 若目标不包含“变化可追溯和下游可感知”,本仓会退化为静态目录,下游仍会私补能力配置或缓存。

取舍:

- 架构目标收敛为八项:access truth、稳定身份与注册目录、可解释 descriptor、治理与方法接缝、formal exposure 与消费快照分层、显式变化与追溯、核心与外围隔离、跨仓协作可承接。
- 不单独把每个功能需求写成目标,而是用 C-CH-1~C-CH-5 和数据边界归并。
- 不把旧质量数字写成目标;只保留“不成为不可解释瓶颈”“边界异常可识别”等结构性质量方向。
- 不关闭 ARR-CH-001~010,只在目标和取舍中保留安全承接位置。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成结构性结果 | pass | 目标候选均围绕 truth、边界、消费和追溯成立。 |
| 是否避免功能项和实现方案 | pass | 未写 API、DTO、状态、存储、事件、容器或技术选型。 |
| 是否回指需求主线 | pass | 目标均可回指 C-CH-1~C-CH-5、BR-CH、数据归属、NFR 和 VETO。 |
| 是否可进入“架构目标:再写入” | pass | 可转成业务背景、驱动力和架构目标表。 |

### 4.2 架构目标:再写入

#### 4.2.1 业务背景与驱动力

`L3-capability-hub` 需要单独做架构设计,因为外部 MCP / A2A / API 能力会被 governance、method-library、runtime、tools、SDK、产品入口、observability 和生态入口长期引用。如果这些能力只散落在 URL、provider 名、tool config、runtime cache、SDK wrapper、marketplace listing 或手工白名单中,平台就无法围绕同一个 capability access truth 讨论“这个外部能力是谁、如何被接入、为何可见、受哪些约束、与哪些方法资产有关、下游应该如何感知变化”。

本仓的架构驱动力不是执行外部工具调用,也不是管理 provider secret、成本或 marketplace 交易,而是为外部能力接入事实提供稳定结构:identity 让能力主体可引用,registry 让能力进入受控目录,adapter descriptor 让接入方式可解释,governance seam 和 method relation 让能力使用语境可追溯,formal exposure 和 controlled consumer view 让下游按服务端正式边界消费。

核心驱动力:

| 驱动力 | 说明 |
|---|---|
| 外部能力接入事实需要独立承载 | 否则 runtime、tools、SDK、provider 配置和 marketplace 展示会各自补造 capability truth。 |
| 稳定身份和注册目录需要在执行前成立 | 否则外部能力只能以临时 URL、provider 名或运行配置存在,无法支撑 descriptor、governance seam、method relation 和 exposure。 |
| 接入描述需要与 provider runtime / secret / cost 分离 | 否则 adapter descriptor 会退化为 Provider Contract,把 API key、quota、route、cost、failover 和 invocation truth 拉入本仓。 |
| 治理结果与方法资产关系需要有接缝但不能串仓 | 否则 capability-hub 会越权生成 approval / Policy truth,或复制 method asset body。 |
| 服务端正式暴露边界需要被下游稳定消费 | 否则 `CapabilityDecision` 类快照、runtime cache、tools config 或 SDK client 会反向定义正式能力边界。 |
| 派生、维护和外围增强必须服从核心 truth | 否则搜索、导出、对账、候选发现、管理 UI、只读生态发现和审计摘要会成为隐式写源。 |
| 跨仓协作必须裁剪依赖方向 | 否则 governance、runtime、tools、SDK、method-library、observability、marketplace 或外部 provider 会被误建模为源码级业务依赖。 |

#### 4.2.2 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的 capability access truth | 否则本仓会退化为执行网关、白名单缓存、provider 配置表、SDK wrapper 或 marketplace metadata。 |
| 支撑外部能力以稳定身份进入受控注册目录 | 否则 registry、descriptor、governance seam、method relation 和 exposure 会围绕临时 URL、provider 名或运行配置补 truth。 |
| 支撑 adapter descriptor 作为可解释接入描述成立 | 否则下游只能通过 provider runtime、secret、quota、route、cost 或请求 / 响应协议细节理解能力边界。 |
| 支撑 governance seam 与接入审查职责分离 | 否则正式可见 / 可用语境会被本地目录状态、白名单刷新或接入审查意见替代治理结论。 |
| 支撑 capability-method body-free relation | 否则能力与方法资产适用关系会通过复制 Method Content、TaskDefinition、AIPolicyDef 或方法正文版本来表达。 |
| 守住 formal exposure 与 controlled consumer view 的分层 | 否则 runtime、tools、SDK、产品入口、查询视图、导出结果或事件协作会反向定义正式能力边界。 |
| 支撑关键接入事实变化、追溯和下游感知 | 否则 identity、registry、descriptor、seam、relation、exposure 和 consumer impact 的变化只能依赖人工约定或实现细节。 |
| 隔离核心闭环与外围增强 | 否则管理入口、搜索、候选发现、安全摘要深化、SDK 说明、只读生态发现和审计导出会拖垮 C-CH-1~C-CH-5。 |
| 允许相邻仓通过 ref、safe summary、body-free relation、事件协作和消费边界协作 | 否则本仓要么吸收治理、方法、执行、SDK、观测和生态 truth,要么无法被下游稳定消费。 |

### 4.3 不可变约束:先思考

问题回答:

- 不可变约束要回答“哪些边界被打穿后,本仓就不再是 capability access truth owner”,而不是重复功能需求或列出实现偏好。
- `capability identity` 不能由 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代;否则后续 registry、descriptor、seam、relation 和 exposure 都失去锚点。
- `capability registry` 不能退化为 allowlist、runtime cache、availability bit 或 marketplace listing;否则目录会被执行态或生态展示污染。
- `adapter descriptor` 的边界必须比旧 Provider Contract 更窄:它表达接入方式、能力类型、风险与约束摘要,不拥有 secret、provider runtime、quota、route、cost、failover、retry 或 invocation truth。
- governance seam 与 method relation 必须以 ref / safe summary / body-free relation 表达,不能让 capability-hub 生成 approval / Policy truth 或保存 method body。
- formal exposure 是服务端正式边界;controlled consumer view / `CapabilityDecision` 类结果只能是快照,不是执行裁决、Policy cache 或 runtime allowed set truth。
- 依赖裁剪是硬约束,因为一旦把相邻仓写成编译期业务依赖,后续概要 / 详细设计会自然串仓。

诊断:

- 旧 `01` 的不可变约束实际是旧需求目标:未白名单必拒绝、A2A 必认证、key 必过 KMS、Policy 动态刷新、外部调用发成本事件。这些多数属于 runtime / security infra / governance / finance,不能作为新版架构红线。
- 旧 `01` 的“统一 Registry + Contract + Policy-aware query”会把 descriptor、Policy、query 和 runtime decision 绑成一条执行链,正好打穿新版 exposure / consumer view 分层。
- 若不可变约束不点名 forbidden body,后续搜索、导出、审计摘要、测试证据和观察材料可能以“只读”名义保存正文。

取舍:

- 不可变约束压缩为十二项,覆盖身份、注册目录、descriptor、governance、method、formal exposure、派生维护、数据正文、依赖、外围、变化追溯和旧口径隔离。
- 约束表使用正式规范要求的“约束 / 说明”两列,但说明中保留被保护或会被打穿的边界。
- 不写具体状态名、API 名、event 名、数据表、cache、outbox、KMS/Vault 或 provider adapter。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成不可变红线 | pass | 每条约束均为破坏后会触发架构失效或 VETO 的边界。 |
| 是否区分目标和约束 | pass | 正向结构结果保留在目标表,本节改写为负向边界。 |
| 是否避免实现机制 | pass | 未写技术选型、协议、状态、表或实现方案。 |
| 是否可进入“不可变约束:再写入” | pass | 可转成正式两列表。 |

### 4.4 不可变约束:再写入

| 约束 | 说明 |
|---|---|
| 不允许 capability identity 被 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代 | 否则外部能力主体无法作为 registry、descriptor、seam、relation 和 exposure 的共同锚点。 |
| 不允许 registry 退化为 allowlist、runtime cache、provider availability bit、marketplace listing 或单一可用性标记 | 否则注册目录会被执行态、缓存态或生态展示污染。 |
| 不允许 adapter descriptor 承载 provider runtime、secret、quota、route、cost、failover、retry 或 invocation truth | 否则接入描述会重新膨胀为旧 Provider Contract 或 provider 执行平台。 |
| 不允许 descriptor risk / constraint summary 替代 governance policy、approval truth 或执行拦截结论 | 否则接入风险解释会越权变成治理或 runtime enforcement。 |
| 不允许 capability-hub 生成、保存或缓存 governance approval、Policy effective fact、shared_rules truth 或白名单刷新 truth | 否则 `L1-governance` 的治理真相会被本仓接管。 |
| 不允许 capability-method relation 保存 method body、definition source truth、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本 | 否则 `L3-method-library` 的定义真相会被本仓复制。 |
| 不允许 runtime、tools、SDK、产品入口、查询视图、导出结果、事件协作或维护任务反写 identity、registry、descriptor、seam、relation 或 formal exposure truth | 否则消费面、派生面和维护面会成为隐式业务写源。 |
| 不允许 formal exposure 被 `CapabilityDecision` 类快照、runtime allow / deny decision、Policy cache、SDK client 或 tools config 替代 | 否则服务端正式能力边界会被消费侧实现细节定义。 |
| 不允许 forbidden body 因查询、搜索、导出、审计、对账、性能优化、测试证据或观测材料进入本仓 | 否则 secret、execution、provider runtime、cost、governance、method、SDK、marketplace、observability 或 production payload 正文会打穿数据归属。 |
| 不允许除 `L0-core` 外形成内部编译期业务依赖 | 否则 `L0-bus`、governance、runtime、tools、SDK、method-library、observability、marketplace 或外部 provider 会侵入本仓源码真相。 |
| 不允许外围增强改变核心闭环成立条件 | 否则管理入口、搜索、候选发现、安全摘要、SDK 说明、生态发现或审计导出会阻塞 C-CH-1~C-CH-5。 |
| 不允许关键 identity、registry、descriptor、governance seam、method relation、formal exposure 或 consumer impact 变化以隐式方式发生 | 否则追溯、幂等和下游变化感知无法成立。 |
| 不允许旧 `QueryCapabilities`、Policy 30s、未白名单拦截、明文 key grep、CostRecord 覆盖、SLA、KMS / Vault 或 Provider Contract 口径作为新版架构主线 | 否则 historical material 会绕过 full-restart 重新定义目标、边界和验收。 |

### 4.5 当前阶段取舍:先思考

问题回答:

- 当前阶段取舍只处理“与 capability-hub 潜在相关,但当前有意识不做深”的事项,不处理已经明确归属边界外的 runtime execution、governance approval、method body、SDK client、marketplace transaction 等。
- 取舍不能写成空泛 TODO,必须说明当前如何承接或暂存,并保护后续 Step 不把旧材料拿来填空。
- governance seam、method relation、descriptor 分类、secret safe summary、SDK exposure、observability / marketplace / console、formal exposure 延迟、API / DTO / state / boundary 都是已知未闭口项,当前不阻塞 Step 3,但后续对应 Step 必须闭口。
- 旧量化指标不是当前架构目标,但可作为后续测试 / 验收重新裁剪的候选线索。

诊断:

- 如果把 protocol 分类、A2A 认证、secret reference、SDK exposure 和 marketplace / observability 全部写成非目标,会丢失后续必须承接的边界。
- 如果把这些都写成目标或不可变约束,又会提前定义字段、协议、服务依赖和产品范围,导致 Step 2 越权。
- 正确处理是:核心闭环先成立,外围和未闭口项以最小承接、候选边界或后续闭口责任保留。

取舍:

- 取舍表聚焦九类:外部协议 / descriptor 分类、secret safe summary、governance seam 形态、method relation 摘要、SDK exposure 交接、外围入口 / 生态 / 观测、formal exposure 延迟、技术机制、后续 schema / boundary。
- 每项写当前口径和后续承接位置,但不写实现方案。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否属于潜在本仓范围 | pass | 取舍项均与 capability access truth、消费表达或外围增强相关。 |
| 是否不是边界外职责 | pass | runtime execution、approval、method body、SDK client 等放入非目标而非取舍。 |
| 是否写清当前口径 | pass | 每项都有最小承接、外围、候选或后移口径。 |
| 是否可进入“当前阶段取舍:再写入” | pass | 可转成结构化取舍表。 |

### 4.6 当前阶段取舍:再写入

| 取舍 | 当前口径 |
|---|---|
| 外部 MCP / A2A / API protocol 与 adapter descriptor 分类 | 当前只保留外部能力接入语义和 provider runtime 边界背景,不在 Step 2 固定协议对象、认证模型、DTO 或 adapter 类型。 |
| secret reference / safe summary 最小内容 | 当前只钉住 secret 正文和 KMS / Vault truth 不入仓,字段级 safe summary 与 secret ref 约束后移到数据所有权、横切安全、配置和详细设计。 |
| governance seam 最小承载形态 | 当前按 governance result ref、policy result ref 或允许 safe summary 的关系边界处理,不固定 approval ref / 状态引用 / scope summary 的具体形态。 |
| governance seam 变化感知量化 | 当前只要求延迟可解释且不得伪造 truth,不继承旧 Policy refresh 30s。 |
| capability-method relation 摘要强度 | 当前只保留 body-free relation、method asset ref 和允许摘要候选,不定义 method 适用性摘要字段或版本语义。 |
| SDK exposure 与 `L0-sdk` 交接 | 当前确认服务端 formal exposure boundary 归本仓,SDK client、language package、local candidate 和 developer experience 归 `L0-sdk`;交接细节后续按系统上下文、依赖和实施计划闭口。 |
| console / marketplace / observability / audit / finance / KMS 边界 | 当前作为外围增强、只读消费、safe summary / ref 或 forbidden body 风险处理,不进入核心闭环前置。 |
| formal exposure / controlled consumer view 的读取延迟目标 | 当前只保留“不成为不可解释瓶颈且不被外围增强阻塞”的结构性要求,具体阈值后移测试 / 验收。 |
| PostgreSQL、cache、outbox、provider adapter、KMS/Vault、deployment 等技术机制 | 当前只作为 historical material 或后续技术选型候选,不得在 Step 2 定为架构方案。 |
| API / Command / Query / Event、DTO、状态机、存储、配置、测试证据和 implementation boundary | 当前按能力级接口和需求层验收暂存,必须在后续正式 `01~07` 文档逐步闭口,不得由实现端自行补。 |

### 4.7 架构非目标:先思考

问题回答:

- 架构非目标用于明确本篇架构设计不展开什么范围,不是把本仓潜在能力简单后延。
- runtime/tools execution、provider runtime、governance approval、method body、SDK client、marketplace transaction、observability store、cost / billing、secret/KMS 平台、LLM routing 都已经在需求中明确为边界外,必须进入非目标。
- “具体 API / DTO / event / state / database / boundary”不是永久非目标,而是 Step 2 不展开;因此更适合放在取舍和回填说明中,不作为架构范围排除项。
- 可观测性和审计不是非目标,但 observability store / audit log store / metric / trace 正文是非目标;本仓仍需支撑接入事实可观察、可追溯和可导出摘要边界。

诊断:

- 若非目标写得过宽,会把 governance seam、method relation、SDK exposure boundary 和 observability safe summary 都排除掉,导致后续职责边界无处承接。
- 若非目标写得过窄,旧 `Provider Contract / Cost / KMS / QueryCapabilities / SLA` 会在后续 Step 以“相关能力”身份回流。

取舍:

- 非目标聚焦十二项明确边界外架构范围。
- 不重复取舍表中的“当前不做深”项,而是写归属明确的排除项。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写成范围排除 | pass | 非目标均为不属于当前架构主线的范围。 |
| 是否说明边界归因 | pass | 每项均说明归属相邻仓、外部系统或后续文档。 |
| 是否避免和取舍混淆 | pass | 未把 governance seam、descriptor 分类、SDK exposure boundary 等潜在本仓事项排除。 |
| 是否可进入“架构非目标:再写入” | pass | 可转成正式非目标表。 |

### 4.8 架构非目标:再写入

| 非目标 | 不展开原因 |
|---|---|
| 不设计 runtime execution、tools execution、allow / deny enforcement 或外部调用执行链 | 这些属于 `L2-runtime` / `L2-tools` 执行边界,本仓只拥有 capability access truth。 |
| 不设计 provider runtime、provider failover、retry、routing、quota 或 invocation result | 这些属于 provider adapter / runtime orchestration 边界,不属于接入事实真相。 |
| 不设计 secret/KMS/Vault 平台、API key 托管产品或密钥生命周期 | 这些属于安全基础设施或外部 secret 管理边界,本仓最多保留 secret ref / safe summary。 |
| 不设计 cost accounting、billing、finance ledger、provider raw billing 或成本记账覆盖 | 这些属于 finance、observability 或外部 provider 对账边界,不属于能力接入 truth。 |
| 不设计 governance approval execution、Policy effective fact、shared_rules truth 或治理缓存 | 这些属于 `L1-governance`,本仓只承接 governance result ref / allowed safe summary。 |
| 不设计 method asset body、definition source truth、method version body 或方法资产发布语义 | 这些属于 `L3-method-library`,本仓只表达 body-free relation。 |
| 不设计 SDK client、Rust / Python / TypeScript package、language binding、local candidate 或 developer experience | 这些属于 `L0-sdk`,本仓只提供服务端 formal exposure boundary。 |
| 不设计 marketplace listing、transaction、purchase、pricing、commercial fulfillment 或生态运营 truth | 这些属于 `L6-marketplace` 或生态入口,本仓最多提供只读发现 ref / summary。 |
| 不设计 observability log store、metrics、trace storage、alert stream 或 audit store | 这些属于 `L4-observability`,本仓只保留业务追溯事实、ref 或 safe summary 边界。 |
| 不设计 LLM routing、model selection、prompt routing 或 provider orchestration | 这些属于 future / runtime / provider orchestration 边界,不属于当前能力接入架构主线。 |
| 不设计外部 MCP / A2A / API 标准本体或 provider 产品本体 | 本仓引用外部能力来源和标准语境,不拥有外部协议、标准或产品正文真相。 |
| 不设计 UI 页面、console 管理状态、聊天显化或产品工作流 | 管理入口和目录浏览可作为外围增强消费本仓事实,但 UI 状态和产品流程不归本仓。 |

---

## 5. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| README “能力池 / MCP Server 注册表 / A2A Node Directory” | 外部 MCP / A2A 能力接入对象来源和能力池语境。 | Runtime 调外部 Tool 必经 hub、未白名单调用由本仓直接拦截。 | 重裁为 capability identity、registry、adapter descriptor 和 formal exposure 边界;execution 留给 runtime / tools。 |
| README “Provider Contract” | 外部 API / provider API surface 可作为 adapter descriptor 来源线索。 | API key、quota、route、cost、failover、provider runtime、LLM routing。 | 重裁为 adapter descriptor + risk / constraint summary;secret ref 只作引用 / safe summary 候选。 |
| README “Policy 消费 / 白名单刷新” | governance seam 是核心关系边界。 | Policy 下发、白名单刷新、Policy cache 和本仓 approval / Policy truth。 | 重裁为 governance result ref / allowed safe summary;Policy truth 归 `L1-governance`。 |
| README “Cost Accounting / cost 事件” | 可作为 finance / observability historical risk。 | CostRecord、成本覆盖率、billing / finance ledger truth、每次外部调用记账。 | 边界外 / forbidden body,不进入核心架构。 |
| 旧 `01` §1 “统一、受控、可审计能力入口” | “受控”和“可审计”可保留为 access truth 可解释性。 | “AI 成员不应直接触碰外部能力”“所有外部能力通过 hub 暴露给 runtime/tools”。 | 重裁为服务端 formal exposure 和下游按边界消费,不写执行必经网关。 |
| 旧 `01` §1.3 成功标准 | 指标维度可作为候选测试线索。 | 未白名单拦截 100%、QueryCapabilities P95、Policy 30s、cost record 覆盖、明文 key grep 作为架构目标。 | 后续测试 / 验收必须基于新版能力面重新定义,Step 2 不继承。 |
| 旧 `01` §2 不可变约束 | 安全、治理和外部接入风险可作背景。 | 未白名单 MCP 必拒、A2A 必认证、Provider key 必过 KMS、Policy 动态刷新、外部调用成本事件。 | 改写为 identity / registry / descriptor / seam / relation / exposure / forbidden body / dependency 红线。 |
| 旧 `01` §3 “统一 Registry + Contract + Policy-aware query” | Registry 与受控消费表达可作为术语线索。 | Contract + Policy-aware query 作为架构风格,Cost / Access Decision 作为核心子域。 | 后续 Step 5 不能按旧四子域切分,必须从 C-CH-1~C-CH-5 推导。 |
| 旧 `01` §4 KMS/Vault、provider、marketplace、SLA | 可提示外部协作和风险来源。 | KMS/Vault 核心容器、provider failover、marketplace metadata publish、外部依赖 SLA。 | 后续只作为 ref / safe summary / 外围增强 / historical risk 重新论证。 |
| 旧 `01` PostgreSQL、cache、outbox、cost worker、deployment、rollback | 可作为后续技术选型历史线索。 | 在 Step 2 直接定为架构方案或硬前提。 | 后续 Step 6 / 10 / 12 重新论证,不得继承。 |

---

## 6. 结构化中间产物

### 6.1 架构目标结论

| 目标编号 | 架构目标 | 来源 | 后续承接 |
|---|---|---|---|
| AG-CH-001 | 承载独立的 capability access truth。 | ARB-CH-002;RB-CH-001;C-CH-1~5 | Step 3~5 职责、上下文和架构单元划分。 |
| AG-CH-002 | 支撑稳定 identity 与受控 registry 连续成立。 | C-CH-1;C-CH-2;BR-CH-001~003 | Step 3~8 职责、上下文、数据所有权和一致性。 |
| AG-CH-003 | 支撑 adapter descriptor 作为可解释接入描述成立。 | C-CH-3;BR-CH-004~005;FR-CH-007~009 | Step 5、Step 8、Step 9、Step 10。 |
| AG-CH-004 | 支撑 governance seam 与接入审查职责分离。 | C-CH-4;BR-CH-006;BR-CH-019;BR-CH-034~035 | Step 3~5、Step 8、Step 9、Step 12。 |
| AG-CH-005 | 支撑 capability-method body-free relation。 | C-CH-4;BR-CH-007;BR-CH-015;BR-CH-029 | Step 3~5、Step 8、Step 9。 |
| AG-CH-006 | 守住 formal exposure 与 controlled consumer view 分层。 | C-CH-5;BR-CH-008;BR-CH-016;BR-CH-025;BR-CH-030 | Step 4~5、Step 8、Step 9、Step 13。 |
| AG-CH-007 | 支撑关键接入事实变化、追溯和下游感知。 | BR-CH-020~026;BR-CH-036~037;NFR-CH-011~017 | Step 8、Step 9、Step 12、Step 15。 |
| AG-CH-008 | 隔离核心闭环与外围增强。 | FR-CH-E01~E07;BR-CH-E001;AC-CH-022;AC-CH-028 | Step 5、Step 12、Step 13、Step 14。 |
| AG-CH-009 | 允许相邻仓通过 ref、safe summary、body-free relation、事件协作和消费边界协作。 | ARB-CH-005~006;AHC-CH-008;VF-CH-012 | Step 4、Step 7、Step 8、Step 9。 |

### 6.2 不可变约束结论

| 约束编号 | 不可变约束 | 来源 | 触发失败时的后果 |
|---|---|---|---|
| ACN-CH-001 | identity 不得被 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代。 | BR-CH-001;VF-CH-002 | capability access truth 失去主体锚点。 |
| ACN-CH-002 | registry 不得退化为 allowlist、runtime cache、availability bit 或 marketplace listing。 | BR-CH-002~003;VF-CH-003 | 注册目录被执行态或生态展示污染。 |
| ACN-CH-003 | adapter descriptor 不得承载 provider runtime、secret、quota、route、cost、failover、retry 或 invocation truth。 | BR-CH-004;BR-CH-013;VF-CH-004 | descriptor 被旧 Provider Contract / secret / cost 打穿。 |
| ACN-CH-004 | descriptor risk / constraint summary 不得替代 governance policy、approval truth 或执行拦截结论。 | BR-CH-005;NFR-CH-008~010 | 风险摘要越权成治理或 runtime enforcement。 |
| ACN-CH-005 | capability-hub 不生成、保存或缓存 governance approval、Policy effective fact、shared_rules truth 或白名单刷新 truth。 | BR-CH-006;BR-CH-014;BR-CH-028;VF-CH-005 | `L1-governance` truth 被接管。 |
| ACN-CH-006 | capability-method relation 必须 body-free。 | BR-CH-007;BR-CH-015;BR-CH-029;VF-CH-006 | `L3-method-library` 正文 / 定义 truth 被复制。 |
| ACN-CH-007 | 消费面、派生面、事件协作和维护任务不得反写真相。 | BR-CH-008~012;BR-CH-025~026;VF-CH-007 | formal exposure 和核心 access truth 被隐式改写。 |
| ACN-CH-008 | formal exposure 是服务端 truth,controlled consumer view / `CapabilityDecision` 类结果只能是派生快照。 | BR-CH-008;BR-CH-016;NFR-CH-017;VF-CH-007~008 | 旧 QueryCapabilities / runtime decision 回流。 |
| ACN-CH-009 | forbidden body 不得以任何旁路进入本仓。 | 数据归属;NFR-CH-007;VF-CH-011 | 数据所有权和安全边界失效。 |
| ACN-CH-010 | 除 `L0-core` 外不得形成内部编译期业务依赖。 | 全局依赖规则;VF-CH-012 | 跨仓依赖裁剪失效。 |
| ACN-CH-011 | 外围增强不得改变核心闭环成立条件。 | BR-CH-E001;AC-CH-022;AC-CH-028 | 核心 access truth 被 UI / 搜索 / 生态 / 审计增强阻塞。 |
| ACN-CH-012 | 关键接入事实变化必须显式发生且可追溯。 | BR-CH-020~026;BR-CH-036~037;VF-CH-009~010 | 追溯、幂等和下游感知失效。 |
| ACN-CH-013 | 旧 Provider Contract / Cost / KMS / QueryCapabilities / SLA 口径不得作为新版架构主线。 | VF-CH-013;ARR-CH-010 | historical material 冲突回流。 |

### 6.3 当前阶段可接受取舍结论

| 取舍编号 | 取舍 | 当前口径 | 后续承接 |
|---|---|---|---|
| AT-CH-001 | 外部协议和 descriptor 分类不在 Step 2 锁死。 | 保留外部 MCP / A2A / API 接入语义和 provider runtime 边界背景。 | Step 5 / 8 / 9 / 10 / 12。 |
| AT-CH-002 | secret ref / safe summary 字段级边界后移。 | 只钉住 secret 正文和 KMS / Vault truth 不入仓。 | Step 8 / 10 / 12 / 后续 `04~05`。 |
| AT-CH-003 | governance seam 具体形态后移。 | 当前按 result ref / policy result ref / allowed safe summary 边界处理。 | Step 3 / 5 / 8 / 9 / 14 / 15。 |
| AT-CH-004 | method relation 摘要强度后移。 | 当前只保留 body-free relation、method asset ref 和允许摘要候选。 | Step 3 / 5 / 8 / 9 / 14 / 15。 |
| AT-CH-005 | SDK exposure 交接细节后移。 | 服务端 formal exposure 归本仓,SDK client / package / developer experience 归 `L0-sdk`。 | Step 4 / 7 / 9 / 13 / 后续 `07`。 |
| AT-CH-006 | console / marketplace / observability / audit / finance / KMS 外围边界后移。 | 当前作为外围增强、只读消费、safe summary / ref 或 forbidden body 风险。 | Step 4 / 5 / 7 / 8 / 9 / 12 / 13 / 14。 |
| AT-CH-007 | formal exposure / controlled consumer view 延迟目标后移。 | 当前只要求不成为不可解释瓶颈且不被外围增强阻塞。 | Step 12 / 14 / 后续 `05~06`。 |
| AT-CH-008 | 技术机制后移。 | PostgreSQL、cache、outbox、provider adapter、KMS/Vault、deployment 等只作候选或 historical material。 | Step 6 / 10 / 12。 |
| AT-CH-009 | API / DTO / event / state / storage / config / evidence / implementation boundary 后移。 | 当前按能力级接口和需求验收暂存,后续正式文档必须闭口。 | Step 9 / 10 / 12 / 14 / 15;后续 `02~07`。 |

### 6.4 架构非目标结论

| 非目标编号 | 非目标 | 边界归因 |
|---|---|---|
| ANG-CH-001 | 不设计 runtime execution、tools execution、allow / deny enforcement 或外部调用执行链。 | `L2-runtime` / `L2-tools`。 |
| ANG-CH-002 | 不设计 provider runtime、failover、retry、routing、quota 或 invocation result。 | provider adapter / runtime orchestration。 |
| ANG-CH-003 | 不设计 secret/KMS/Vault 平台、API key 托管产品或密钥生命周期。 | 安全基础设施 / secret 管理。 |
| ANG-CH-004 | 不设计 cost accounting、billing、finance ledger、provider raw billing 或成本记账覆盖。 | finance / observability / provider 对账。 |
| ANG-CH-005 | 不设计 governance approval execution、Policy effective fact、shared_rules truth 或治理缓存。 | `L1-governance`。 |
| ANG-CH-006 | 不设计 method asset body、definition source truth、method version body 或方法资产发布语义。 | `L3-method-library`。 |
| ANG-CH-007 | 不设计 SDK client、多语言 package、language binding、local candidate 或 developer experience。 | `L0-sdk`。 |
| ANG-CH-008 | 不设计 marketplace listing、transaction、pricing、commercial fulfillment 或生态运营 truth。 | `L6-marketplace` / 生态入口。 |
| ANG-CH-009 | 不设计 observability log store、metrics、trace storage、alert stream 或 audit store。 | `L4-observability`。 |
| ANG-CH-010 | 不设计 LLM routing、model selection、prompt routing 或 provider orchestration。 | future / runtime / provider orchestration。 |
| ANG-CH-011 | 不设计外部 MCP / A2A / API 标准本体或 provider 产品本体。 | 外部系统 / 外部标准。 |
| ANG-CH-012 | 不设计 UI 页面、console 管理状态、聊天显化或产品工作流。 | 产品入口 / console / conversation。 |

---

## 7. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §6 的结构化结论,不重复写入 SOP 问题回答和旧材料诊断。

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`

`L3-capability-hub` 需要单独做架构设计,因为外部 MCP / A2A / API 能力会被 governance、method-library、runtime、tools、SDK、产品入口、observability 和生态入口长期引用。如果这些能力只散落在 URL、provider 名、tool config、runtime cache、SDK wrapper、marketplace listing 或手工白名单中,平台就无法围绕同一个 capability access truth 讨论外部能力主体、接入方式、治理结果、方法关系、正式暴露边界和下游变化感知。

核心驱动力:

| 驱动力 | 说明 |
|---|---|
| 外部能力接入事实需要独立承载 | 否则 runtime、tools、SDK、provider 配置和 marketplace 展示会各自补造 capability truth。 |
| 稳定身份和注册目录需要在执行前成立 | 否则外部能力只能以临时 URL、provider 名或运行配置存在。 |
| 接入描述需要与 provider runtime / secret / cost 分离 | 否则 adapter descriptor 会退化为旧 Provider Contract。 |
| 治理结果与方法资产关系需要有接缝但不能串仓 | 否则本仓会越权生成治理 truth 或复制 method body。 |
| 服务端正式暴露边界需要被下游稳定消费 | 否则 consumer view、runtime cache 或 SDK client 会反向定义正式能力边界。 |
| 派生、维护和外围增强必须服从核心 truth | 否则搜索、导出、对账、候选发现和审计摘要会成为隐式写源。 |

| 架构目标 | 说明 |
|---|---|
| 承载独立的 capability access truth | 否则本仓会退化为执行网关、白名单缓存、provider 配置表、SDK wrapper 或 marketplace metadata。 |
| 支撑外部能力以稳定身份进入受控注册目录 | 否则 registry、descriptor、governance seam、method relation 和 exposure 会围绕临时配置补 truth。 |
| 支撑 adapter descriptor 作为可解释接入描述成立 | 否则下游只能通过 provider runtime、secret、quota、route、cost 或协议细节理解能力边界。 |
| 支撑 governance seam 与接入审查职责分离 | 否则正式可见 / 可用语境会被本地目录状态、白名单刷新或接入审查意见替代治理结论。 |
| 支撑 capability-method body-free relation | 否则能力与方法资产适用关系会通过复制方法正文来表达。 |
| 守住 formal exposure 与 controlled consumer view 的分层 | 否则 runtime、tools、SDK、查询视图、导出结果或事件协作会反向定义正式能力边界。 |
| 支撑关键接入事实变化、追溯和下游感知 | 否则变化只能依赖人工约定或实现细节。 |
| 隔离核心闭环与外围增强 | 否则管理入口、搜索、候选发现、SDK 说明、生态发现和审计导出会拖垮 C-CH-1~C-CH-5。 |
| 允许相邻仓通过 ref、safe summary、body-free relation、事件协作和消费边界协作 | 否则本仓要么吸收相邻仓 truth,要么无法被下游稳定消费。 |
```

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`

### 3.1 不可变约束

| 约束 | 说明 |
|---|---|
| 不允许 capability identity 被 URL、provider 名、tool config、runtime config、SDK client、marketplace listing 或派生视图替代 | 否则外部能力主体无法作为 registry、descriptor、seam、relation 和 exposure 的共同锚点。 |
| 不允许 registry 退化为 allowlist、runtime cache、provider availability bit、marketplace listing 或单一可用性标记 | 否则注册目录会被执行态、缓存态或生态展示污染。 |
| 不允许 adapter descriptor 承载 provider runtime、secret、quota、route、cost、failover、retry 或 invocation truth | 否则接入描述会重新膨胀为旧 Provider Contract 或 provider 执行平台。 |
| 不允许 descriptor risk / constraint summary 替代 governance policy、approval truth 或执行拦截结论 | 否则接入风险解释会越权变成治理或 runtime enforcement。 |
| 不允许 capability-hub 生成、保存或缓存 governance approval、Policy effective fact、shared_rules truth 或白名单刷新 truth | 否则 `L1-governance` 的治理真相会被本仓接管。 |
| 不允许 capability-method relation 保存 method body、definition source truth、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或方法正文版本 | 否则 `L3-method-library` 的定义真相会被本仓复制。 |
| 不允许 runtime、tools、SDK、产品入口、查询视图、导出结果、事件协作或维护任务反写 identity、registry、descriptor、seam、relation 或 formal exposure truth | 否则消费面、派生面和维护面会成为隐式业务写源。 |
| 不允许 formal exposure 被 `CapabilityDecision` 类快照、runtime allow / deny decision、Policy cache、SDK client 或 tools config 替代 | 否则服务端正式能力边界会被消费侧实现细节定义。 |
| 不允许 forbidden body 因查询、搜索、导出、审计、对账、性能优化、测试证据或观测材料进入本仓 | 否则 secret、execution、provider runtime、cost、governance、method、SDK、marketplace、observability 或 production payload 正文会打穿数据归属。 |
| 不允许除 `L0-core` 外形成内部编译期业务依赖 | 否则相邻仓或外部 provider 会侵入本仓源码真相。 |
| 不允许外围增强改变核心闭环成立条件 | 否则管理入口、搜索、候选发现、安全摘要、SDK 说明、生态发现或审计导出会阻塞 C-CH-1~C-CH-5。 |
| 不允许关键 identity、registry、descriptor、governance seam、method relation、formal exposure 或 consumer impact 变化以隐式方式发生 | 否则追溯、幂等和下游变化感知无法成立。 |
| 不允许旧 `QueryCapabilities`、Policy 30s、未白名单拦截、明文 key grep、CostRecord 覆盖、SLA、KMS / Vault 或 Provider Contract 口径作为新版架构主线 | 否则 historical material 会绕过 full-restart 重新定义目标、边界和验收。 |

### 3.2 当前阶段可接受取舍

本章应摘录 `design-calibration/01_arch_step_02_goals_constraints.md` §6.3,将 descriptor 分类、secret safe summary、governance seam 形态、method relation 摘要、SDK exposure 交接、外围边界、formal exposure 延迟目标、技术机制以及 API / DTO / state / boundary 闭口责任写成当前阶段取舍。

### 3.3 架构非目标

本章应摘录 `design-calibration/01_arch_step_02_goals_constraints.md` §6.4,明确 runtime execution、provider runtime、secret/KMS、cost/billing、governance approval、method body、SDK client、marketplace transaction、observability store、LLM routing、外部标准本体和 UI / console 状态均不属于当前架构主线。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | governance seam 的最小承载形态是 approval ref、policy result ref、scope summary、状态引用还是组合关系。 | 挂起到 Step 3 / 5 / 8 / 9;当前只按 ref / safe summary 关系边界处理。 |
| Q-002 | capability-method relation 是否需要能力类型 / method asset 适用性摘要,以及摘要强度如何限定。 | 挂起到 Step 5 / 8 / 9;当前只保留 body-free relation。 |
| Q-003 | adapter descriptor 是否需要细分普通外部 API、LLM provider API、MCP、A2A 与 provider runtime 边界。 | 挂起到 Step 5 / 8 / 9 / 10 / 12;当前不固定协议对象或 DTO。 |
| Q-004 | secret reference / safe summary 的字段级最小内容。 | 挂起到 Step 8 / 12 / `04-配置设计.md`;当前只排除 secret 正文和 KMS / Vault truth。 |
| Q-005 | SDK exposure 与 `L0-sdk` client / package / developer experience 的交接形式。 | 挂起到 Step 4 / 7 / 9 / 13 / `07-实施计划.md`;当前只确认服务端 formal exposure 归本仓。 |
| Q-006 | marketplace / console / observability / finance / KMS 是否需要正式只读 ref 或 safe summary 边界。 | 挂起到 Step 4 / 5 / 8 / 12 / 14;当前按外围增强、ref、summary 或 forbidden body 处理。 |
| Q-007 | formal exposure / controlled consumer view 是否需要读取延迟目标。 | 挂起到 Step 12 / `05-测试方案.md` / `06-验收标准.md`;当前不继承旧 P95。 |
| Q-008 | API / DTO / event / state / storage / config / evidence / implementation boundary 如何定义。 | 挂起到后续正式 `01~07`;当前不允许实现端自行补。 |

---

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 已明确架构必须确保什么成立 | pass | 已形成 AG-CH-001~009。 |
| 已明确哪些边界不可变 | pass | 已形成 ACN-CH-001~013。 |
| 已明确当前阶段可接受收缩 | pass | 已形成 AT-CH-001~009。 |
| 已明确架构非目标 | pass | 已形成 ANG-CH-001~012。 |
| 已完成旧材料差异审计 | pass | 旧 README 和旧 `01` 的可保留线索 / 废弃口径已记录。 |
| 未提前生成未来 Step 文件 | pass | 当前只创建 Step 2 文件,未创建 Step 3。 |
| 未修改正式 `01-架构设计.md` | pass | 正式 `01` 仍待 Step 16 装配。 |
| 未发现阻塞 Step 3 的上游 blocker | pass | ARR-CH-001~010 均可带约束进入职责边界讨论。 |

结论:Step 2 已完成,可以在用户确认后进入 Step 3 `职责边界`。

当前不需要提交 commit。
