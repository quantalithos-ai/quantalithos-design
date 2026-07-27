# 00 Step 9 · 功能需求

> 所属文档: `00-需求文档.md`
> Step: Step 9
> 目标章节: 正式文档 §9 `功能需求`
> 当前状态: completed_stop_review
> 当前约束: 本步把 Step 8 用户故事归并为系统必须提供的业务能力;不得写 CRUD、API、Command、事件名、DTO、字段、状态机、数据库表、模块拆分、handler、repository、事务流程、NFR、验收或实施计划。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 9 |
| status | completed_stop_review |
| gate_status | pass_for_step_09_only |
| previous_step | Step 8 `用户故事` |
| next_allowed_action | wait_user_review_to_step_10 |
| formal_section | `00-需求文档.md` §9 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_09 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 7 / Step 8 | done | 确认用户已同意进入 Step 9,且不得跳到 Step 10 或正式文档装配。 |
| 2 | 读取需求 SOP Step 9 和书写规范 4.9 | done | 确认功能需求必须写成能力主题,固定输出功能需求表、能力类型、闭环映射、故事映射和停审结论。 |
| 3 | 读取 Step 1~6 上游边界输入 | done | 确认功能归并必须守住 capability access truth、依赖裁剪和非目标边界。 |
| 4 | 读取参考项目 Step 9 粒度 | done | 参考 `L1-governance`、`L1-artifact`、`L3-method-library` 的按能力归并方式,不复制领域功能。 |
| 5 | 读取目标旧 `00` 功能清单和功能依赖图 | done | 识别旧功能污染: MCP Registry、A2A Directory、Provider Contract、QueryCapabilities、Cost Accounting、Policy refresh、Audit event、Secret envelope、Marketplace metadata、LLM routing 混写。 |
| 6 | 按 C-CH-1~C-CH-5 回答 SOP 问题 | done | 形成能力级输入、输出、触发条件、失败情况和功能归并结论。 |
| 7 | 诊断旧功能清单和当前边界冲突 | done | 将旧 F-001~F-010 映射为保留、重命名、后置或排除。 |
| 8 | 做设计取舍 | done | 采用“核心能力节点 -> 业务能力主题 -> 双重映射”方式,不采用旧功能清单或对象 / 接口拆分。 |
| 9 | 形成结构化功能需求表、外围增强功能、边界外功能排除和回填草稿 | done | 为正式 §9 提供可回填候选,但不写入正式文档。 |
| 10 | 做能力级功能停审、跨能力功能审计和 blocker 判定 | done | 无阻塞 Step 9 的上游 blocker;等待用户确认是否进入 Step 10。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 9 的影响 |
|---|---|---|
| Step 2 | 本仓是外部 MCP / A2A / API 能力身份、注册目录和接入描述语义的能力接入真相仓;不是执行、secret、成本、marketplace、治理审批或 SDK client 仓。 | 功能需求只能围绕能力接入 truth 和接缝表达,不能把执行、密钥、成本、交易或客户端实现写成功能。 |
| Step 4 | 目标包含能力接入 truth、identity / registry、adapter descriptor、governance seam、method relation、SDK exposure 和旧材料后置审计边界。 | 功能需求必须覆盖这些目标,并继续排除 runtime/tools execution、provider runtime、method body、governance approval truth、SDK client、secret/KMS、cost/billing、marketplace、LLM routing。 |
| Step 5 | 角色包括能力接入管理员、提议者 / 技术负责人、安全 / 接入审查者、审计 / 合规查看者、能力目录浏览者、系统消费方、能力接入维护任务。 | 功能需求要承接这些角色目标,但不能重复角色表或写权限矩阵。 |
| Step 6 | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作;外部 MCP/A2A/API 是运行期外部系统依赖;governance 是结果接缝;runtime/tools/SDK 是消费边界;method-library 只保留 body-free relation。 | 功能需求可表达能力变化协作、治理结果引用和系统消费,但不得写 package dependency、接口、事件 payload 或相邻仓 truth。 |
| Step 7 | 核心能力节点为 C-CH-1 稳定身份、C-CH-2 受控注册目录、C-CH-3 可解释接入描述、C-CH-4 治理结果与方法资产关系接缝、C-CH-5 受控消费表达与变化感知。 | Step 9 必须以这五个节点作为功能归并主轴。 |
| Step 8 | 核心故事为 `US-CH-001`~`US-CH-017`,外围增强为 `US-CH-E01`~`US-CH-E07`,边界外故事已排除。 | 每项核心功能必须回指至少一个核心故事;外围增强功能单独标记;边界外功能不进正式功能表。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 9 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 9 | 把用户故事归并为系统必须提供的业务能力;按能力节点组织;输出功能需求编号、说明、依赖 / 映射和能力级功能停审。 | 不得先生成全仓功能清单再贴标签;不得按对象、CRUD、API、Command 或内部函数拆分。 |
| `需求文档书写规范.md` 4.9 | 功能需求表固定列为“功能需求 / 能力类型 / 说明 / 支撑的核心能力闭环 / 对应的用户故事”。 | 每项功能需求必须有编号、能力类型、说明、核心能力映射和用户故事映射。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 本文件必须可作为 Step 10 规则、Step 11 数据、Step 12 接口和 Step 16 追溯矩阵输入。 |

### 3.3 目标旧功能输入

