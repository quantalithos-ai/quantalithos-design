# Step 10. 业务规则与边界约束

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 10
> 回填章节: `00-需求文档.md` §10 业务规则与边界约束
> 生成日期: 2026-06-06

---

## 1. 本步目标

把 Step 2 的仓边界、Step 7 的核心能力闭环和 Step 9 的功能需求,用需求层硬规则钉住。本步只写必须始终成立的业务规则和边界约束,不写状态机编码、数据库约束、事务边界、接口签名、事件 schema、handler / service / repository 校验逻辑、具体错误码或数据归属矩阵。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Governance 是治理决策与治理控制真相仓,不是 process / work / artifact / conversation / identity / method-library / runtime / observability / UI |
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-GOV-1~C-GOV-5 核心闭环 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 作为规则约束的功能能力输入 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定依赖裁剪、相邻仓消费和禁止编译期依赖边界 |
| 旧 `projects/L1-governance/00-需求文档.md` §6.2 | 旧版业务规则 | 提取 Gate 六段式、reject 语义、autonomy、shared rules、SoA 覆盖、关键决策人和 resolution 不可改等规则线索 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取 Gate / Approval / Policy / Control / AIIA / SoA / Nonconformity 不变量线索,不继承字段、RPC、事件名或状态枚举 |

---

## 3. SOP 问题回答

### 3.1 哪些不变量必须始终成立?

`L1-governance` 的核心不变量围绕“治理裁决和治理控制事实不能被相邻仓状态、执行缓存、文档正文或 UI 显化污染”:

| 不变量 | 保护目的 |
|---|---|
| 治理语境必须绑定可追溯 actor、scope、适用对象和责任语境 | 保护 C-GOV-1 治理语境与适用对象能够被确定 |
| 关键节点正式裁决必须具备可解释的触发、请求、候选、证据、决策责任和结论语境 | 保护 C-GOV-2 关键节点治理裁决能够形成正式结论 |
| 正式裁决结论形成后不得被原地改写 | 保护 C-GOV-2 的决策可追溯性 |
| Policy 的生效、授权、范围和优先级必须是 Governance truth,不能由 runtime cache 或 capability whitelist 反向定义 | 保护 C-GOV-3 治理策略与控制适用约束能够成立 |
| shared rules 或等价组织级硬约束不得被低层 scope 覆盖 | 保护 C-GOV-3 的安全边界 |
| Control 的适用、实施和复核责任必须是治理事实,不能退化为标准原文或 artifact 正文 | 保护 C-GOV-3 / C-GOV-4 |
| AIIA / SoA 的正式评审结论必须引用正文来源,但不得复制 artifact / evidence 正文成为第二真相 | 保护 C-GOV-4 |
| Nonconformity 必须表达不符合、原因、纠正、复验和关闭闭环,不能退化为普通 bug、work blocker 或 observability alert | 保护 C-GOV-4 |
| 治理事实的消费视图、报告、对账和归档准备材料不得成为新的治理业务真相写源 | 保护 C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 |

### 3.2 哪些行为必须禁止?

必须禁止的行为集中在越界写真相、绕过治理裁决和让消费面反向定义治理事实:

| 禁止行为 | 禁止原因 |
|---|---|
| 把 process waiting state、Activity 或 checkpoint 写成 Gate / Decision truth | 过程等待不等于治理裁决 |
| 把 Project、WorkItem、Iteration、blocker 或 dependency 状态写成治理裁决 | 工作事实不拥有治理决策 |
| 把 Artifact、Evidence、AIIA / SoA 文档正文、baseline 或 archive package 正文写入 Governance truth | 文档正文和证据正文属于 artifact / archive |
| 把 conversation turn、Gate 卡片、review display 或 UI 操作当成治理事实写源 | 显化和交互不等于治理 truth |
| 把 runtime policy cache、tool execution、agent loop、capability whitelist 或工具调用结果写成 Policy truth | 执行层消费 Policy,不定义 Policy |
| 把 method-library 的 AIPolicyDef、control definition、template 或方法正文复制成 Governance 定义来源 truth | 定义 source truth 属于 method-library |
| 让低 scope Policy 覆盖 shared rules 或组织级硬约束 | 会破坏治理安全边界 |
| 让自动化或默认超时在无正式 Policy 授权时完成高影响裁决 | 会绕过人类或正式授权策略 |
| 让查询、报表、投影重建、对账、归档准备或维护任务隐式创建、修改、批准、关闭治理事实 | 消费面和维护面不得成为写源 |

