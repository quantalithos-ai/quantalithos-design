# Step 9. 功能需求

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 9
> 回填章节: `00-需求文档.md` §9 功能需求
> 生成日期: 2026-06-06

---

## 1. 本步目标

把 Step 8 的用户故事归并为 `L1-governance` 必须提供的业务能力,并区分核心闭环能力与外围增强能力。本步不按对象 CRUD、API、Command、事件、DTO、状态机、数据库表、Policy DSL、Gate 六段式、SoA 控制项覆盖或代码模块拆分功能,也不把用户故事原样改写成功能项。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-GOV-1~C-GOV-5 核心能力闭环 |
| `design-calibration/00_req_step_08_user_stories.md` | Step 8 已完成 | 作为功能归并的直接故事输入 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 防止功能越界到 process / work / artifact / conversation / identity / method-library / runtime / observability / workspace |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定编译期、运行期和事件协作边界 |
| 旧 `projects/L1-governance/00-需求文档.md` §6 | 旧版功能清单 | 作为 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity 能力线索,不继承接口、规则、非功能和依赖混写 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取治理事实能力线索,不继承字段、状态机、RPC、事件名或持久化组织 |

---

## 3. SOP 问题回答

### 3.1 根据这些用户故事,系统必须提供哪些业务能力？

`L1-governance` 必须提供的业务能力不是旧文档中的 `RaiseGate`、`DecideGate`、`GetApplicablePolicies`、`PublishSoA` 或 `RaiseNonconformity` 这类接口 / 功能名,而是围绕治理决策与治理控制事实闭环形成的能力主题:

1. 治理语境与适用对象确定能力。
2. 治理输入收束与可裁决语境形成能力。
3. 关键节点正式治理裁决能力。
4. 自动化治理边界表达能力。
5. Policy 生效与授权约束能力。
6. Control 适用与复核责任能力。
7. AIIA / SoA 治理评审结论能力。
8. Nonconformity 纠正闭环能力。
9. 治理事实消费与追溯能力。
10. 治理事实维护、对账、报告和归档准备能力。

这些能力共同支撑核心闭环。旧文档中的 Policy DSL、Gate kind 扩展、SoA 38 控制项、P95、Policy 下发时延、外部 GRC 对接和审计报表只作为后续规则、接口、非功能、验收或外围增强线索,不能在需求层被直接写成核心功能。

### 3.2 每个能力的输入、输出、触发条件、失败情况是什么？

需求阶段只写能力级输入、输出、触发和失败,不写字段、DTO、函数、事件 schema、状态枚举、事务处理或 adapter 设计。

