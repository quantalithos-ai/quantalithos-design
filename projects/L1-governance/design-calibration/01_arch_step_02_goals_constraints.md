# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力、§3 约束条件
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 已收稳的需求边界、能力闭环、数据归属和依赖前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。本步不写容器、部署、依赖方向图、技术选型、协议、状态机、数据库或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 作为架构目标与约束的直接输入 |
| `projects/L1-governance/00-需求文档.md` §2 / §3 / §4 / §7 / §10 / §11 / §13 / §14 / §15 | 已重建 | 提取仓定位、问题主线、核心闭环、边界规则、数据归属、非功能、验收和风险 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 验证目标与功能 / 规则 / 数据 / 验收的对应关系 |
| 旧 `projects/L1-governance/01-架构设计.md` | 旧 Draft | 仅作为旧目标、旧技术假设、旧合规硬化和旧性能目标诊断来源 |

---

## 3. SOP 问题回答

### 3.1 这个仓在架构层面要确保什么成立?

`L1-governance` 架构必须确保“治理决策与治理控制事实”作为独立真相成立,并让 process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console、archive 和 external GRC 都围绕同一 Governance truth 协作,而不是各自补造治理结论。

架构层必须守住以下结构性结果:

1. 治理语境与适用对象能作为正式治理事实入口成立,但不复制相邻仓正文。
2. Gate / Approval / Decision 能形成正式、可追溯、可被相邻仓消费的治理裁决结论。
3. Policy effective fact、shared rules、自动化授权边界和 Control 适用 / 复核责任能作为 Governance truth 成立。
4. AIIA / SoA 治理评审结论与 artifact / evidence 正文保持引用关系,不产生第二份正文。
5. Nonconformity 能形成不符合、原因、纠正、复验和关闭的治理纠正闭环,不退化为普通 bug、work blocker 或 observability alert。
6. 治理事实消费、追溯、报告、对账和归档准备只能基于 Governance truth 派生,不得反向创造业务治理结论。
7. 跨仓协作必须通过共享契约、引用、快照、事件、运行期 resolver / adapter、追溯交接或下游消费表达,不得把相邻仓写成编译期依赖。

### 3.2 哪些约束是不可变的?

不可变约束来自需求规则、数据归属、依赖裁剪和验收否决项:

| 约束来源 | 不可变约束 |
|---|---|
| process 边界 | Governance 不拥有 ProcessInstance、Activity、waiting gate state、checkpoint 或 recovery truth |
| work 边界 | Governance 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、dependency 或 blocker truth |
| artifact / archive 边界 | Governance 不拥有 Artifact、Evidence、Baseline、AIIA / SoA 文档正文、ImplementationPlan 正文或 archive package 正文 |
| conversation / UI 边界 | Governance 不拥有 conversation fact、space、participant scope、visibility、Gate 显化卡片、review display 或聊天 UI 状态 |
| identity 边界 | Governance 不拥有 GlobalMember、Actor、Role、认证授权或成员生命周期 truth |
| method-library 边界 | Governance 不拥有 AIPolicyDef、Control definition、ProcessTemplateDef、RoleDefinition、method 或标准正文 source truth |
| runtime / capability 边界 | Governance 不拥有 runtime enforcement、agent loop、tool execution、policy cache 命中、plan item progress、capability registry 或工具调用结果 |
| observability / workspace / external GRC 边界 | Governance 不拥有 audit log store、metrics、trace storage、alert stream、workspace / console UI 状态或外部 GRC truth |
| 依赖边界 | `L0-core` 是唯一编译期上游;其他仓不得成为 package dependency |
| 写 / 读 / 维护边界 | 查询、投影、报告、对账、归档准备和维护任务不得隐式创建、修改、批准或关闭治理事实 |

### 3.3 哪些约束是当前阶段可以接受的取舍?

当前可接受取舍只覆盖 Governance 潜在能力范围内的架构收缩,不把边界外事项伪装为取舍:

| 取舍对象 | 当前处理 |
|---|---|
| 高级治理看板与跨项目报表 | 当前作为消费增强处理,架构只保留派生 / 查询边界,不把高级视图作为 Governance 主结构 |
| Policy DSL 与模拟评估 | 当前作为 Policy 维护增强处理,不把具体 DSL、规则引擎或模拟器硬化为架构前提 |
| 复杂 Gate 编排、多人评审、升级和替代路径 | 当前作为裁决编排增强处理,基础 Gate / Approval / Decision truth 先成立 |
| AIIA / SoA 自动草拟和周期重评建议 | 当前作为评审输入增强处理,不得替代正式治理评审结论 |
| 外部 GRC / 审计工具集成 | 当前作为导出和下游消费增强处理,不把外部 GRC 作为 Governance truth 来源 |
| 容量、延迟、策略传播和报告健康度分析 | 当前作为候选质量目标和观测分析线索,不作为核心闭环成立前置 |
| 旧 `150ms / 200ms / 50ms / 30s / 99.95%` 指标 | 当前作为候选 SLO 和后续测试输入,不作为架构已验证硬指标 |
| 存储、规则表达、审计物理存储和报表实现形态 | 当前不在 Step 2 锁定,后续由数据一致性、技术选型、配置和测试阶段收敛 |

### 3.4 哪些目标可以明确判断,甚至量化?

当前可以明确判断的目标是结构目标,不是实现指标:

| 目标类型 | 当前判断 |
|---|---|
| 真相独立性 | 必须成立。Governance truth 不能被 process waiting、work lifecycle、artifact body、runtime cache、conversation UI 或 observability alert 覆盖或替代。 |
| 核心闭环 | 必须成立。C-GOV-1~C-GOV-5 是当前架构主线。 |
| 边界保护 | 必须成立。正文入仓、truth 串仓、runtime / method 反向定义 Policy truth、非 core 编译依赖均为否决。 |
| 可追溯性 | 必须成立。治理语境、裁决、Policy / Control、AIIA / SoA、Nonconformity、消费和维护均要可解释。 |
| 幂等 / 一致性 | 必须成立。重复输入不得产生重复治理事实或分叉结论,正式裁决不得原地改写。 |
| shared rules 保护 | 必须成立。组织级硬约束不得被 project、role、member 或低层 scope 覆盖。 |
| 旧性能数字 | 当前不能量化为硬目标。`150ms / 200ms / 50ms / 30s / 99.95%` 只作为后续压测和容量评估候选。 |

### 3.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题?