### 3.3 哪些状态变化必须显式发生,不能隐式发生?

需求层只说明显式变化要求,不写具体状态机:

| 显式变化 | 原因 |
|---|---|
| 治理语境进入正式可裁决语境必须显式发生 | 避免相邻仓引用或 UI 显示隐式创建治理事实 |
| 关键节点被提出、进入评审、形成裁决、取消或过期必须显式发生 | 避免 process waiting state 或外部事件替代 Gate lifecycle |
| 审批、投票、授权或替代裁决责任变化必须显式发生 | 避免决策责任不可解释 |
| Policy 生效、替代、退役、冲突处理或优先级变化必须显式发生 | 避免 runtime cache 或方法定义更新静默改变治理约束 |
| Control 适用、实施、复核、违反和整改关联必须显式发生 | 避免控制项成为静态文本或告警备注 |
| AIIA / SoA 提交、评审、批准、替代或作废必须显式发生 | 避免 artifact 文档版本变化静默改变治理结论 |
| Nonconformity 的提出、原因确认、纠正、复验和关闭必须显式发生 | 避免不符合纠正闭环丢失责任和依据 |
| 治理事实被发布、消费、报告、对账或归档准备时必须保留来源和范围 | 支撑授权消费与持续追溯 |

### 3.4 哪些边界不能被打穿?

| 边界 | 不能被打穿的内容 |
|---|---|
| Governance / process | Governance 不拥有 ProcessInstance、Activity、waiting gate state、checkpoint 或 recovery truth;Process 不拥有 Gate / Decision truth |
| Governance / work | Governance 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、dependency 或 blocker truth |
| Governance / artifact | Governance 不拥有 Artifact、Evidence、Baseline、AIIA / SoA 文档正文、ImplementationPlan 正文或 archive package 正文 |
| Governance / conversation | Governance 不拥有 conversation fact、space、participant scope、visibility、Gate 显化卡片或聊天 UI 状态 |
| Governance / identity | Governance 不拥有 GlobalMember、Actor、Role、认证授权或成员生命周期 truth |
| Governance / method-library | Governance 不拥有 AIPolicyDef、Control definition、ProcessTemplateDef、RoleDefinition、method 或标准正文 source truth |
| Governance / runtime | Governance 不拥有 runtime enforcement、agent loop、tool execution、policy cache 命中、plan item progress 或执行日志正文 |
| Governance / capability-hub | Governance 不拥有 capability registration、tool adapter、provider contract 或工具调用结果 |
| Governance / observability | Governance facts 必须可审计,但 Governance 不拥有 audit log store、metrics、trace storage 或 alert stream |
| Governance / workspace / console / external GRC | Governance 提供事实和管理语境,不拥有聚合 UI 状态或外部 GRC 系统 truth |

### 3.5 哪些操作必须附带治理、审计或引用条件?