| 能力 | 能力级输入 | 能力级输出 | 触发条件 | 失败情况 |
|---|---|---|---|---|
| 治理语境与适用对象确定能力 | actor / member / role 引用、治理范围、相邻仓对象引用或 safe summary、治理目的 | 可被裁决、策略和控制复用的治理语境与适用对象锚点 | 人类或系统需要把项目、过程、工作、产物、能力或自动化行为放入治理语境 | actor / scope 不可解析;适用对象缺少稳定引用;输入试图复制相邻仓 truth |
| 治理输入收束与可裁决语境形成能力 | 系统触发、周期复核、风险信号、相邻仓请求、必要 evidence / artifact / method 引用 | 可解释的治理输入或待裁决语境 | 高风险路径、周期性复核、控制异常、自动化升级或相邻仓请求治理 | 触发来源不可追溯;上下文不足以裁决;输入把运行时执行事实或审计日志误当治理结论 |
| 关键节点正式治理裁决能力 | 治理语境、裁决请求、决策责任语境、裁决依据和必要引用 | 正式治理裁决结论及其可追溯依据 | 关键节点需要人类或正式授权策略决定继续、停止、调整或要求补充 | 决策责任不清;裁决依据不足;试图由 process waiting state、work lifecycle 或 UI 状态替代 decision truth |
| 自动化治理边界表达能力 | AI member / 自动化执行者引用、适用策略、自治边界、升级语境 | 自动化行为可解释的治理边界和升级要求 | 自动化执行可能触及高风险动作、工具能力、策略约束或人工裁决边界 | runtime cache 缺失被误当 Policy truth;自动化试图绕过裁决;工具执行事实被写成治理事实 |
| Policy 生效与授权约束能力 | 策略定义引用、治理范围、优先级语境、适用对象和责任人语境 | 正式 Policy 生效、授权和约束事实 | 组织、项目、角色、成员或能力需要确定当前治理策略 | 定义来源不可解析;范围冲突不可解释;低层语境试图覆盖高层约束 |
| Control 适用与复核责任能力 | 控制定义引用、适用范围、责任语境、实施 / 复核线索 | 控制适用、实施和复核责任的治理事实 | 需要把标准控制语义落到项目、过程、产物或自动化行为的治理语境 | 控制定义缺失;复核责任不清;标准原文或文档正文被误存为治理 truth |
| AIIA / SoA 治理评审结论能力 | artifact / evidence 引用、控制适用语境、影响评估或适用性声明语境、评审责任语境 | AIIA / SoA 的治理评审、适用性、覆盖和批准结论 | 影响评估、适用性声明或合规边界需要治理评审 | artifact 正文缺失或不可引用;评审结论与正文来源脱锚;治理仓试图保存第二份文档正文 |
| Nonconformity 纠正闭环能力 | 不符合来源、控制或策略语境、原因 / 纠正 / 复验责任语境、必要引用 | 不符合、纠正、复验和关闭的治理闭环事实 | 控制异常、审计发现、策略违反或人工上报需要正式治理处置 | 来源不可追溯;纠正责任不清;普通 bug、work blocker 或 observability alert 被误写成本仓 truth |
| 治理事实消费与追溯能力 | 治理事实读取需求、相邻仓消费语境、审计 / 合规查看语境 | 可授权消费、可解释、可回链的治理事实视图和追溯材料 | 相邻仓、审计者、项目负责人或自动化执行者需要理解治理结论 | 请求方无权读取;派生视图滞后且无法解释;消费方反向定义治理 truth |
| 治理事实维护、对账、报告和归档准备能力 | 派生结果、对账输入、报告需求、归档 / 恢复切片语境 | 不改变业务结论的维护结果、对账材料、报告和归档准备材料 | 后台任务或运维需要维护消费面一致性、生成报告或准备归档 | 维护动作试图改变业务治理结论;报告来源不完整;归档材料复制相邻仓正文 |

### 3.3 哪些能力共同构成闭环核心?哪些只是外围增强?

核心闭环能力是没有它就无法成立 `L1-governance` 的能力;外围增强能力可以提升表达力、自动化、展示、集成或运行治理,但不决定治理事实是否成立。