| 相关事项 | 当前架构判断 |
|---|---|
| ProcessInstance、Activity、waiting gate、checkpoint、recovery | 由 `L1-process` 拥有,Governance 只承载正式治理裁决和可消费结论 |
| Project、WorkItem、Iteration、dependency、blocker、ProjectMember | 由 `L1-work` 拥有,Governance 只消费治理语境并输出治理约束 / 裁决结论 |
| Artifact、Evidence、Baseline、AIIA / SoA 文档正文、ImplementationPlan 正文 | 由 `L1-artifact` / archive 相关仓拥有,Governance 只承载治理结论和引用 |
| Conversation fact、Gate 显化卡片、review display、Chat UI | 由 `L1-conversation` / 产品入口拥有,Governance 只提供事实和管理语境 |
| GlobalMember、Actor、Role、认证授权、成员生命周期 | 由 `L1-identity` / `L0-core` 和安全 / 授权边界拥有 |
| AIPolicyDef、ControlDefinition、method、template、标准正文 | 由 `L3-method-library` 拥有,Governance 只消费定义来源并形成生效事实 |
| Runtime enforcement、agent loop、tool execution、policy cache、capability registry | 由 `L2-runtime` / `L2-member-service` / `L3-capability-hub` 拥有 |
| audit log store、metrics、trace storage、alert stream | 由 `L4-observability` 拥有,Governance 只拥有治理追溯事实和交接材料 |
| workspace / console UI 状态、外部 GRC 套件 | 由产品层或外部系统拥有,Governance 提供事实供消费或导出 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §1~§3 | 把 Gate 六段式、SoA 38 控制项、旧性能数字和旧技术假设直接写成架构目标 | 新版需求已将旧数字和部分合规细节降为候选或后续细化项 | Step 2 只从 Governance truth 边界和核心闭环推导架构目标 |
| 旧 `01-架构设计.md` | 把 PostgreSQL、audit store、外部 GRC 和 report system 假设混入目标 / 约束 | 这些属于技术选型、配置或外部集成候选,不是 Step 2 结论 | 后移到技术选型、配置设计和实施阶段 |
| 旧 `01-架构设计.md` | Gate / Policy / Control / AIIA / SoA / Nonconformity 与实现聚合草案混写 | 缺少从新版需求边界到结构目标的转译 | Step 2 只保留结构性架构目标,不写对象 schema |
| 旧 `01-架构设计.md` | 外围增强和核心闭环混杂 | 容易把高级看板、Policy DSL、复杂 Gate 编排、自动草拟和外部 GRC 误写为当前主线 | 本步明确当前阶段可接受取舍 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构目标表达 | 偏功能、技术和旧合规硬化 | 改为 Governance truth、核心闭环、数据边界、追溯和协作边界的结构性结果 | 对齐架构规范 4.2 |
| 不可变约束 | 旧边界不完整,且混入存储和 SLA | 覆盖 process、work、artifact、conversation、identity、method-library、runtime、capability、observability、workspace、archive、external GRC 和依赖裁剪 | 对齐新版需求和 Step 1 |
| 当前取舍 | 未清晰区分,外围增强容易变成硬目标 | 明确高级看板、Policy DSL、复杂 Gate、自动草拟、外部 GRC、候选 SLO 和实现形态的当前口径 | 防止范围膨胀和伪量化 |
| 架构非目标 | 分散在职责边界和依赖描述中 | 形成独立非目标表 | 便于后续审查和追溯 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继续沿用旧架构目标、旧 SLA 和旧技术假设 | 复用快 | 与新版需求和 SOP 分层不一致 | 不采用 |
| 方案 B: 从新版需求基线重新推导架构目标与约束 | 可追溯,边界完整 | 需要重写正式架构文档 | 采用 |
| 方案 C: Step 2 直接选择数据库、规则引擎、审计存储和外部 GRC 集成 | 推进看似更快 | 越过数据一致性、技术选型和配置步骤 | 不采用 |
| 方案 D: 把所有外围增强都列为非目标 | 范围最小 | 会丢失 Governance 后续演进线索 | 不采用,改列为当前阶段取舍 |

### 6.1 待确认问题的方案选择

#### Policy DSL / 规则引擎是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构主线固定 DSL / engine | 会把实现形态提前硬化,也可能让 Policy truth 依赖某个工具形态 |
| 方案 B | 当前只要求 Policy effective fact、shared rules、scope、priority 和 conflict 语义可成立 | 保留实现空间,对齐 Step 2 分层 |

推荐方案 B。

#### 复杂 Gate 编排是否进入当前硬目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构必须覆盖复杂多人评审、升级和替代路径 | 会扩大核心闭环并提前定义编排状态 |
| 方案 B | 当前架构守住基础 Gate / Approval / Decision truth,复杂编排作为增强能力 | 与需求外围增强口径一致 |

推荐方案 B。

#### 旧性能数字是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接作为硬架构目标 | 与需求 §13 / §15 冲突,缺少正式负载模型和验证来源 |
| 方案 B | 作为候选 SLO 和后续测试输入 | 保留旧线索,不伪量化 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

Quantalithos 要求 AI member 在受控、可审计、可追责的框架下工作。关键节点谁来决定、依据什么策略、哪些控制适用、影响评估和适用性声明是否成立、不符合如何纠正,这些结论会被 process、work、artifact、conversation、runtime、workspace、observability 和 archive 共同引用。`L1-governance` 值得单独做架构设计,是因为这些治理事实如果散落在流程等待、工作状态、产物正文、运行缓存、对话显化或外部 GRC 中,就会形成多份互相冲突的治理结论。