| 条件类型 | 操作 / 变化 | 需求层要求 |
|---|---|---|
| 治理约束 | 高影响 Gate 裁决、自动裁决、默认超时裁决 | 必须有明确决策责任、候选项、依据和正式授权边界 |
| 治理约束 | shared rules、组织级 Policy、Control 基线和高风险自动化授权变化 | 必须满足正式治理评审或批准条件,不得由低层 scope 或 runtime 自行覆盖 |
| 引用约束 | AIIA / SoA、Control evidence、Nonconformity 证据和相邻仓对象 | 必须以 ref / safe summary 表达,不得保存正文或接管相邻 truth |
| 审计约束 | Gate、Approval、Policy、Control、AIIA / SoA、Nonconformity 的关键变化 | 必须形成可追溯记录 |
| 审计约束 | 报告、对账、归档准备和维护动作 | 必须能说明来源、范围和结果,不得静默改变业务治理结论 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §6.2 | 写 Gate 缺六段、candidate_options、autonomy_level、shared_rules、SoA 38 控制项等条件 / 结果 | 有价值,但规则与功能混写,且部分字段过细 | 迁移到 Step 10 规则表,保留需求层语义 |
| 旧 `00-需求文档.md` §6.3 | 用 Gate、Policy、Control、AIIA / SoA 对象链表达功能依赖 | 对象依赖图不是规则表 | 只提取边界和治理约束线索 |
| 旧 `00-需求文档.md` §9 | 写 Gate / Approval、Policy、SoA / AIIA、Nonconformity 生命周期与 ER 草图 | 已滑入概要 / 详细设计 | Step 10 只保留显式变化和不可越界规则 |
| `domain/governance/README.md` | INV-1~INV-47、RPC、事件、字段和状态机丰富 | 可作线索,但不能直接复制到需求规则 | 只裁剪为需求层不变量、禁止行为、显式变化和边界约束 |
| 旧文档整体 | Gate UI、Policy cache、artifact 双身份、observability audit、外部 GRC 多处混写 | Step 10 与 Step 11 / 12 / 13 / 14 边界不清 | 本步只钉住业务规则,数据归属、接口依赖、非功能和验收后移 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 规则位置 | 混在功能需求、数据草图、接口想象和非功能中 | 独立 Step 10 规则表 | 规则需要单独约束功能不串线 |
| 规则类型 | 条件 / 结果扁平列表和旧 INV 编号 | 不变量、禁止行为、显式变化、边界约束、治理约束、审计约束 | 能审查规则在保护什么 |
| Gate 规则 | 直接写字段、状态和 RPC 触发 | 写成正式裁决必须具备可解释语境、候选、依据、责任和不可原地改写 | 保留裁决价值,不提前锁协议 |
| Policy 规则 | 写成 Policy 聚合和 GetApplicablePolicies | 写成生效、授权、优先级、shared rules 和冲突不可越界 | 防止接口和 cache 反向定义 truth |
| AIIA / SoA 规则 | 写成文档发布和 38 控制项覆盖 | 写成治理评审结论、正文引用和控制覆盖约束 | 保留合规价值,保护 artifact 边界 |
| Nonconformity 规则 | 写成 Control violated 自动创建对象 | 写成不符合、原因、纠正、复验和关闭闭环 | 自动触发细节后移,需求层先保护纠正闭环 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 原样继承旧 BR 和 INV | 快,保留旧设计细节 | 字段、状态、RPC、事件和机制过实,且与新版边界不完全对齐 | 不采用 |
| 方案 B: 按规则类型重写 | 能钉住 Governance truth 和相邻仓边界,支撑 Step 11 数据归属 | 后续仍需详细设计细化对象、状态和协议 | 采用 |
| 方案 C: 只写 Gate / Policy 规则 | 文档短,突出高频能力 | 会漏掉 Control、AIIA、SoA 和 Nonconformity 的治理控制闭环 | 不采用 |
| 方案 D: 直接写完整 47 条不变量 | 看似完整 | 超出需求层,会提前固定字段和实现模型 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否原样写入 Gate 六段式?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样写入旧字段级六段式 | 会把字段 schema 提前锁进需求层 |
| 方案 B | 写成正式裁决必须具备触发、请求、候选、证据、决策责任和结论六类可解释语境 | 保留治理裁决完整性,字段后移详细设计 |

推荐方案 B。原因是 Step 10 要钉住裁决完整性,不是定义 DTO 或聚合字段。