| 旧功能 | 可保留能力线索 | 不可继承口径 |
|---|---|---|
| F-001 `MCP Registry` | MCP 类外部能力需要身份、注册目录和接入描述。 | “白名单”“server 注册 + allowlist”“core/bus 依赖”不能作为功能名或执行语义。 |
| F-002 `A2A Directory` | A2A 类外部能力需要身份、可信接入和目录语义。 | “node 注册 + 身份校验”不能扩张为认证系统或对象 CRUD。 |
| F-003 `Provider Contract` | 外部 API/provider 能力需要接入描述。 | API key、quota、route、cost、KMS/Vault、provider runtime 都不得写成本仓功能。 |
| F-004 `QueryCapabilities` | 下游需要消费正式能力接入事实。 | 查询接口名、P95、runtime 高频路径不进入 Step 9;后续 Step 12 / 13 审计。 |
| F-005 `Cost Accounting` | 旧材料表达外部能力使用可审计诉求。 | cost/billing/finance ledger 是非目标,不得进入正式功能需求表。 |
| F-006 `Policy 消费与白名单刷新` | 能力接入事实需要承接治理结果变化。 | Policy truth、approval execution、30s refresh、白名单执行不归本仓功能。 |
| F-007 `审计事件发出` | 能力接入事实变化和安全摘要可能需要可追溯 / 可消费输出。 | observability store、调用成功 / 失败事件、严重审计事件属于接口 / 观测 / 验收后置。 |
| F-008 `Secret envelope encryption` | adapter descriptor 可能需要 secret reference / 禁止保存正文的安全约束。 | secret/KMS/Vault 平台、API key 加密托管不归本仓功能。 |
| F-009 `capability marketplace metadata` | 只读生态发现可作为外围增强。 | marketplace listing、Role 镜像注册、交易 / 定价 / 履约不归本仓。 |
| F-010 `LLM routing` | 无当前核心能力线索。 | LLM routing / model selection / provider orchestration 是非目标或 future。 |

---

## 4. SOP 问题回答

### 4.1 当前正在讨论哪个核心能力节点?

本步按以下顺序讨论并停审功能需求:

1. C-CH-1 外部能力能够以稳定身份进入接入语境。
2. C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义。
3. C-CH-3 已注册能力能够拥有可解释的接入描述。
4. C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界。
5. C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化。

该顺序是需求能力归并顺序,不是实现阶段、接口调用顺序、事件传播顺序或数据模型顺序。

### 4.2 根据这些用户故事,系统必须提供哪些业务能力?

| 核心能力节点 | 用户故事 | 必须归并出的业务能力 |
|---|---|---|
| C-CH-1 稳定身份 | US-CH-001;US-CH-002;US-CH-003 | 外部能力接入语境建立;能力身份稳定识别;接入身份风险解释。 |
| C-CH-2 受控注册目录 | US-CH-004;US-CH-005;US-CH-006 | 能力注册目录管理;目录可见性与生命周期语义;目录维护与一致性保护。 |
| C-CH-3 可解释接入描述 | US-CH-007;US-CH-008;US-CH-009 | adapter descriptor 表达;接入风险与约束摘要;描述边界消费支撑。 |
| C-CH-4 治理 / 方法关系接缝 | US-CH-010;US-CH-011;US-CH-012;US-CH-013 | 治理结果接缝承接;接入审查与治理职责区分;method asset body-free relation;接入事实追溯。 |
| C-CH-5 受控消费表达 | US-CH-009;US-CH-013;US-CH-014;US-CH-015;US-CH-016;US-CH-017 | 受控消费表达;正式可见性表达;能力变化协作与感知;服务端 exposure boundary 保护。 |

### 4.3 每个能力的输入、输出、触发条件、失败情况是什么?

本表只记录能力级输入、输出、触发和失败,不定义字段、DTO、接口、事件 schema、状态枚举、事务处理或 adapter 设计。