### 7.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 治理决策真相需要独立承载 | Gate / Approval / Decision 不能由 process waiting、work lifecycle、conversation UI 或 runtime cache 隐式替代 |
| 治理控制事实需要独立承载 | Policy effective fact、shared rules、Control 适用 / 复核责任不能被 method definition、runtime cache 或 capability whitelist 反向定义 |
| 合规结论与正文来源必须分离 | AIIA / SoA / Control 结论需要引用 artifact、evidence、standard 和 method 来源,但不得复制正文 |
| 纠正闭环需要保持治理语义 | Nonconformity 不能退化为普通 bug、work blocker、observability alert 或维护备注 |
| 消费与维护不能反写真相 | read model、report、dashboard、对账、归档准备和维护任务必须有明确边界 |
| 跨仓协作必须裁剪依赖 | 除 `L0-core` 外不得把相邻仓变成编译期依赖 |

### 7.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的治理决策与治理控制事实真相 | 否则 Governance 会退化为审批 UI、策略缓存、合规文档副本、审计流水或外部 GRC 适配层。 |
| 支撑治理语境与适用对象作为正式治理入口成立 | 否则裁决、Policy、Control 和合规结论会与相邻仓对象脱锚。 |
| 支撑 Gate / Approval / Decision 形成可追溯正式结论 | 否则关键节点会被 process waiting、work 状态、conversation UI 或 runtime cache 隐式决定。 |
| 支撑 Policy effective fact、shared rules 和自动化授权边界成立 | 否则执行层、定义层或工具能力会反向定义治理策略。 |
| 支撑 Control、AIIA / SoA 和 Nonconformity 形成治理闭环 | 否则控制适用、影响评估、适用性声明和不符合纠正会退化为正文、备注或告警。 |
| 稳定区分 Governance truth、外部快照、外部引用、派生视图和禁止正文 | 否则相邻仓正文、运行正文、观测正文、UI 正文或外部 GRC 正文会污染治理事实。 |
| 允许相邻仓通过引用、快照、事件、运行期边界和追溯交接协作 | 否则 Governance 要么吸收相邻仓 truth,要么无法被相邻仓稳定消费。 |
| 守住写路径、读路径、维护路径和归档准备路径的真相边界 | 否则查询、报告、对账或维护任务会成为隐藏业务写源。 |
| 支撑关键治理变化、消费和维护动作可解释 | 否则治理事实无法支撑审计、复盘、责任解释和归档交接。 |

### 7.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不拥有 process execution truth | 否则 Gate / Decision 会与 ProcessInstance、Activity、waiting gate、checkpoint 或 recovery 混成同一真相。 |
| 不拥有 work truth | 否则 Project、WorkItem、Iteration、dependency、blocker 或成员承担会被治理裁决替代。 |
| 不拥有 artifact、evidence、AIIA / SoA 或 archive 正文 | 否则治理结论会成为第二份产物、证据或归档正文。 |
| 不拥有 conversation fact、Gate 显化卡片、review display 或聊天 UI 状态 | 否则 UI 显化会变成治理事实来源。 |
| 不拥有 GlobalMember、Actor、Role、认证授权或成员生命周期 truth | 否则 Governance 会打穿 identity 和安全入口边界。 |
| 不拥有 AIPolicyDef、Control definition、method、template 或标准正文 source truth | 否则定义来源会被治理生效事实替代。 |
| 不拥有 runtime enforcement、agent loop、tool execution、policy cache 或 capability registry | 否则执行层和工具层会污染 Policy truth。 |
| 不拥有 audit log store、metrics、trace storage、alert stream、workspace / console UI 状态或 external GRC truth | 否则 Governance 会膨胀为观测、工作台或外部系统总仓。 |
| 不允许低 scope Policy 覆盖 shared rules 或组织级硬约束 | 否则组织级治理安全边界失效。 |
| 不允许正式裁决原地改写 | 否则决策历史、责任语境和下游消费结论无法追溯。 |
| 不允许 query、projection、report、reconciliation、archive preparation 或 maintenance 写业务治理真相 | 否则派生和维护能力会成为隐式写源。 |
| 不允许除 `L0-core` 外形成编译期依赖 | 否则 L1 平权真相域会形成循环和强耦合。 |