| 分类 | 能力 |
|---|---|
| 核心闭环能力 | 治理语境与适用对象确定;治理输入收束与可裁决语境形成;关键节点正式治理裁决;自动化治理边界表达;Policy 生效与授权约束;Control 适用与复核责任;AIIA / SoA 治理评审结论;Nonconformity 纠正闭环;治理事实消费与追溯;治理事实维护、对账、报告和归档准备 |
| 外围增强能力 | 高级治理看板与报表;Policy DSL 与模拟评估;复杂 Gate 编排与升级路径;AIIA / SoA 自动草拟和周期重评建议;外部 GRC / 审计工具集成;容量、延迟、策略传播和报告健康度分析 |
| 边界外能力 | process waiting / recovery;work 项目事实;artifact / evidence 正文;conversation 显化;identity 生命周期;method definition;runtime enforcement;capability registry;observability 存储;workspace / console UI 状态 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §6.1 | F-001~F-014 直接列 Gate 六段式、Approval 实体、Policy 聚合、GetApplicablePolicies、Control、AIIA、SoA、Nonconformity、下游事件扇出 | 对象、接口、规则、依赖和非功能混写 | 改为能力主题,对象和接口后移设计与 Step 12 |
| 旧 `00-需求文档.md` §6.2 | 业务规则表直接列 Gate 缺段、candidate_options、autonomy_level、shared_rules、SoA 覆盖 | 规则与功能混在一起 | 规则后移 Step 10 |
| 旧 `00-需求文档.md` §6.3 | 功能依赖图写 Gate、Policy、Control、AIIA / SoA 对象链和下游事件 | 图有线索价值,但仍是对象 / 依赖图 | 后续概要 / 详细设计或接口与依赖可参考,不作为功能需求 |
| 旧 `00-需求文档.md` §7 | P95、Policy 下发时延、SLA、记录规模和覆盖率 | 非功能和验收候选混入功能价值判断 | 后移 Step 13 / Step 14 |
| `domain/governance/README.md` | 详细字段、状态机、RPC、事件名和 47 条不变量丰富 | 可作线索,但不能直接进入 Step 9 | 后续 Step 10~Step 12 / 03 详细设计再裁剪 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能组织方式 | Gate / Policy / Control / AIIA / SoA 对象和接口动作清单 | 核心闭环能力 + 外围增强能力 | 对齐需求规范,支撑追溯矩阵 |
| Gate 表达 | RaiseGate / DecideGate / 六段式完整 | 关键节点正式治理裁决能力 | 保留裁决价值,规则和接口后移 |
| Policy 表达 | GetApplicablePolicies / Policy Cache / DSL | Policy 生效与授权约束能力 | 防止查询接口、runtime cache 和 DSL 反向定义 Policy truth |
| Control 表达 | 42001 控制项和 violation 处理 | Control 适用与复核责任能力 | 保留控制治理价值,不复制标准原文 |
| AIIA / SoA 表达 | 发布文档、38 控制项覆盖和 artifact 双身份 | AIIA / SoA 治理评审结论能力 | 正文和 evidence 归 artifact,治理只拥有结论 |
| Nonconformity 表达 | Control 被违反时自动创建对象 | Nonconformity 纠正闭环能力 | 自动触发和状态机后移,能力层先表达纠正闭环 |
| 消费表达 | gate.decided 下游事件扇出 | 治理事实消费与追溯能力 | 事件名和 payload 后移 Step 12 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 保留旧 F-001~F-014 | 覆盖面广,接近旧实现想象 | 接口、对象、规则、依赖、非功能和验收混写,无法直接追溯闭环 | 不采用 |
| 方案 B: 按核心闭环归并能力主题 | 能从故事追到能力,也能给规则、数据、接口和验收提供结构锚点 | 后续需要再拆规则、接口和对象 | 采用 |
| 方案 C: 只保留 Gate / Policy 两类功能 | 文档短,聚焦高频能力 | 会漏掉 Control、AIIA、SoA 和 Nonconformity 的治理控制闭环 | 不采用 |
| 方案 D: 把外围增强全部删除 | 核心非常清晰 | 会丢失旧文档中已识别的高级策略、评审编排、自动化、外部审计和性能线索 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 `GetApplicablePolicies` 写成核心功能?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为核心功能原样保留 | 会把查询 surface 和 runtime 消费方式提前写进功能需求 |
| 方案 B | 归入 Policy 生效与授权约束能力、治理事实消费与追溯能力 | 保留业务价值,接口后移 Step 12 |

推荐方案 B。原因是 Step 9 应表达业务能力,不是固定 API 名称。

#### 是否把 Gate 六段式写成功能?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成独立核心功能 | 会把具体规则和字段结构提前写进功能需求 |
| 方案 B | 归入关键节点正式治理裁决能力 | 保留裁决价值,六段式后移 Step 10 / Step 14 |

推荐方案 B。原因是六段式属于规则和验收方向。

#### 是否把 SoA 38 控制项覆盖写成功能?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成独立功能 | 会把具体标准覆盖规则提前写入功能章节 |
| 方案 B | 归入 AIIA / SoA 治理评审结论能力和 Control 适用与复核责任能力 | 保留合规价值,规则后移 Step 10 |

推荐方案 B。原因是控制项覆盖属于规则、数据归属和验收共同约束。

#### 是否把外部 GRC / 审计工具集成写入核心功能?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写入核心功能 | 会引入当前阶段未确认的外部依赖 |
| 方案 B | 作为外围增强能力 | 保留后续方向,不阻塞当前核心闭环 |

推荐方案 B。原因是 Step 6 已确认当前阶段无正式外部系统依赖。

---

## 7. 结构化中间产物