| 功能能力 | 能力级输入 | 能力级输出 | 触发条件 | 失败情况 |
|---|---|---|---|---|
| 外部能力接入语境建立 | 外部能力来源线索、能力类型语境、提议者 / 管理者语境、接入目的 | 可被后续身份、注册和描述承接的接入语境 | 新外部 MCP / A2A / API 能力需要进入平台讨论或准备接入 | 来源主体不可解释;接入目的不清;输入试图以 URL、provider 名或运行配置直接替代能力身份 |
| 能力身份稳定识别 | 接入语境、外部能力类别、识别线索、管理语境 | 可长期引用的 capability identity 语义 | 管理员需要确认外部能力是否已经有稳定身份或需要建立身份 | 身份与 ToolDefinition、method asset、provider runtime、marketplace listing 或 SDK client 混淆 |
| 接入身份风险解释 | 能力身份语境、外部连接主体、安全 / 审查语境 | 身份层面的风险解释和审查输入语境 | 能力身份进入正式接入语境前需要被审查 | 风险主体不可解释;审查意见被误写成 governance approval 或 runtime 拦截结论 |
| 能力注册目录管理 | 稳定能力身份、管理语境、注册目录语境 | 受控能力目录中的正式接入事实 | 已识别能力需要从提议语境进入注册目录 | 身份未稳定;目录被当作白名单缓存、运行状态表或 marketplace listing |
| 目录可见性与生命周期语义 | 注册目录事实、可见性语境、目录浏览 / 管理语境 | 能被理解的目录可见性、可用性和生命周期语义 | 管理者或浏览者需要理解能力当前处于何种接入语境 | 可见性由 runtime 状态、交易状态或治理 truth 反向决定 |
| 目录维护与一致性保护 | 注册目录事实、维护任务语境、派生 / 对账需求 | 不改变业务结论的目录维护、对账和一致性结果 | 目录派生、索引、对账或重建需要保持与接入 truth 一致 | 维护任务创造新的业务接入结论;对账依据不清;派生结果反向成为 truth |
| adapter descriptor 表达 | 已注册能力、外部协议 / 接入方式线索、能力类型和约束语境 | 可解释的接入描述语义 | 已注册能力需要被审查、理解或下游消费 | 描述退化为 Provider Contract、API key 容器、quota / cost / failover 或 provider runtime |
| 接入风险与约束摘要 | 接入描述、外部连接边界、安全 / 审查语境 | 可供审查和消费理解的约束摘要 | 接入描述涉及外部连接、安全、敏感材料或约束边界 | secret 正文被保存;KMS/Vault 被写成本仓平台;约束摘要替代 governance policy |
| 描述边界消费支撑 | 接入描述、系统消费语境、正式接入语境 | 下游可按边界理解外部能力接入方式的能力说明 | 系统消费方需要围绕同一描述消费能力 | 下游自行补 provider runtime、secret、quota 或请求 / 响应协议 truth |
| 治理结果接缝承接 | 能力接入事实、治理结果 / policy 结果语境、正式可见 / 可用语境 | 能力接入事实对治理结果的引用或摘要接缝 | 能力需要进入正式可见 / 可用语境或治理结果变化 | 本仓执行 approval;capability whitelist 反向定义 Policy truth;治理结果来源不可追溯 |
| 接入审查与治理职责区分 | 接入审查语境、安全判断、治理结果语境 | 审查意见、本仓接入事实和 governance approval 的职责边界 | 安全 / 接入审查与治理批准容易混写时 | 审查意见替代 approval;治理状态被本仓私自推进 |
| method asset body-free relation | 能力接入事实、method asset 引用语境、适用关系说明 | 不保存方法正文的 capability-method relation 语义 | 外部能力需要与方法资产适用语境建立关系 | Method Content、TaskDefinition、AIPolicyDef 或 ProcessTemplateDef 正文进入本仓 |
| 接入事实追溯 | 能力身份、注册目录、接入描述、治理引用、方法关系、查看语境 | 可解释的能力接入事实链路 | 审计 / 合规查看者需要解释能力为何处于当前接入语境 | 追溯依赖 observability 物理日志;调用成本或 runtime trace 替代接入 truth |
| 受控消费表达 | 正式接入事实、消费方语境、可见性 / 描述 / 接缝摘要 | 可被 runtime、tools、SDK 或产品入口消费的服务端能力表达 | 下游需要按边界消费能力接入事实 | 下游反写本仓 truth;本仓实现 SDK client 或 runtime loop |
| 正式可见性表达 | 正式接入事实、目录浏览语境、适用边界 | 对人类和系统都可理解的正式可见性和适用边界 | 浏览者或消费方需要区分草稿、未治理、未描述和正式能力 | marketplace listing、runtime 状态或治理 truth 替代本仓可见性语义 |
| 能力变化协作与感知 | identity / registry / descriptor / seam / relation 变化、维护语境、协作通道语境 | 可被下游持续感知的能力接入事实变化 | 能力接入事实发生影响消费边界的变化 | 未定义业务变化语义;事件 payload 或 projection 反向成为需求功能;变化无法回指接入 truth |

### 4.4 哪些能力共同构成闭环核心?哪些只是外围增强?

| 分类 | 能力 |
|---|---|
| 核心闭环能力 | 外部能力接入语境建立;能力身份稳定识别;接入身份风险解释;能力注册目录管理;目录可见性与生命周期语义;目录维护与一致性保护;adapter descriptor 表达;接入风险与约束摘要;描述边界消费支撑;治理结果接缝承接;接入审查与治理职责区分;method asset body-free relation;接入事实追溯;受控消费表达;正式可见性表达;能力变化协作与感知 |
| 外围增强能力 | 管理入口与批量整理;目录搜索与浏览优化;外部能力候选自动发现;安全摘要与 secret reference 提示深化;SDK / 客户端消费说明增强;只读生态发现;审计友好导出 |
| 边界外能力 | runtime/tools execution;外部调用拦截;provider runtime、failover、routing;secret/KMS 平台;cost accounting / billing;marketplace listing / transaction;governance approval execution / Policy truth;method asset body;SDK client package;LLM routing;observability store |

### 4.5 当前功能需求是否都能回指能力节点和用户故事?

是。结构化功能表中的每项核心功能均回指 C-CH-1~C-CH-5 至少一个节点,并回指 `US-CH-001`~`US-CH-017` 中至少一个故事。外围增强功能单独回指 `US-CH-E01`~`US-CH-E07`,不作为核心闭环完成条件。

### 4.6 当前能力节点是否存在故事已确认但没有功能承接?

不存在。Step 8 的 17 条核心故事均被 Step 9 功能需求承接:

| 核心故事范围 | 功能承接 |
|---|---|
| US-CH-001~US-CH-003 | 外部能力接入语境建立;能力身份稳定识别;接入身份风险解释 |
| US-CH-004~US-CH-006 | 能力注册目录管理;目录可见性与生命周期语义;目录维护与一致性保护 |
| US-CH-007~US-CH-009 | adapter descriptor 表达;接入风险与约束摘要;描述边界消费支撑 |
| US-CH-010~US-CH-013 | 治理结果接缝承接;接入审查与治理职责区分;method asset body-free relation;接入事实追溯 |
| US-CH-014~US-CH-017 | 受控消费表达;服务端 exposure boundary 保护;正式可见性表达;能力变化协作与感知 |

### 4.7 当前能力节点的功能需求是否足以进入规则讨论?