#### 是否把 SoA 38 控制项覆盖写成硬规则?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不写,后移验收 | 会削弱 ISO 42001 控制覆盖边界 |
| 方案 B | 写成 SoA 适用 / 排除结论必须覆盖正式控制基线,具体控制项清单和字段后移 | 保留合规硬约束,不复制标准原文 |

推荐方案 B。原因是控制覆盖是治理规则,但标准原文和字段清单不属于本步。

#### 是否把 shared rules 写成最高优先级硬规则?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成硬规则 | 能保护组织级安全边界 |
| 方案 B | 后移 Policy 设计 | 需求层会缺少 Policy 冲突的核心安全约束 |

推荐方案 A。原因是 shared rules 不被低 scope 覆盖是 Governance 的核心规则之一。

#### 是否把 critical Nonconformity 自动触发 Gate 写成需求硬规则?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成必须自动触发具体 Gate kind | 会提前固定触发机制和 Gate kind |
| 方案 B | 写成高严重不符合必须进入正式治理处置,具体触发机制后移 | 保留风险控制,不提前锁协议和状态机 |

推荐方案 B。原因是需求层要钉住高严重不符合不能被普通关闭,具体自动化机制后续再设计。

---

## 7. 结构化中间产物

### 7.1 规则编号结论

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-GOV-001 | 不变量 | 治理语境必须绑定可追溯 actor、scope、适用对象和责任语境,不得由 UI 显示、相邻仓状态或运行缓存隐式成立。 | governance context |
| BR-GOV-002 | 不变量 | 关键节点正式裁决必须具备触发、请求、候选、证据、决策责任和结论六类可解释语境。 | Gate / Decision |
| BR-GOV-003 | 不变量 | 正式裁决结论形成后不得被原地改写;纠正或改变必须形成新的可追溯治理事实。 | Decision / resolution |
| BR-GOV-004 | 不变量 | Approval、投票、授权或替代裁决责任形成后必须可追溯,不得被静默覆盖。 | Approval / decision responsibility |
| BR-GOV-005 | 不变量 | Policy 的生效、授权、范围和优先级必须由 Governance truth 表达,不得由 runtime cache、capability whitelist 或 method definition 反向定义。 | Policy |
| BR-GOV-006 | 不变量 | shared rules 或等价组织级硬约束不得被 project、role、member 或低层 scope Policy 覆盖。 | Policy / shared rules |
| BR-GOV-007 | 不变量 | Control 的适用、实施和复核责任必须作为治理事实存在,不得退化为标准原文、artifact 正文或审计备注。 | Control |
| BR-GOV-008 | 不变量 | AIIA / SoA 的治理评审结论必须引用正文来源,但不得复制 artifact / evidence 正文成为第二真相。 | AIIA / SoA |
| BR-GOV-009 | 不变量 | SoA 的适用 / 排除结论必须覆盖正式控制基线,不得遗漏适用性判断。 | SoA / Control baseline |
| BR-GOV-010 | 不变量 | Nonconformity 必须表达不符合、原因、纠正、复验和关闭闭环,不得退化为普通 bug、work blocker 或 observability alert。 | Nonconformity |
| BR-GOV-011 | 不变量 | Governance 的读模型、报告、对账和归档准备材料不得成为新的治理业务真相写源。 | 消费面 / 维护面 |
| BR-GOV-012 | 禁止行为 | 不得把 process waiting state、Activity、checkpoint 或 recovery 写成 Gate / Decision truth。 | Governance / process 边界 |
| BR-GOV-013 | 禁止行为 | 不得把 Project、WorkItem、Iteration、blocker 或 dependency 状态写成治理裁决。 | Governance / work 边界 |
| BR-GOV-014 | 禁止行为 | 不得把 Artifact、Evidence、AIIA / SoA 文档正文、baseline 或 archive package 正文写入 Governance truth。 | Governance / artifact / archive 边界 |
| BR-GOV-015 | 禁止行为 | 不得把 conversation turn、Gate 卡片、review display 或 UI 操作当成治理事实写源。 | Governance / conversation / UI 边界 |
| BR-GOV-016 | 禁止行为 | 不得把 runtime policy cache、tool execution、agent loop、capability whitelist 或工具调用结果写成 Policy truth。 | Governance / runtime / capability 边界 |
| BR-GOV-017 | 禁止行为 | 不得把 AIPolicyDef、control definition、template、method 或标准正文复制为 Governance source truth。 | Governance / method-library 边界 |
| BR-GOV-018 | 禁止行为 | 不得让低 scope Policy 覆盖 shared rules 或组织级硬约束。 | Policy conflict |
| BR-GOV-019 | 禁止行为 | 不得让自动化或默认超时在无正式 Policy 授权时完成高影响裁决。 | Gate / automation |
| BR-GOV-020 | 禁止行为 | 查询、报表、投影重建、对账、归档准备或维护任务不得隐式创建、修改、批准、关闭治理事实。 | 读 / 维护动作 |
| BR-GOV-021 | 显式变化 | 治理语境进入正式可裁决语境必须显式发生,并说明适用对象和治理目的。 | governance context |
| BR-GOV-022 | 显式变化 | 关键节点被提出、进入评审、形成裁决、取消或过期必须显式发生。 | Gate / Decision |
| BR-GOV-023 | 显式变化 | 审批、投票、授权或替代裁决责任变化必须显式发生。 | Approval / responsibility |
| BR-GOV-024 | 显式变化 | Policy 生效、替代、退役、冲突处理或优先级变化必须显式发生。 | Policy lifecycle |
| BR-GOV-025 | 显式变化 | Control 适用、实施、复核、违反和整改关联必须显式发生。 | Control |
| BR-GOV-026 | 显式变化 | AIIA / SoA 提交、评审、批准、替代或作废必须显式发生。 | AIIA / SoA |
| BR-GOV-027 | 显式变化 | Nonconformity 的提出、原因确认、纠正、复验和关闭必须显式发生。 | Nonconformity |
| BR-GOV-028 | 边界约束 | Governance 不拥有 ProcessInstance、Activity、waiting gate state、checkpoint 或 recovery truth。 | process 边界 |
| BR-GOV-029 | 边界约束 | Governance 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、dependency 或 blocker truth。 | work 边界 |
| BR-GOV-030 | 边界约束 | Governance 不拥有 Artifact、Evidence、Baseline、AIIA / SoA 文档正文、ImplementationPlan 正文或 archive package 正文。 | artifact / archive 边界 |
| BR-GOV-031 | 边界约束 | Governance 不拥有 conversation fact、space、participant scope、visibility、Gate 显化卡片或聊天 UI 状态。 | conversation 边界 |
| BR-GOV-032 | 边界约束 | Governance 不拥有 GlobalMember、Actor、Role、认证授权或成员生命周期 truth。 | identity 边界 |
| BR-GOV-033 | 边界约束 | Governance 不拥有 AIPolicyDef、Control definition、ProcessTemplateDef、RoleDefinition、method 或标准正文 source truth。 | method-library 边界 |
| BR-GOV-034 | 边界约束 | Governance 不拥有 runtime enforcement、agent loop、tool execution、policy cache 命中、plan item progress 或执行日志正文。 | runtime 边界 |
| BR-GOV-035 | 边界约束 | Governance 不拥有 capability registration、tool adapter、provider contract、工具调用结果、audit log store、metrics、trace storage 或 alert stream。 | capability / observability 边界 |
| BR-GOV-036 | 治理约束 | 高影响 Gate 裁决、自动裁决和默认超时裁决必须有明确决策责任、候选项、依据和正式授权边界。 | Gate / automation |
| BR-GOV-037 | 治理约束 | shared rules、组织级 Policy、Control 基线和高风险自动化授权变化必须满足正式治理评审或批准条件。 | Policy / Control |
| BR-GOV-038 | 治理约束 | 高严重不符合必须进入正式治理处置,不得仅作为普通告警、任务或备注关闭。 | Nonconformity |
| BR-GOV-039 | 审计约束 | Gate、Approval、Policy、Control、AIIA / SoA、Nonconformity 的关键变化必须可追溯。 | governance audit |
| BR-GOV-040 | 审计约束 | 治理事实被发布、消费、报告、对账或归档准备时必须能说明来源、范围和结果,不得静默改变业务治理结论。 | consumption / maintenance audit |