### 7.1 功能需求结论

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| FR-GOV-001 | 治理语境与适用对象确定 | 核心闭环能力 | 系统必须支持把 actor、scope、相邻仓对象引用、治理目的和责任语境收束为可被裁决、策略和控制复用的治理上下文。 | C-GOV-1 治理语境与适用对象能够被确定 | US-GOV-001;US-GOV-002 |
| FR-GOV-002 | 治理输入收束与可裁决语境形成 | 核心闭环能力 | 系统必须支持把系统触发、周期复核、风险信号和相邻仓请求收束为可解释治理输入,但不让自动化直接创造治理结论。 | C-GOV-1 治理语境与适用对象能够被确定 | US-GOV-002;US-GOV-003 |
| FR-GOV-003 | 关键节点正式治理裁决 | 核心闭环能力 | 系统必须支持关键节点形成正式、可追溯、可被相邻仓消费的治理裁决,而不是由 process waiting state、work lifecycle、conversation UI 或本地提示隐式决定。 | C-GOV-2 关键节点治理裁决能够形成正式结论 | US-GOV-004;US-GOV-005 |
| FR-GOV-004 | 自动化治理边界表达 | 核心闭环能力 | 系统必须支持表达 AI member 和自动化执行者在当前语境下的治理授权、停止自动推进和升级裁决边界,但不拥有 runtime 执行 truth。 | C-GOV-2 关键节点治理裁决能够形成正式结论;C-GOV-3 治理策略与控制适用约束能够成立 | US-GOV-006;US-GOV-009 |
| FR-GOV-005 | Policy 生效与授权约束 | 核心闭环能力 | 系统必须支持 Policy 的生效范围、优先级、授权和适用约束成为治理事实,并与定义来源、runtime cache 和工具白名单保持边界。 | C-GOV-3 治理策略与控制适用约束能够成立 | US-GOV-007;US-GOV-008;US-GOV-009 |
| FR-GOV-006 | Control 适用与复核责任 | 核心闭环能力 | 系统必须支持控制适用、实施和复核责任的治理事实,使控制项不是静态标准引用或 artifact 正文。 | C-GOV-3 治理策略与控制适用约束能够成立;C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | US-GOV-007;US-GOV-011 |
| FR-GOV-007 | AIIA / SoA 治理评审结论 | 核心闭环能力 | 系统必须支持影响评估和适用性声明形成治理评审、适用性、覆盖和批准结论,同时只引用 artifact / evidence 正文。 | C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | US-GOV-010;US-GOV-013 |
| FR-GOV-008 | Nonconformity 纠正闭环 | 核心闭环能力 | 系统必须支持不符合、原因、纠正、复验和关闭形成正式治理闭环,而不是普通 bug、work blocker 或 observability alert。 | C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | US-GOV-012;US-GOV-013 |
| FR-GOV-009 | 治理事实消费与追溯 | 核心闭环能力 | 系统必须支持审计者、项目负责人、自动化执行者和相邻仓以授权方式消费并追溯治理语境、裁决、策略、控制、评审和纠正事实。 | C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | US-GOV-002;US-GOV-005;US-GOV-008;US-GOV-013 |
| FR-GOV-010 | 治理事实维护、对账、报告和归档准备 | 核心闭环能力 | 系统必须支持后台任务在不改变业务治理结论的前提下维护派生结果、对账、生成报告并准备归档 / 恢复材料。 | C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | US-GOV-014 |
| FR-GOV-E01 | 高级治理看板与报表 | 外围增强能力 | 系统可进一步支持跨项目治理看板、筛选、趋势和管理报表,以提升治理管理效率。 | 外围增强能力 | US-GOV-E01 |
| FR-GOV-E02 | Policy DSL 与模拟评估 | 外围增强能力 | 系统可进一步支持高级策略表达、冲突模拟和影响评估,但 Policy truth 不依赖具体 DSL 选型。 | 外围增强能力 | US-GOV-E02 |
| FR-GOV-E03 | 复杂 Gate 编排与升级路径 | 外围增强能力 | 系统可进一步支持复杂多人评审、升级和替代决策路径,但基础正式裁决先成立。 | 外围增强能力 | US-GOV-E03 |
| FR-GOV-E04 | AIIA / SoA 自动草拟和周期重评建议 | 外围增强能力 | 系统可进一步提供影响评估草稿、适用性声明补全和重评建议,但不得替代正式治理评审结论。 | 外围增强能力 | US-GOV-E04 |
| FR-GOV-E05 | 外部 GRC / 审计工具集成 | 外围增强能力 | 系统可进一步导出或对接外部 GRC / 审计工具,但当前阶段不把外部系统作为核心前置。 | 外围增强能力 | US-GOV-E05 |
| FR-GOV-E06 | 容量、延迟、策略传播和报告健康度分析 | 外围增强能力 | 系统可进一步提供治理服务健康度分析,相关指标后移非功能需求评估。 | 外围增强能力 | US-GOV-E06 |