是。C-CH-1~C-CH-5 均已形成能力级功能需求和双重映射,后续 Step 10 可围绕这些功能需求继续收敛业务规则、边界约束和禁止替代项。

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 9 处理 |
|---|---|---|---|
| 旧功能清单 F-001~F-010 | MCP Registry、A2A Directory、Provider Contract、QueryCapabilities、Cost Accounting、Policy refresh、Audit event、Secret envelope、Marketplace metadata、LLM routing 并列。 | 对象、接口、依赖、规则、NFR、成本、secret、marketplace 和执行边界混写。 | 重建为 C-CH-1~C-CH-5 下的业务能力主题;旧功能只作重裁线索。 |
| 旧功能名 | `MCP Registry`、`A2A Directory`、`Provider Contract`、`QueryCapabilities` 等直接作为功能。 | 功能名绑定旧对象 / API,无法表达当前 capability identity、adapter descriptor 和受控消费边界。 | 重命名为能力级主题,不继承旧功能编号或接口名。 |
| 旧依赖列 | core / bus、KMS/Vault、governance policy、observability、marketplace、runtime。 | 将依赖类型、基础设施、外部系统和相邻仓 truth 写入功能表。 | 依赖已由 Step 6 裁剪;Step 9 不写 package / runtime dependency。 |
| 旧业务规则表 | BR-001~BR-006 写 allowlist、匿名注册、key 加密、30s、成本 / 审计事件、shared_rules。 | 规则、验收、NFR 和数据边界混入功能章节。 | 后移 Step 10 / 13 / 14,本步只记录后续落点。 |
| 旧功能依赖图 | Provider Contract -> Cost / QueryCapabilities;MCP Registry -> QueryCapabilities / Policy / Audit;A2A -> QueryCapabilities。 | 图表达旧对象 / 接口 / 事件依赖,不符合能力级功能归并。 | 改成能力级前置关系,不写调用链或事件链。 |
| 旧非功能指标 | QueryCapabilities P95、policy 30s、成本覆盖 100%、明文 key 0。 | 非功能和验收候选反向影响功能取舍。 | 后移 Step 13 / Step 14;不得作为 Step 9 功能存在理由。 |

---

## 6. 设计取舍

### 6.1 功能主轴取舍

| 方案 | 功能主轴 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 沿用旧 F-001~F-010 | 快速承接旧文档。 | 保留 Provider Contract、Cost、Secret、Marketplace、LLM routing 等越界项。 | 不采用。 |
| 方案 B | 按 C-CH-1~C-CH-5 归并业务能力主题 | 功能能直接回指核心闭环和用户故事,后续规则 / 数据 / 接口可继续同轴展开。 | 需要后续 Step 再闭合规则、字段、接口和验收。 | 采用。 |
| 方案 C | 按 MCP / A2A / API 三类协议拆功能 | 协议维度直观。 | 会把协议类别当核心能力,重复 identity / registry / descriptor 逻辑,并提前锁定数据结构。 | 不采用。 |
| 方案 D | 按管理 / 审查 / 消费 / 维护角色拆功能 | 贴近角色。 | 容易把同一能力拆散成角色动作,功能无法稳定映射 C-CH 节点。 | 不采用。 |
| 方案 E | 只写 registry + query 两个功能 | 简洁。 | 漏掉 identity、adapter descriptor、governance seam、method relation 和变化感知。 | 不采用。 |

### 6.2 关键功能取舍

| 议题 | 当前结论 | 理由 |
|---|---|---|
| 是否保留 `MCP Registry` / `A2A Directory` 旧名 | 不作为正式功能名;拆入身份、注册目录和接入描述能力。 | MCP / A2A 是外部能力类别,不是功能主轴。 |
| 是否保留 `Provider Contract` | 不保留旧名;重裁为 `adapter descriptor 表达` 和相关约束摘要能力。 | 旧名绑定 API key、quota、route、cost、provider runtime。 |
| 是否保留 `QueryCapabilities` | 不保留接口名;归入受控消费表达、正式可见性表达和描述边界消费支撑。 | Step 9 不写 API / query surface;Step 12 再闭合接口。 |
| 是否保留 `Policy 消费与白名单刷新` | 不保留刷新动作;归入治理结果接缝承接和能力变化协作。 | 本仓不拥有 Policy truth,也不承诺 30s 刷新。 |
| 是否保留 `Cost Accounting` | 不进入正式功能表。 | cost/billing 是 Step 4 非目标。 |
| 是否保留 `Secret envelope encryption` | 不进入核心功能;只作为后续规则 / 数据 / NFR 审计线索。 | 本仓不做 secret/KMS 平台,后续最多闭合 secret reference 禁止保存正文。 |
| 是否保留 `Audit event` | 不作为 Step 9 核心功能;接入事实追溯和审计友好导出保留。 | 业务追溯与 observability store / event payload 分层。 |
| 是否保留 marketplace metadata | 只作为外围只读生态发现候选。 | listing / transaction 不归本仓。 |
| 是否保留 LLM routing | 排除。 | LLM routing 是 runtime / provider orchestration future。 |

---

## 7. 结构化中间产物