### 7.2 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | BR-GOV-001;BR-GOV-002;BR-GOV-003;BR-GOV-004;BR-GOV-005;BR-GOV-006;BR-GOV-007;BR-GOV-008;BR-GOV-009;BR-GOV-010;BR-GOV-011 |
| 禁止行为 | BR-GOV-012;BR-GOV-013;BR-GOV-014;BR-GOV-015;BR-GOV-016;BR-GOV-017;BR-GOV-018;BR-GOV-019;BR-GOV-020 |
| 显式变化 | BR-GOV-021;BR-GOV-022;BR-GOV-023;BR-GOV-024;BR-GOV-025;BR-GOV-026;BR-GOV-027 |
| 边界约束 | BR-GOV-028;BR-GOV-029;BR-GOV-030;BR-GOV-031;BR-GOV-032;BR-GOV-033;BR-GOV-034;BR-GOV-035 |
| 治理约束 | BR-GOV-036;BR-GOV-037;BR-GOV-038 |
| 审计约束 | BR-GOV-039;BR-GOV-040 |

### 7.3 规则内容结论

本步规则内容收敛为三条主线:

1. 治理事实不被污染:治理语境、正式裁决、Approval、Policy、Control、AIIA / SoA 和 Nonconformity 必须保持 Governance 自己的事实边界。
2. 边界外真相不被接管:process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 和外部 GRC 的正文、执行、显化、缓存和存储真相不进入 Governance。
3. 关键变化必须显式可追溯:Gate、Approval、Policy、Control、AIIA / SoA、Nonconformity、消费、报告、对账和归档准备都不能隐式发生或静默改写治理结论。

