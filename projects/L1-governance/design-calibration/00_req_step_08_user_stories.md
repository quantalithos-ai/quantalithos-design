# Step 8. 用户故事

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 8
> 回填章节: `00-需求文档.md` §8 用户故事
> 生成日期: 2026-06-06

---

## 1. 本步目标

围绕 Step 7 已收敛的核心能力闭环,把 Step 5 的角色目标转成需求层用户故事。本步不把旧功能名、接口名、状态机、事件名、字段、Policy DSL、Gate 六段式、SoA 控制项覆盖规则或验收用例包装成故事;也不把 process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 或外部 GRC 的边界外能力写进本仓正式故事表。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_05_users_roles.md` | Step 5 已完成 | 固定治理负责人 / 组织管理员、Gate 决策人 / Approver、Policy / Control 责任人、AIIA / SoA 评审人、Nonconformity 处置责任人、审计者 / 合规查看者、项目 / 领域负责人、AI member / 自动化执行者、治理系统 actor、运维 / 后台任务 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-GOV-1~C-GOV-5 核心能力闭环 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 防止故事越界到相邻仓 truth |
| `design-calibration/00_req_step_04_goals_non_goals.md` | Step 4 已完成 | 固定 Gate / Approval / Decision、Policy、Control / AIIA / SoA、Nonconformity 和相邻仓协作边界 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定 Governance 的强前置、场景前置、消费方和禁止依赖边界 |
| 旧 `projects/L1-governance/00-需求文档.md` §5 | 旧版核心用例和用户故事 | 作为 Gate、Policy、SoA、Nonconformity 和 shared rules 故事线索,不直接继承接口名和 Given / When / Then |
| 旧 `projects/L1-governance/00-需求文档.md` §6 | 旧版功能清单 | 作为功能线索后移 Step 9,不在本步转成接口式故事 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取角色目标和治理对象线索,不继承字段、状态机、RPC、事件名或不变量编号 |

---

## 3. SOP 问题回答

### 3.1 哪些角色目标在支撑本仓的核心能力闭环？

支撑核心闭环的故事必须围绕治理事实成立,而不是围绕审批 UI、接口动作、runtime cache、artifact 文档正文或 observability 审计存储成立。

| 闭环节点 | 支撑它的角色目标 |
|---|---|
| C-GOV-1 治理语境与适用对象能够被确定 | 治理负责人需要确认治理范围和责任语境;项目 / 领域负责人需要把待治理对象放入可裁决语境;治理系统 actor 需要把系统触发转成可解释治理输入 |
| C-GOV-2 关键节点治理裁决能够形成正式结论 | Gate 决策人 / Approver 需要对关键节点形成正式裁决;项目 / 领域负责人需要获得可消费决策;AI member / 自动化执行者需要知道何时必须停止自动推进并等待裁决 |
| C-GOV-3 治理策略与控制适用约束能够成立 | Policy / Control 责任人需要维护策略生效和控制适用语境;AI member / 自动化执行者需要理解当前治理授权边界;项目 / 领域负责人需要知道当前项目受哪些治理约束影响 |
| C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | AIIA / SoA 评审人需要评审影响评估和适用性声明结论;Nonconformity 处置责任人需要推进不符合纠正闭环;审计者需要理解控制、评估、适用性和纠正之间的治理关系 |
| C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | 审计者 / 合规查看者需要追溯治理事实;内部消费方需要围绕同一治理结论协作;运维 / 后台任务需要维护派生、对账、报告和归档材料而不改变业务治理结论 |

### 3.2 哪些角色目标只是外围增强,而不决定闭环是否成立？

外围增强故事可以保留为后续能力线索,但不能压过核心闭环:

| 外围增强目标 | 角色 | 原因 |
|---|---|---|
| 更丰富的审批工作台、治理看板和报表筛选 | 治理负责人、审计者、项目 / 领域负责人 | 依赖 Governance truth,但属于消费展示增强 |
| Policy DSL 高级表达和模拟评估 | Policy / Control 责任人 | 可提升策略表达力,但不是 Policy truth 成立的最小条件 |
| 复杂 Gate kind、多人评审编排和升级路径 | Gate 决策人 / Approver | 是裁决能力扩展形态,基础正式裁决先成立 |
| AIIA 自动草拟、SoA 自动补全和周期性管理评审建议 | AIIA / SoA 评审人、治理系统 actor | 可降低维护成本,但不得替代正式治理结论 |
| 外部 GRC / 法律系统集成 | 治理负责人、审计者 | 是外部生态增强,不是平台内部治理事实成立条件 |
| 容量、P95、Policy 下发时延和覆盖率看板 | 运维 / 后台任务、治理负责人 | 属于非功能、观测和验收候选,后移 Step 13 / Step 14 |

### 3.3 哪些看起来像故事,但其实不应进入本仓？

| 看似故事 | 不进入原因 | 正确归属 |
|---|---|---|
| 作为流程协调者,我希望流程在 waiting gate 后恢复推进,以便过程继续执行 | waiting state 和恢复 truth 不是 Governance | `L1-process` |
| 作为项目负责人,我希望创建或关闭 WorkItem,以便项目工作推进 | WorkItem / Iteration truth 不是 Governance | `L1-work` |
| 作为文档维护者,我希望编辑 AIIA / SoA 正文,以便形成合规文档 | Artifact / evidence / 文档正文不是 Governance | `L1-artifact` |
| 作为用户,我希望在对话中看到 Gate 卡片,以便完成审批交互 | 对话显化和 UI 状态不是 Governance | `L1-conversation` / `L5-console` |
| 作为成员管理员,我希望创建 approver 角色和成员身份,以便授权决策 | 成员生命周期和身份管理不是 Governance | `L1-identity` |
| 作为方法管理员,我希望维护 AIPolicyDef 或控制定义正文,以便策略可复用 | 方法 / 策略定义 source truth 不是 Governance | `L3-method-library` |
| 作为执行器,我希望 runtime 自动拦截工具调用,以便执行 Policy | runtime enforcement 和 tool loop 不是 Governance truth | `L2-runtime` / `L2-member-service` |
| 作为能力管理员,我希望注册工具能力和适配器,以便工具可用 | capability registry 和 tool adapter 不是 Governance | `L3-capability-hub` |
| 作为审计平台,我希望保存不可变日志总账,以便长期审计 | audit log physical store 不是 Governance | `L4-observability` |
| 作为工作台用户,我希望管理跨域治理 dashboard,以便总览项目 | 聚合视图和 UI 状态不是 Governance | `L1-workspace` / `L5-console` |

### 3.4 每条故事分别支撑闭环中的哪个能力节点？

每条正式故事必须能映射到 C-GOV-1~C-GOV-5 或明确标记为外围增强。故事不直接映射到接口、事件、数据库对象、状态机、业务规则、验收场景或 implementation phase。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §5.1 | 以 Raise Gate、Decide Gate、发布 Policy、管理 AIIA / SoA / Nonconformity、消费 `gate.decided` 结果列核心用例 | 是用例 / 功能 / 接口动作混合清单,不是按闭环组织的用户故事 | Step 8 改为角色目标故事表,旧内容作为功能线索后移 Step 9 |
| 旧 `00-需求文档.md` §5.2 | 用户故事包含 `GetApplicablePolicies`、`RaiseNonconformity`、`gate.decided` 等接口 / 事件 / 功能名 | 用户故事退化成接口动作或验收用例 | 去掉接口名和事件名,改写为目标级叙事 |
| 旧 `00-需求文档.md` §5.2 | Auditor 查看 SoA 38 控制项覆盖写成用户故事验收条件 | 38 控制项覆盖属于业务规则和验收方向 | 保留为 AIIA / SoA 治理结论故事,具体覆盖规则后移 Step 10 / Step 14 |
| 旧 `00-需求文档.md` §5.2 | runtime 直接作为故事角色消费 Policy Cache | runtime 是相邻仓 / 执行方,不应在 Step 8 作为 governance 角色写接口目标 | 改写为 AI member / 自动化执行者受治理约束,相邻仓消费后移 Step 12 |
| 旧 `00-需求文档.md` §6 | 功能清单 F-001~F-014 覆盖 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity、DSL 和性能 | 功能、规则、非功能、依赖和实施候选混写 | 后移 Step 9~Step 14 分别收束 |
| `domain/governance/README.md` | 已有 Gate、Policy、Control、AIIA、SoA、Nonconformity 字段、状态和不变量 | 可作线索,但不能直接进入用户故事 | 只提取角色目标,不继承字段、状态机、RPC 和事件名 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 故事组织方式 | 按旧用例 / 功能动作排列 | 按核心闭环 C-GOV-1~C-GOV-5 与外围增强排列 | 保证故事服务仓存在必要性 |
| 故事粒度 | 出现接口名、事件名、状态名、Given / When / Then 验收条件 | 使用“作为角色,我希望目标,以便价值”的目标级句式 | 避免提前进入接口、规则和测试 |
| 角色表达 | runtime、各域服务、治理系统等混合作故事主体 | 使用 Step 5 已收敛角色,相邻仓后移依赖 / 接口章节 | 避免把仓际依赖写成角色 |
| Gate 处理 | 写成 Raise / Decide / 六段式完整 | 写成关键节点正式治理裁决目标 | 规则、字段和状态机后移 |
| Policy 处理 | 写成 GetApplicablePolicies、Policy Cache 和 DSL | 写成策略生效、授权边界和适用约束目标 | 执行缓存、DSL 和接口后移 |
| AIIA / SoA 处理 | 写成查看 38 控制项覆盖或发布文档 | 写成治理评审、适用性和批准结论目标 | artifact 正文和具体验收后移 |
| Nonconformity 处理 | 写成 Control 被违反后自动创建对象 | 写成不符合纠正闭环目标 | 自动触发和状态机后移 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 US-001~US-005 | 快,保留旧验收条件 | 含接口名、事件名、功能名和边界外角色,无法支撑最新闭环 | 不采用 |
| 方案 B: 按核心能力闭环重写故事 | 故事能直接支撑 Step 9 功能归并和 Step 16 追溯 | 需要后续再补功能、规则和验收 | 采用 |
| 方案 C: 按角色分别列大量故事 | 角色覆盖完整 | 容易变成普通故事清单,核心闭环被稀释 | 不采用 |
| 方案 D: 只写 Gate / Approval 故事 | 突出治理裁决 | 会漏掉 Policy、Control、AIIA、SoA 和 Nonconformity 的治理控制闭环 | 不采用 |
| 方案 E: 只写核心故事,不写外围增强 | 文档干净 | 会丢失旧文档中有价值但非核心的增强线索 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否保留 `GetApplicablePolicies` 接口名式故事？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样保留 | 会把接口名和查询 surface 提前写进用户故事 |
| 方案 B | 改写为“自动化执行者希望理解当前治理授权边界” | 保留业务价值,把接口和查询后移 Step 12 |

推荐方案 B。原因是 Step 8 应写目标级叙事,不是固定 API 或查询名。

#### 是否把 SoA 38 控制项覆盖写进故事？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样写入故事和验收条件 | 会把具体标准覆盖规则提前写进用户故事 |
| 方案 B | 写成 AIIA / SoA 评审人希望形成可解释治理结论 | 保留合规价值,覆盖规则后移 Step 10 / Step 14 |

推荐方案 B。原因是 38 控制项覆盖属于规则和验收方向,不是故事目标本身。

#### 是否把 runtime / capability-hub 写成正式故事角色？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成故事角色 | 会把相邻仓依赖和执行 truth 混入角色故事 |
| 方案 B | 写 AI member / 自动化执行者的受治理目标,相邻仓消费后移 Step 12 | 保留治理约束价值,不越界 |

推荐方案 B。原因是 Step 5 已确认相邻仓不是本章角色。

#### 是否把外部 GRC 集成写入正式故事表？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为核心或外围故事 | 会把外部系统接入过早纳入当前需求主链 |
| 方案 B | 只作为外围增强线索,不进入正式核心故事 | 保留后续方向,不加重当前闭环 |

推荐方案 B。原因是 Step 6 已确认当前阶段无正式外部系统依赖。

---

## 7. 结构化中间产物

### 7.1 核心闭环故事结论

| ID | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-GOV-001 | 作为治理负责人 / 组织管理员,我希望确认治理范围、责任语境和适用对象,以便后续裁决、策略和控制结论都锚定在同一治理上下文中。 | 核心闭环故事 | 让 Governance 从一开始就围绕明确语境成立,避免变成泛审批或泛合规记录。 | 支撑 C-GOV-1 治理语境与适用对象能够被确定 |
| US-GOV-002 | 作为项目 / 领域负责人,我希望把需要治理的项目、过程、工作或产物语境带入正式治理请求,以便治理结论能回到正确的业务对象。 | 核心闭环故事 | 防止 Governance 裁决与相邻仓事实脱锚,同时不复制相邻仓 truth。 | 支撑 C-GOV-1 治理语境与适用对象能够被确定;C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 |
| US-GOV-003 | 作为治理系统 actor,我希望把系统触发、周期复核或风险信号转成可解释的治理输入,以便自动化只能提出治理语境而不能绕过正式裁决。 | 核心闭环故事 | 让自动触发受治理事实约束,不让 runtime 或 observability 直接创造治理结论。 | 支撑 C-GOV-1 治理语境与适用对象能够被确定 |
| US-GOV-004 | 作为 Gate 决策人 / Approver,我希望在关键节点获得足够清晰的裁决语境并形成正式治理结论,以便 AI 或项目流程不能越过人类或授权策略继续推进。 | 核心闭环故事 | 让关键节点由正式治理裁决闭合,而不是由 UI、process waiting state 或工作状态隐式决定。 | 支撑 C-GOV-2 关键节点治理裁决能够形成正式结论 |
| US-GOV-005 | 作为项目 / 领域负责人,我希望消费一个稳定、可追溯的治理裁决结果,以便相邻工作、过程或产物路径能围绕同一结论继续或停止。 | 核心闭环故事 | 让相邻仓消费同一 decision truth,防止各自补造决策。 | 支撑 C-GOV-2 关键节点治理裁决能够形成正式结论;C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 |
| US-GOV-006 | 作为 AI member / 自动化执行者,我希望知道哪些情形必须停止自动推进并等待治理裁决,以便我的自主行为始终处于可解释的治理边界内。 | 核心闭环故事 | 把 AI 自主性受控落为治理边界需求,但不拥有 runtime 执行 truth。 | 支撑 C-GOV-2 关键节点治理裁决能够形成正式结论;C-GOV-3 治理策略与控制适用约束能够成立 |
| US-GOV-007 | 作为 Policy / Control 责任人,我希望维护策略生效、优先级、适用范围和控制责任语境,以便组织级和项目级治理约束能被一致理解。 | 核心闭环故事 | 让 Policy / Control 成为治理事实,而不是 method definition、runtime cache 或工具白名单。 | 支撑 C-GOV-3 治理策略与控制适用约束能够成立 |
| US-GOV-008 | 作为项目 / 领域负责人,我希望理解当前项目或对象受到哪些治理策略和控制约束,以便在推进工作前判断风险和责任边界。 | 核心闭环故事 | 让业务负责人消费的是正式治理约束,不是本地推测或 UI 提示。 | 支撑 C-GOV-3 治理策略与控制适用约束能够成立;C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 |
| US-GOV-009 | 作为 AI member / 自动化执行者,我希望理解当前适用的治理授权边界,以便工具使用、自动推进和升级请求不会越过正式 Policy 约束。 | 核心闭环故事 | 支撑自动化受治理,但不把 policy cache 或 tool execution 写成 Governance truth。 | 支撑 C-GOV-3 治理策略与控制适用约束能够成立 |
| US-GOV-010 | 作为 AIIA / SoA 评审人,我希望形成影响评估和适用性声明的治理评审结论,以便合规判断不只是 artifact 文档正文或标准条款列表。 | 核心闭环故事 | 把 AIIA / SoA 的治理结论和 artifact 正文边界分开。 | 支撑 C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 |
| US-GOV-011 | 作为 Policy / Control 责任人,我希望追踪控制适用、实施和复核责任语境,以便控制项不是静态标准引用,而是可被治理闭环消费的事实。 | 核心闭环故事 | 让 Control 成为治理约束和复核事实,不是标准原文或文档正文。 | 支撑 C-GOV-3 治理策略与控制适用约束能够成立;C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 |
| US-GOV-012 | 作为 Nonconformity 处置责任人,我希望围绕不符合、原因、纠正、复验和关闭形成正式治理闭环,以便不符合不会退化为普通 bug、工作阻塞或告警。 | 核心闭环故事 | 建立治理纠正事实,并保护 work / observability 边界。 | 支撑 C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 |
| US-GOV-013 | 作为审计者 / 合规查看者,我希望追溯治理语境、裁决依据、策略适用、控制覆盖、评审结论和纠正闭环,以便审计时能解释关键治理事实如何形成。 | 核心闭环故事 | 让 Governance truth 可被审计解释,但不接管 observability 物理日志。 | 支撑 C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 |
| US-GOV-014 | 作为运维 / 后台任务,我希望在不改变业务治理结论的前提下维护派生结果、对账材料、报告和归档切片,以便相邻消费方获得一致的治理事实视图。 | 核心闭环故事 | 支撑派生、报告和归档一致性,但维护动作不得创造新的治理结论。 | 支撑 C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 |

### 7.2 外围增强故事结论

| ID | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-GOV-E01 | 作为治理负责人 / 组织管理员,我希望获得更丰富的治理工作台和跨项目治理看板,以便更快发现治理压力和风险趋势。 | 外围增强故事 | 提升治理管理效率,但不决定 Governance truth 是否成立。 | 支撑外围增强:高级治理看板 / 报表 |
| US-GOV-E02 | 作为 Policy / Control 责任人,我希望通过高级规则表达和模拟评估理解策略影响,以便减少策略冲突和误配。 | 外围增强故事 | 提升策略维护质量,但 Policy truth 不依赖具体 DSL 选型。 | 支撑外围增强:Policy DSL / 模拟评估 |
| US-GOV-E03 | 作为 Gate 决策人 / Approver,我希望支持复杂多人评审、升级和替代决策路径,以便高风险场景能被更细粒度治理。 | 外围增强故事 | 增强裁决编排,但基础正式裁决先成立。 | 支撑外围增强:复杂 Gate kind / 评审编排 |
| US-GOV-E04 | 作为 AIIA / SoA 评审人,我希望系统提供影响评估草稿、适用性声明补全和周期性重评建议,以便降低合规维护成本。 | 外围增强故事 | 自动化建议可提升效率,但不得替代正式评审结论。 | 支撑外围增强:AIIA / SoA 自动草拟 / 重评 |
| US-GOV-E05 | 作为审计者 / 合规查看者,我希望把平台治理事实导出或对接外部 GRC / 审计工具,以便满足组织外部审计协作。 | 外围增强故事 | 外部生态增强,不决定平台内部治理事实闭环。 | 支撑外围增强:外部 GRC / 审计集成 |
| US-GOV-E06 | 作为运维 / 后台任务,我希望看到治理容量、延迟、策略传播和报告生成趋势,以便评估治理服务健康度。 | 外围增强故事 | 属于非功能和观测分析,后移 Step 13 / Step 14。 | 支撑外围增强:容量 / 性能 / 报告健康度 |

### 7.3 故事与闭环映射结论

| 闭环节点 | 对应故事 |
|---|---|
| C-GOV-1 治理语境与适用对象能够被确定 | US-GOV-001;US-GOV-002;US-GOV-003 |
| C-GOV-2 关键节点治理裁决能够形成正式结论 | US-GOV-004;US-GOV-005;US-GOV-006 |
| C-GOV-3 治理策略与控制适用约束能够成立 | US-GOV-006;US-GOV-007;US-GOV-008;US-GOV-009;US-GOV-011 |
| C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | US-GOV-010;US-GOV-011;US-GOV-012 |
| C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | US-GOV-002;US-GOV-005;US-GOV-008;US-GOV-013;US-GOV-014 |
| 外围增强 | US-GOV-E01;US-GOV-E02;US-GOV-E03;US-GOV-E04;US-GOV-E05;US-GOV-E06 |

### 7.4 边界外故事排除结论

| 排除项 | 归属 |
|---|---|
| ProcessInstance、Activity、waiting gate state、checkpoint 和恢复 truth | `L1-process` |
| Project、WorkItem、Iteration、blocker、dependency truth | `L1-work` |
| Artifact、Evidence、Baseline、AIIA / SoA 文档正文和版本 | `L1-artifact` |
| conversation fact、Gate 显化、review display 和可见性 | `L1-conversation` / 产品入口 |
| GlobalMember、actor lifecycle、角色定义和认证授权 | `L1-identity` / `L3-method-library` |
| AIPolicyDef、method、template、control definition 正文 | `L3-method-library` |
| runtime enforcement、policy cache、tool loop 和执行事实 | `L2-runtime` / `L2-member-service` |
| capability registration、tool adapter 和工具调用结果 | `L3-capability-hub` |
| audit log store、metrics、trace storage 和 alert stream | `L4-observability` |
| workspace / console UI 状态和外部 GRC 套件 | `L1-workspace`、`L5-console` 或外部系统 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §8。正式文档可摘录本文件 §7.1~§7.3 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 8. 用户故事

> 校准来源:
> - `design-calibration/00_req_step_08_user_stories.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界外故事排除结论”小节,了解本章如何从角色与核心能力闭环收敛用户故事。