### 7.1 功能需求结论

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| FR-CH-001 | 外部能力接入语境建立 | 核心闭环能力 | 系统必须支持把外部 MCP / A2A / API 能力从散落 URL、provider 名、工具配置或运行配置中抽离出来,形成可被讨论、识别和后续接入的业务语境。 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-001 |
| FR-CH-002 | 能力身份稳定识别 | 核心闭环能力 | 系统必须支持外部能力形成稳定身份语义,让注册、描述、治理引用、方法关系和下游消费能够围绕同一个 capability identity 协作。 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-002 |
| FR-CH-003 | 接入身份风险解释 | 核心闭环能力 | 系统必须支持在身份层解释外部连接主体和审查语境,让安全 / 接入审查能够理解能力身份风险,但不替代治理审批或执行拦截。 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-003 |
| FR-CH-004 | 能力注册目录管理 | 核心闭环能力 | 系统必须支持已识别外部能力进入受控注册目录,并让注册目录成为能力接入事实的正式管理语境,而不是运行白名单或市场元数据。 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-004 |
| FR-CH-005 | 目录可见性与生命周期语义 | 核心闭环能力 | 系统必须支持人类和系统理解能力在注册目录中的可见性、可用性和生命周期语义,以区分草稿、未治理、未描述和正式接入能力。 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-005;US-CH-015 |
| FR-CH-006 | 目录维护与一致性保护 | 核心闭环能力 | 系统必须支持维护任务在不创造新业务结论的前提下对注册目录进行派生、对账、重建和一致性保护。 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-006;US-CH-016 |
| FR-CH-007 | Adapter descriptor 表达 | 核心闭环能力 | 系统必须支持已注册能力拥有可解释的接入描述,表达接入方式、能力类型和使用边界,并将旧 Provider Contract 裁剪为能力接入描述语义。 | C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-007 |
| FR-CH-008 | 接入风险与约束摘要 | 核心闭环能力 | 系统必须支持接入描述携带可被审查和消费理解的风险、约束和敏感边界摘要,但不保存 secret 正文、不实现 KMS/Vault、不替代 governance policy。 | C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-008 |
| FR-CH-009 | 描述边界消费支撑 | 核心闭环能力 | 系统必须支持下游围绕同一接入描述理解能力边界,避免 runtime、tools、SDK 或产品入口自行补造 provider runtime、secret、quota 或请求 / 响应协议 truth。 | C-CH-3 已注册能力能够拥有可解释的接入描述;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-009 |
| FR-CH-010 | 治理结果接缝承接 | 核心闭环能力 | 系统必须支持能力接入事实引用或承接正式治理结果、policy 结果或使用约束摘要,使正式可见 / 可用语境不由目录状态或本地白名单自行决定。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-010 |
| FR-CH-011 | 接入审查与治理职责区分 | 核心闭环能力 | 系统必须支持区分接入审查意见、本仓接入事实和治理批准结论,让安全判断可追溯但不替代 `L1-governance` 的 approval / Policy truth。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-011 |
| FR-CH-012 | Method asset body-free relation | 核心闭环能力 | 系统必须支持能力接入事实与方法资产之间的适用关系语义,但关系只能以不保存方法正文的方式表达。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-012 |
| FR-CH-013 | 接入事实追溯 | 核心闭环能力 | 系统必须支持追溯能力身份、注册目录、接入描述、治理引用和方法资产关系之间的链路,以解释外部能力为何处于当前接入语境。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-013 |
| FR-CH-014 | 受控消费表达 | 核心闭环能力 | 系统必须支持正式能力接入事实被 runtime、tools、SDK 或产品入口按边界消费,并明确服务端正式能力边界与客户端便利封装的分层,同时不让消费方反写本仓 truth。 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-014;US-CH-017 |
| FR-CH-015 | 正式可见性表达 | 核心闭环能力 | 系统必须支持正式接入事实以可理解的可见性和适用边界呈现给目录浏览与系统消费语境,避免草稿、未治理或未描述能力被误当正式能力。 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-015 |
| FR-CH-016 | 能力变化协作与感知 | 核心闭环能力 | 系统必须支持身份、目录、描述、治理接缝和方法关系变化被下游持续感知,但不在本步定义事件 payload、projection、缓存或 SDK 实现。 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-016 |

### 7.2 外围增强功能结论

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| FR-CH-E01 | 管理入口与批量整理 | 外围增强能力 | 系统可进一步支持更丰富的管理入口和批量整理能力,以降低大规模外部能力接入维护成本。 | 外围增强:管理 UI / 批量导入 | US-CH-E01 |
| FR-CH-E02 | 目录搜索与浏览优化 | 外围增强能力 | 系统可进一步支持搜索、过滤、分类和浏览优化,以提升目录可发现性。 | 外围增强:搜索 / 浏览体验 | US-CH-E02 |
| FR-CH-E03 | 外部能力候选自动发现 | 外围增强能力 | 系统可进一步辅助发现外部 MCP / A2A / API 能力候选,但候选发现不能直接形成正式接入 truth。 | 外围增强:自动发现 / 候选导入 | US-CH-E03 |
| FR-CH-E04 | 安全摘要与 secret reference 提示深化 | 外围增强能力 | 系统可进一步增强安全摘要和 secret reference 约束提示,但不成为 secret/KMS 平台。 | 外围增强:安全摘要 / secret reference 约束深化 | US-CH-E04 |
| FR-CH-E05 | SDK / 客户端消费说明增强 | 外围增强能力 | 系统可进一步提供更友好的消费语义说明,帮助 SDK 或客户端封装保持与服务端能力边界一致。 | 外围增强:SDK developer experience | US-CH-E05 |
| FR-CH-E06 | 只读生态发现 | 外围增强能力 | 系统可进一步为生态入口提供只读可发现线索,但不拥有 marketplace listing、交易、定价或履约。 | 外围增强:只读生态发现 | US-CH-E06 |
| FR-CH-E07 | 审计友好导出 | 外围增强能力 | 系统可进一步支持导出能力接入事实摘要用于审计协作,但不拥有 audit log store 或外部 GRC truth。 | 外围增强:审计友好输出 | US-CH-E07 |

### 7.3 旧功能重裁映射