### 7.4 约束对象结论

| 约束对象 | 相关规则 |
|---|---|
| governance context | BR-GOV-001;BR-GOV-021;BR-GOV-039 |
| Gate / Decision | BR-GOV-002;BR-GOV-003;BR-GOV-019;BR-GOV-022;BR-GOV-036;BR-GOV-039 |
| Approval / responsibility | BR-GOV-004;BR-GOV-023;BR-GOV-039 |
| Policy / shared rules | BR-GOV-005;BR-GOV-006;BR-GOV-018;BR-GOV-024;BR-GOV-037;BR-GOV-039 |
| Control | BR-GOV-007;BR-GOV-025;BR-GOV-037;BR-GOV-039 |
| AIIA / SoA | BR-GOV-008;BR-GOV-009;BR-GOV-026;BR-GOV-030;BR-GOV-039 |
| Nonconformity | BR-GOV-010;BR-GOV-027;BR-GOV-038;BR-GOV-039 |
| 消费 / 报告 / 维护 | BR-GOV-011;BR-GOV-020;BR-GOV-040 |
| 相邻仓边界 | BR-GOV-012~BR-GOV-017;BR-GOV-028~BR-GOV-035 |

### 7.5 规则与功能映射结论

| 功能需求 | 主要规则 |
|---|---|
| FR-GOV-001 治理语境与适用对象确定 | BR-GOV-001;BR-GOV-021;BR-GOV-028~BR-GOV-035;BR-GOV-039 |
| FR-GOV-002 治理输入收束与可裁决语境形成 | BR-GOV-001;BR-GOV-012~BR-GOV-017;BR-GOV-021;BR-GOV-036 |
| FR-GOV-003 关键节点正式治理裁决 | BR-GOV-002;BR-GOV-003;BR-GOV-004;BR-GOV-019;BR-GOV-022;BR-GOV-023;BR-GOV-036;BR-GOV-039 |
| FR-GOV-004 自动化治理边界表达 | BR-GOV-005;BR-GOV-006;BR-GOV-018;BR-GOV-019;BR-GOV-036;BR-GOV-037 |
| FR-GOV-005 Policy 生效与授权约束 | BR-GOV-005;BR-GOV-006;BR-GOV-016;BR-GOV-017;BR-GOV-018;BR-GOV-024;BR-GOV-037;BR-GOV-039 |
| FR-GOV-006 Control 适用与复核责任 | BR-GOV-007;BR-GOV-009;BR-GOV-025;BR-GOV-033;BR-GOV-037;BR-GOV-039 |
| FR-GOV-007 AIIA / SoA 治理评审结论 | BR-GOV-008;BR-GOV-009;BR-GOV-014;BR-GOV-026;BR-GOV-030;BR-GOV-039 |
| FR-GOV-008 Nonconformity 纠正闭环 | BR-GOV-010;BR-GOV-027;BR-GOV-038;BR-GOV-039 |
| FR-GOV-009 治理事实消费与追溯 | BR-GOV-011;BR-GOV-012~BR-GOV-017;BR-GOV-028~BR-GOV-035;BR-GOV-039;BR-GOV-040 |
| FR-GOV-010 治理事实维护、对账、报告和归档准备 | BR-GOV-011;BR-GOV-020;BR-GOV-030;BR-GOV-035;BR-GOV-040 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §10。正式文档可摘录本文件 §7.1、§7.2、§7.4 和 §7.5 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 10. 业务规则与边界约束