### 7.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 高级治理看板与跨项目报表 | 当前作为消费增强处理,只从 Governance truth 派生,不成为架构主结构。 |
| Policy DSL、冲突模拟和影响评估工具 | 当前作为 Policy 维护增强处理,不进入核心闭环前置。 |
| 复杂 Gate kind、多人评审、升级和替代路径 | 当前作为裁决编排增强处理,基础正式裁决先成立。 |
| AIIA / SoA 自动草拟、补全和周期重评建议 | 当前作为评审输入增强处理,不得替代正式治理结论。 |
| 外部 GRC / 审计工具集成 | 当前作为导出和外部消费增强处理,不作为 Governance truth 来源。 |
| 容量、延迟、策略传播和报告健康度分析 | 当前作为候选非功能和观测分析线索,不阻塞核心闭环。 |
| 旧性能 / SLA 数字 | 当前作为候选 SLO 和后续测试输入,不写成已验证硬指标。 |
| 存储、规则引擎、审计物理存储和报表实现 | 当前不在 Step 2 锁定,后续由数据一致性、技术选型、配置和测试阶段决定。 |

### 7.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Process 执行架构 | ProcessInstance、Activity、waiting gate、checkpoint 和 recovery truth 属于 `L1-process`。 |
| 不设计 Work 项目 / 工作项 / 迭代架构 | Project、WorkItem、Iteration、dependency、blocker 和项目成员 truth 属于 `L1-work`。 |
| 不设计 Artifact / Evidence / Archive 正文架构 | 产物、证据、基线、实施计划、AIIA / SoA 文档正文和归档包正文属于 artifact / archive 相关仓。 |
| 不设计 Conversation 显化和 Chat UI 架构 | conversation fact、Gate 卡片、review display 和聊天界面属于 `L1-conversation` / 产品入口。 |
| 不设计 Identity 生命周期、认证和授权架构 | GlobalMember、Actor、Role、认证授权和成员生命周期属于 `L1-identity` / `L0-core` 和安全 / 授权边界。 |
| 不设计 Method Library 定义架构 | AIPolicyDef、Control definition、method、template 和标准正文属于 `L3-method-library`。 |
| 不设计 Runtime / Capability 执行架构 | agent loop、tool invocation、policy cache、capability registry 和工具调用结果属于 L2 / L3 运行与能力层。 |
| 不设计 Observability 物理审计存储架构 | metrics、trace storage、audit log store 和 alert stream 属于 `L4-observability`。 |
| 不设计 Workspace / Console 聚合 UI 架构 | dashboard、inbox、管理入口和 UI 状态属于产品入口和 workspace / console。 |
| 不设计外部 GRC 系统架构 | 外部 GRC 是下游消费或导出对象,不是 Governance 内部架构主线。 |
| 不在架构目标层定义 API / DTO / 状态机 / 数据库表 | 这些属于概要、详细、配置、测试或实施阶段。 |

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“设计取舍”小节,了解本章如何把需求闭环转译为架构目标。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §7.1 业务背景结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.2 驱动力结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.3 架构目标表。
```

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构硬约束结论”“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”小节,了解本章约束如何从需求边界和架构目标收敛而来。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §7.4 不可变约束表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.5 当前阶段可接受取舍表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.6 架构非目标表。
```

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。已知待确认项沿用 Step 1 的风险清单,后续分别在职责边界、数据所有权、技术选型、演进路线和风险章节承接。

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| Q-001 | 旧性能 / SLA 数字是否升级为正式测试目标 | 当前作为候选 SLO,后续测试方案和容量验证阶段决定 |
| Q-002 | Policy DSL / engine 是否进入正式架构机制 | 当前不在 Step 2 定稿,后续技术选型阶段论证 |
| Q-003 | 外部 GRC / 审计工具是否进入主链集成 | 当前作为外围增强和下游消费处理 |
| Q-004 | 复杂 Gate 编排与自动裁决的详细授权规则 | 当前只保留正式授权、责任语境和不可绕过裁决原则,后续详细设计收敛 |

---

## 10. 进入下一步条件

- 已明确架构必须确保成立的结构性目标。
- 已明确不可变约束、当前阶段取舍和架构非目标。
- 未提前进入系统上下文图、容器、部署、数据库、技术选型、DTO 或状态机。
- 可以进入 Step 3“职责边界”。