| 旧功能 | 当前处理 | 对应当前功能 / 后续落点 | 裁剪说明 |
|---|---|---|---|
| F-001 MCP Registry | 重裁为核心支撑线索 | FR-CH-001;FR-CH-002;FR-CH-004;FR-CH-007;Step 10/11/12 | 不保留“白名单注册 + allowlist 执行”旧语义。 |
| F-002 A2A Directory | 重裁为核心支撑线索 | FR-CH-001;FR-CH-002;FR-CH-004;FR-CH-007;Step 10/11/12 | 不扩张为全平台身份认证或 A2A runtime。 |
| F-003 Provider Contract | 重命名 / 重裁剪 | FR-CH-007;FR-CH-008;FR-CH-009;Step 11/12 | 只保留 adapter descriptor;API key、quota、route、cost、failover 排除。 |
| F-004 QueryCapabilities | 重命名 / 后置 | FR-CH-014;FR-CH-015;FR-CH-016;Step 12/13 | 不写查询接口名或 P95;后续重裁为受控消费表达。 |
| F-005 Cost Accounting | 排除 | Step 15 风险 / 历史冲突;Step 13/14 候选审计 | cost/billing 不属于能力接入 truth。 |
| F-006 Policy 消费与白名单刷新 | 重裁为治理结果接缝和变化感知 | FR-CH-010;FR-CH-016;Step 10/11/12/14 | 不执行 approval,不拥有 Policy truth,不承诺 30s 刷新。 |
| F-007 审计事件发出 | 重裁为追溯 / 外围审计输出线索 | FR-CH-013;FR-CH-E07;Step 12/13/14 | 不定义 observability store、event payload 或调用审计。 |
| F-008 Secret envelope encryption | 后置审计线索 | FR-CH-008;FR-CH-E04;Step 10/11/13 | 只可讨论 secret reference / 禁止保存正文,不做 KMS/Vault。 |
| F-009 capability marketplace metadata | 外围只读发现候选 / 边界外交易 | FR-CH-E06;Step 12/15 | listing、交易、定价和履约排除。 |
| F-010 LLM routing | 排除 | Step 15 future / 非目标审计 | 不进入当前核心闭环或功能需求。 |

### 7.4 能力类型结论

| 能力类型 | 功能需求 |
|---|---|
| 核心闭环能力 | FR-CH-001;FR-CH-002;FR-CH-003;FR-CH-004;FR-CH-005;FR-CH-006;FR-CH-007;FR-CH-008;FR-CH-009;FR-CH-010;FR-CH-011;FR-CH-012;FR-CH-013;FR-CH-014;FR-CH-015;FR-CH-016 |
| 外围增强能力 | FR-CH-E01;FR-CH-E02;FR-CH-E03;FR-CH-E04;FR-CH-E05;FR-CH-E06;FR-CH-E07 |
| 边界外能力 | runtime/tools execution;外部调用拦截;provider runtime / failover / routing;secret/KMS 平台;cost accounting / billing;marketplace listing / transaction;governance approval / Policy truth;method asset body;SDK client package;LLM routing;observability store |

### 7.5 闭环映射结论

| 核心能力节点 | 功能需求 |
|---|---|
| C-CH-1 外部能力能够以稳定身份进入接入语境 | FR-CH-001;FR-CH-002;FR-CH-003 |
| C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | FR-CH-004;FR-CH-005;FR-CH-006 |
| C-CH-3 已注册能力能够拥有可解释的接入描述 | FR-CH-007;FR-CH-008;FR-CH-009 |
| C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | FR-CH-010;FR-CH-011;FR-CH-012;FR-CH-013 |
| C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | FR-CH-006;FR-CH-009;FR-CH-013;FR-CH-014;FR-CH-015;FR-CH-016 |
| 外围增强 | FR-CH-E01;FR-CH-E02;FR-CH-E03;FR-CH-E04;FR-CH-E05;FR-CH-E06;FR-CH-E07 |

### 7.6 故事映射结论

| 用户故事 | 功能需求 |
|---|---|
| US-CH-001 | FR-CH-001 |
| US-CH-002 | FR-CH-002 |
| US-CH-003 | FR-CH-003 |
| US-CH-004 | FR-CH-004 |
| US-CH-005 | FR-CH-005;FR-CH-015 |
| US-CH-006 | FR-CH-006 |
| US-CH-007 | FR-CH-007 |
| US-CH-008 | FR-CH-008 |
| US-CH-009 | FR-CH-009;FR-CH-014 |
| US-CH-010 | FR-CH-010 |
| US-CH-011 | FR-CH-011 |
| US-CH-012 | FR-CH-012 |
| US-CH-013 | FR-CH-013 |
| US-CH-014 | FR-CH-014 |
| US-CH-015 | FR-CH-015 |
| US-CH-016 | FR-CH-016 |
| US-CH-017 | FR-CH-014 |
| US-CH-E01 | FR-CH-E01 |
| US-CH-E02 | FR-CH-E02 |
| US-CH-E03 | FR-CH-E03 |
| US-CH-E04 | FR-CH-E04 |
| US-CH-E05 | FR-CH-E05 |
| US-CH-E06 | FR-CH-E06 |
| US-CH-E07 | FR-CH-E07 |

### 7.7 边界外功能排除结论

| 功能候选 | 排除原因 | 正确落点 / 后续处理 |
|---|---|---|
| 外部 MCP / A2A / API 实际调用执行 | 本仓不执行 runtime/tools,不拥有调用结果或执行状态。 | `L2-runtime` / `L2-tools`。 |
| 未白名单能力调用拦截 | 拦截执行属于执行边界;allow/deny 规则后续只可作为边界规则 / 验收审计。 | Step 10 / Step 14;执行落点在 L2。 |
| Provider runtime、failover、retry、routing | provider orchestration 不属于能力接入 truth。 | runtime / provider adapter future。 |
| Provider API key 托管和 KMS/Vault 集成 | 本仓不做 secret 平台,不保存 secret 正文。 | Step 10 / Step 11 / Step 13 仅审计 secret reference 和禁止保存正文。 |
| Cost Accounting / billing / finance ledger | cost/billing 是非目标,不是能力接入 truth。 | finance / observability / future;Step 15 记录历史冲突。 |
| Governance approval execution / Policy effective fact | 治理审批和 Policy truth 归 `L1-governance`。 | 本仓只承接结果接缝;Step 10~12 闭合边界。 |
| Method asset body 管理 | 方法资产正文归 `L3-method-library`。 | 本仓只保存 body-free relation 语义;Step 11 / Step 12 闭合。 |
| SDK client / language package 生成 | SDK client 和多语言包归 `L0-sdk`。 | 本仓只提供服务端 exposure boundary。 |
| Marketplace listing / transaction / fulfillment | listing、交易、定价和履约归 `L6-marketplace`。 | 本仓最多保留只读生态发现外围增强。 |
| LLM routing / model selection | 属于 runtime/provider orchestration future。 | 不进入当前需求主链。 |
| Observability log / metric / trace store | 物理观测存储不归本仓。 | 本仓只可输出业务追溯或审计友好摘要的边界候选。 |