> 校准来源:
> - `design-calibration/00_req_step_10_business_rules_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“规则与功能映射结论”小节,了解本章如何用规则钉住功能不串线。

本文采用 `design-calibration/00_req_step_10_business_rules_boundaries.md` §7 的业务规则结论。规则分为不变量、禁止行为、显式变化、边界约束、治理约束和审计约束六类,用于保护治理裁决与治理控制事实不被 process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 或外部 GRC 等相邻仓污染。

正式规则表应摘录:

- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.1 规则编号结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.2 规则类型结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.4 约束对象结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.5 规则与功能映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否原样写入 Gate 六段式字段级规则 | 原样写入 | 写成六类可解释语境,字段后移详细设计 | 推荐 B。原因是 Step 10 要钉住裁决完整性,不是定义 DTO 或聚合字段 |
| Q-002 | 是否把 SoA 38 控制项覆盖写成硬规则 | 不写,后移验收 | 写成 SoA 适用 / 排除结论必须覆盖正式控制基线 | 推荐 B。原因是控制覆盖是治理规则,但标准原文和字段清单不属于本步 |
| Q-003 | 是否把 shared rules 写成最高优先级硬规则 | 写成硬规则 | 后移 Policy 设计 | 推荐 A。原因是 shared rules 不被低 scope 覆盖是 Governance 的核心规则之一 |
| Q-004 | 是否把 critical Nonconformity 自动触发 Gate 写成需求硬规则 | 写成必须自动触发具体 Gate kind | 写成高严重不符合必须进入正式治理处置,具体触发机制后移 | 推荐 B。原因是需求层要钉住高严重不符合不能被普通关闭,具体自动化机制后续再设计 |

当前建议:接受上述推荐后进入 Step 11。

---

## 10. 进入下一步条件

- 已覆盖不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。
- 规则已经足以保护 C-GOV-1~C-GOV-5 核心能力闭环不串线。
- 每条规则都有规则编号、规则类型、规则内容和约束对象。
- 已说明规则与 Step 9 功能需求的映射关系。
- 未把实现校验逻辑、接口约束、数据库约束、事务、DTO、状态机细节或数据归属矩阵写入规则表。