### 7.2 能力类型结论

| 能力类型 | 功能需求 |
|---|---|
| 核心闭环能力 | FR-GOV-001;FR-GOV-002;FR-GOV-003;FR-GOV-004;FR-GOV-005;FR-GOV-006;FR-GOV-007;FR-GOV-008;FR-GOV-009;FR-GOV-010 |
| 外围增强能力 | FR-GOV-E01;FR-GOV-E02;FR-GOV-E03;FR-GOV-E04;FR-GOV-E05;FR-GOV-E06 |
| 边界外能力 | process waiting / recovery;work 项目事实;artifact / evidence 正文;conversation 显化;identity 生命周期;method definition;runtime enforcement;capability registry;observability 存储;workspace / console UI 状态 |

### 7.3 闭环映射结论

| 闭环节点 | 功能需求 |
|---|---|
| C-GOV-1 治理语境与适用对象能够被确定 | FR-GOV-001;FR-GOV-002 |
| C-GOV-2 关键节点治理裁决能够形成正式结论 | FR-GOV-003;FR-GOV-004 |
| C-GOV-3 治理策略与控制适用约束能够成立 | FR-GOV-004;FR-GOV-005;FR-GOV-006 |
| C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | FR-GOV-006;FR-GOV-007;FR-GOV-008 |
| C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | FR-GOV-009;FR-GOV-010 |
| 外围增强 | FR-GOV-E01;FR-GOV-E02;FR-GOV-E03;FR-GOV-E04;FR-GOV-E05;FR-GOV-E06 |

### 7.4 故事映射结论

| 用户故事 | 功能需求 |
|---|---|
| US-GOV-001 | FR-GOV-001 |
| US-GOV-002 | FR-GOV-001;FR-GOV-002;FR-GOV-009 |
| US-GOV-003 | FR-GOV-002 |
| US-GOV-004 | FR-GOV-003 |
| US-GOV-005 | FR-GOV-003;FR-GOV-009 |
| US-GOV-006 | FR-GOV-004 |
| US-GOV-007 | FR-GOV-005;FR-GOV-006 |
| US-GOV-008 | FR-GOV-005;FR-GOV-009 |
| US-GOV-009 | FR-GOV-004;FR-GOV-005 |
| US-GOV-010 | FR-GOV-007 |
| US-GOV-011 | FR-GOV-006 |
| US-GOV-012 | FR-GOV-008 |
| US-GOV-013 | FR-GOV-007;FR-GOV-008;FR-GOV-009 |
| US-GOV-014 | FR-GOV-010 |
| US-GOV-E01 | FR-GOV-E01 |
| US-GOV-E02 | FR-GOV-E02 |
| US-GOV-E03 | FR-GOV-E03 |
| US-GOV-E04 | FR-GOV-E04 |
| US-GOV-E05 | FR-GOV-E05 |
| US-GOV-E06 | FR-GOV-E06 |

### 7.5 边界外能力排除结论