### 7.8 能力级功能停审结论

| 核心能力节点 | 功能承接 | 故事承接 | 停审结论 |
|---|---|---|---|
| C-CH-1 稳定身份 | FR-CH-001;FR-CH-002;FR-CH-003 | US-CH-001;US-CH-002;US-CH-003 | 已覆盖接入语境、稳定身份和身份风险解释;未写接口、字段或 provider runtime,可进入 Step 10。 |
| C-CH-2 注册目录 | FR-CH-004;FR-CH-005;FR-CH-006 | US-CH-004;US-CH-005;US-CH-006 | 已覆盖注册目录、可见性 / 生命周期语义和维护一致性;未写状态机、数据库或 marketplace listing,可进入 Step 10。 |
| C-CH-3 接入描述 | FR-CH-007;FR-CH-008;FR-CH-009 | US-CH-007;US-CH-008;US-CH-009 | 已覆盖 adapter descriptor、风险 / 约束摘要和描述消费支撑;已裁剪 secret、cost、quota、failover,可进入 Step 10。 |
| C-CH-4 治理 / 方法关系接缝 | FR-CH-010;FR-CH-011;FR-CH-012;FR-CH-013 | US-CH-010;US-CH-011;US-CH-012;US-CH-013 | 已覆盖治理结果接缝、职责区分、body-free method relation 和追溯;未执行 approval 或保存方法正文,可进入 Step 10。 |
| C-CH-5 受控消费表达 | FR-CH-006;FR-CH-009;FR-CH-013;FR-CH-014;FR-CH-015;FR-CH-016 | US-CH-009;US-CH-013;US-CH-014;US-CH-015;US-CH-016;US-CH-017 | 已覆盖受控消费、正式可见性、变化感知和服务端 exposure boundary 保护;未写 API、event payload、SDK client 或 runtime loop,可进入 Step 10。 |

### 7.9 功能依赖结论

```text
外部能力接入语境建立
  -> 能力身份稳定识别 / 接入身份风险解释
  -> 能力注册目录管理
  -> 目录可见性与生命周期语义 / 目录维护与一致性保护
  -> Adapter descriptor 表达
  -> 接入风险与约束摘要 / 描述边界消费支撑
  -> 治理结果接缝承接 / 接入审查与治理职责区分 / Method asset body-free relation
  -> 接入事实追溯
  -> 受控消费表达 / 正式可见性表达 / 能力变化协作与感知
```

本依赖只表达需求能力上的前置关系,不表达实现步骤、接口调用、事件传播、数据库事务、部署顺序或开发阶段。

---

## 8. 回填草稿

> 注意: 以下只是在 Step 17 装配正式文档时可使用的 §9 候选文本。当前不得直接写入正式 `00-需求文档.md`。

### 8.1 功能需求

| 编号 | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| FR-CH-001 | 外部能力接入语境建立 | 核心闭环能力 | 系统必须支持把外部 MCP / A2A / API 能力从散落 URL、provider 名、工具配置或运行配置中抽离出来,形成可被讨论、识别和后续接入的业务语境。 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-001 |
| FR-CH-002 | 能力身份稳定识别 | 核心闭环能力 | 系统必须支持外部能力形成稳定身份语义,让注册、描述、治理引用、方法关系和下游消费能够围绕同一个 capability identity 协作。 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-002 |
| FR-CH-003 | 接入身份风险解释 | 核心闭环能力 | 系统必须支持在身份层解释外部连接主体和审查语境,让安全 / 接入审查能够理解能力身份风险,但不替代治理审批或执行拦截。 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-003 |
| FR-CH-004 | 能力注册目录管理 | 核心闭环能力 | 系统必须支持已识别外部能力进入受控注册目录,并让注册目录成为能力接入事实的正式管理语境,而不是运行白名单或市场元数据。 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-004 |
| FR-CH-005 | 目录可见性与生命周期语义 | 核心闭环能力 | 系统必须支持人类和系统理解能力在注册目录中的可见性、可用性和生命周期语义,以区分草稿、未治理、未描述和正式接入能力。 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-005;US-CH-015 |
| FR-CH-006 | 目录维护与一致性保护 | 核心闭环能力 | 系统必须支持维护任务在不创造新业务结论的前提下对注册目录进行派生、对账、重建和一致性保护。 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-006;US-CH-016 |
| FR-CH-007 | Adapter descriptor 表达 | 核心闭环能力 | 系统必须支持已注册能力拥有可解释的接入描述,表达接入方式、能力类型和使用边界,并将旧 Provider Contract 裁剪为能力接入描述语义。 | C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-007 |
| FR-CH-008 | 接入风险与约束摘要 | 核心闭环能力 | 系统必须支持接入描述携带可被审查和消费理解的风险、约束和敏感边界摘要,但不保存 secret 正文、不实现 KMS/Vault、不替代 governance policy。 | C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-008 |
| FR-CH-009 | 描述边界消费支撑 | 核心闭环能力 | 系统必须支持下游围绕同一接入描述理解能力边界,避免 runtime、tools、SDK 或产品入口自行补造 provider runtime、secret、quota 或请求 / 响应协议 truth。 | C-CH-3 已注册能力能够拥有可解释的接入描述;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-009 |
| FR-CH-010 | 治理结果接缝承接 | 核心闭环能力 | 系统必须支持能力接入事实引用或承接正式治理结果、policy 结果或使用约束摘要,使正式可见 / 可用语境不由目录状态或本地白名单自行决定。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-010 |
| FR-CH-011 | 接入审查与治理职责区分 | 核心闭环能力 | 系统必须支持区分接入审查意见、本仓接入事实和治理批准结论,让安全判断可追溯但不替代 `L1-governance` 的 approval / Policy truth。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-011 |
| FR-CH-012 | Method asset body-free relation | 核心闭环能力 | 系统必须支持能力接入事实与方法资产之间的适用关系语义,但关系只能以不保存方法正文的方式表达。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-012 |
| FR-CH-013 | 接入事实追溯 | 核心闭环能力 | 系统必须支持追溯能力身份、注册目录、接入描述、治理引用和方法资产关系之间的链路,以解释外部能力为何处于当前接入语境。 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-013 |
| FR-CH-014 | 受控消费表达 | 核心闭环能力 | 系统必须支持正式能力接入事实被 runtime、tools、SDK 或产品入口按边界消费,并明确服务端正式能力边界与客户端便利封装的分层,同时不让消费方反写本仓 truth。 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-014;US-CH-017 |
| FR-CH-015 | 正式可见性表达 | 核心闭环能力 | 系统必须支持正式接入事实以可理解的可见性和适用边界呈现给目录浏览与系统消费语境,避免草稿、未治理或未描述能力被误当正式能力。 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-015 |
| FR-CH-016 | 能力变化协作与感知 | 核心闭环能力 | 系统必须支持身份、目录、描述、治理接缝和方法关系变化被下游持续感知,但不在本步定义事件 payload、projection、缓存或 SDK 实现。 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-016 |