本文采用 `design-calibration/00_req_step_08_user_stories.md` §7 的用户故事结论:核心闭环故事覆盖治理语境与适用对象、关键节点治理裁决、治理策略与控制适用、AIIA / SoA / Nonconformity 治理闭环、治理事实消费与追溯;外围增强故事只保留高级治理看板、Policy DSL / 模拟评估、复杂 Gate 编排、AIIA / SoA 自动草拟、外部 GRC / 审计集成和容量 / 性能 / 报告健康度线索,不作为当前核心闭环成立条件。

正式故事表应摘录:

- `design-calibration/00_req_step_08_user_stories.md` §7.1 核心闭环故事结论。
- `design-calibration/00_req_step_08_user_stories.md` §7.2 外围增强故事结论。
- `design-calibration/00_req_step_08_user_stories.md` §7.3 故事与闭环映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留 `GetApplicablePolicies` 接口名式故事 | 原样保留 | 改写为自动化执行者理解治理授权边界 | 推荐 B。原因是 Step 8 不应固定接口和查询名 |
| Q-002 | 是否把 SoA 38 控制项覆盖写进故事 | 写入故事和验收条件 | 写成 AIIA / SoA 治理评审结论目标,覆盖规则后移 | 推荐 B。原因是控制项覆盖属于规则和验收方向 |
| Q-003 | 是否把 runtime / capability-hub 写成正式故事角色 | 写成故事角色 | 写 AI member / 自动化执行者受治理目标,相邻仓消费后移 Step 12 | 推荐 B。原因是相邻仓不是本章角色 |
| Q-004 | 是否把外部 GRC 集成写入核心故事 | 写入核心故事 | 只作为外围增强线索 | 推荐 B。原因是当前阶段无正式外部系统依赖 |
| Q-005 | 是否把 Gate 六段式写入故事表 | 直接写入故事目标 | 保留正式裁决目标,六段式后移 Step 10 / Step 14 | 推荐 B。原因是六段式属于规则和验收 |

当前建议:接受上述推荐后进入 Step 9。

---

## 10. 进入下一步条件

- 已区分核心闭环故事与外围增强故事。
- 每条核心故事都映射到 C-GOV-1~C-GOV-5 至少一个闭环节点。
- 外围增强故事未压过核心故事。
- 已列出边界外故事排除结论。
- 未把角色说明、接口动作、功能名、事件名、业务规则、数据归属、验收条件或实现步骤写成正式用户故事。