| 排除能力 | 不进入原因 | 正确归属 |
|---|---|---|
| ProcessInstance、Activity、waiting gate state、checkpoint 和恢复 truth | Governance 只拥有 decision / policy / control truth,不拥有过程执行状态 | `L1-process` |
| Project、WorkItem、Iteration、blocker、dependency truth | Governance 只引用或约束工作对象,不维护工作事实 | `L1-work` |
| Artifact、Evidence、Baseline、AIIA / SoA 文档正文和版本 | Governance 只保存治理结论、适用性、引用和必要摘要 | `L1-artifact` |
| conversation fact、Gate 显化、review display 和可见性 | Governance 提供可显化事实,不拥有对话 truth 或 UI 状态 | `L1-conversation` / 产品入口 |
| GlobalMember、actor lifecycle、角色定义和认证授权 | Governance 只引用 actor / member / role | `L1-identity` / `L3-method-library` |
| AIPolicyDef、method、template、control definition 正文 | Governance 消费定义或快照,不拥有定义 source truth | `L3-method-library` |
| runtime enforcement、policy cache、tool loop 和执行事实 | Governance 提供 Policy / authorization truth,不执行工具或维护 cache truth | `L2-runtime` / `L2-member-service` |
| capability registration、tool adapter 和工具调用结果 | Governance 可约束能力使用,不注册或执行能力 | `L3-capability-hub` |
| audit log store、metrics、trace storage 和 alert stream | Governance facts 可被审计,但不拥有观测物理存储 | `L4-observability` |
| workspace / console UI 状态和外部 GRC 套件 | Governance 提供事实和管理语境,不拥有聚合 UI 或外部系统 truth | `L1-workspace`、`L5-console` 或外部系统 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §9。正式文档可摘录本文件 §7.1~§7.4 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 9. 功能需求

> 校准来源:
> - `design-calibration/00_req_step_09_functional_requirements.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界外能力排除结论”小节,了解本章如何从用户故事归并为业务能力。

本文采用 `design-calibration/00_req_step_09_functional_requirements.md` §7 的功能需求结论。核心功能需求包括治理语境与适用对象确定、治理输入收束与可裁决语境形成、关键节点正式治理裁决、自动化治理边界表达、Policy 生效与授权约束、Control 适用与复核责任、AIIA / SoA 治理评审结论、Nonconformity 纠正闭环、治理事实消费与追溯、治理事实维护 / 对账 / 报告 / 归档准备。外围增强功能只作为后续能力线索,不作为当前核心闭环成立条件。

正式功能需求表应摘录:

- `design-calibration/00_req_step_09_functional_requirements.md` §7.1 功能需求结论。
- `design-calibration/00_req_step_09_functional_requirements.md` §7.2 能力类型结论。
- `design-calibration/00_req_step_09_functional_requirements.md` §7.3 闭环映射结论。
- `design-calibration/00_req_step_09_functional_requirements.md` §7.4 故事映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧 F-001~F-014 功能清单 | 原样保留 | 按核心闭环能力重写 | 推荐 B。原因是旧清单混入对象、接口、规则、依赖、非功能和验收 |
| Q-002 | 是否把 `GetApplicablePolicies` 写成核心功能 | 原样写入 | 归入 Policy 生效与授权约束能力、治理事实消费与追溯能力 | 推荐 B。原因是 Step 9 不应固定 API 名称 |
| Q-003 | 是否把 Gate 六段式写成功能 | 独立写 | 归入关键节点正式治理裁决能力 | 推荐 B。原因是六段式属于规则和验收方向 |
| Q-004 | 是否把 SoA 38 控制项覆盖写成功能 | 独立写 | 归入 AIIA / SoA 治理评审结论能力和 Control 适用与复核责任能力 | 推荐 B。原因是控制项覆盖属于规则、数据归属和验收共同约束 |
| Q-005 | 是否把外部 GRC / 审计工具集成写入核心功能 | 写入核心 | 作为外围增强 | 推荐 B。原因是当前阶段无正式外部系统依赖 |

当前建议:接受上述推荐后进入 Step 10。

---

## 10. 进入下一步条件

- 每项功能需求都有编号、能力类型、说明、闭环映射和用户故事映射。
- 核心闭环能力覆盖 C-GOV-1~C-GOV-5。
- 每个 Step 8 的核心用户故事至少映射到一个功能需求。
- 已区分核心闭环能力、外围增强能力和边界外能力。
- 未把功能写成 CRUD / API / Command / 事件 / 数据表 / 代码模块 / Policy DSL / 具体状态机清单。