外围增强功能可在正式文档中保留为独立表,但不得作为当前核心闭环完成条件。边界外功能不进入正式功能需求表。

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 9 | 后续处理 |
|---|---|---|---|---|
| OQ-CH-009-001 | `FR-CH-003 接入身份风险解释` 后续是否需要保存审查意见,还是只作为治理接缝输入。 | pending | 否 | Step 10 / Step 11 / Step 12 处理。 |
| OQ-CH-009-002 | `FR-CH-007 Adapter descriptor 表达` 是否需要按 MCP / A2A / API 拆分规则和数据归属。 | pending | 否 | Step 10 / Step 11 处理。 |
| OQ-CH-009-003 | `FR-CH-010 治理结果接缝承接` 的最小引用语义是 approval ref、policy result ref、scope summary 还是状态引用。 | pending | 否 | Step 10 / Step 11 / Step 12 处理。 |
| OQ-CH-009-004 | `FR-CH-012 Method asset body-free relation` 是否需要单独 relation 类型和适用性摘要。 | pending | 否 | Step 10 / Step 11 / Step 12 处理。 |
| OQ-CH-009-005 | `FR-CH-014 受控消费表达` 是否仅通过服务端查询 / 事件协作表达,还是需要明确 SDK exposure 的最小服务端边界。 | pending | 否 | Step 12 处理。 |
| OQ-CH-009-006 | 外围 `FR-CH-E06 只读生态发现` 是否保留到正式功能表,还是后移风险 / 未来方向。 | pending | 否 | Step 15 或 Step 17 装配时处理。 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 F-001~F-010 与当前边界冲突 | historical_conflict_not_blocker | 旧功能清单不能继承,但 Step 7 / Step 8 提供了足够能力节点和故事锚点重新归并功能。 | 已重裁为当前功能需求或排除。 |
| adapter descriptor 具体数据未闭合 | not_blocker_for_step_09 | Step 9 只需确认接入描述能力主题;规则、数据和接口后续闭合。 | Step 10 / Step 11 / Step 12 处理。 |
| governance seam 字段未闭合 | not_blocker_for_step_09 | Step 9 只需确认治理结果接缝功能;字段 / 引用语义后续处理。 | Step 10 / Step 11 / Step 12 处理。 |
| method relation 字段未闭合 | not_blocker_for_step_09 | Step 9 只需确认 body-free relation 功能;具体数据和接口后续处理。 | Step 11 / Step 12 处理。 |
| SDK exposure 具体 surface 未闭合 | not_blocker_for_step_09 | Step 9 只需确认受控消费表达功能;不定义 SDK client 或 API。 | Step 12 处理。 |

结论: 未发现阻塞 `00-需求文档.md` Step 9 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每项功能需求都有编号 | pass | 使用 `FR-CH-001` ~ `FR-CH-016` 和 `FR-CH-E01` ~ `FR-CH-E07`。 |
| 每项核心功能都有能力类型、说明、闭环映射和故事映射 | pass | §7.1 完整覆盖固定列。 |
| 已区分核心闭环功能与外围增强功能 | pass | §7.1 为核心,§7.2 为外围增强。 |
| 未写 CRUD、API、Command 或接口名 | pass | 未使用 QueryCapabilities、RegisterProvider、endpoint、DTO、event payload、handler 或 repository。 |
| 未把用户故事原样改写成功能 | pass | 功能按能力主题归并,不是逐句改写故事。 |
| 未把业务规则、数据归属、NFR 或验收写成功能 | pass | 白名单、30s、P95、secret 正文、状态机、字段和验收均后置。 |
| 边界外能力未进入正式功能需求表 | pass | cost、secret/KMS、marketplace、LLM routing、runtime execution、governance approval、method body、SDK client 均已排除。 |
| 已给出旧功能重裁映射 | pass | §7.3 覆盖旧 F-001~F-010。 |
| 是否可进入 Step 10 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |
