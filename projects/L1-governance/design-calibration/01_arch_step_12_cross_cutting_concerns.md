# Step 12. 横切关注点

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 回填章节: `01-架构设计.md` §13 横切关注点
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-governance` 中哪些安全边界、可观测性、可用性 / 韧性、性能预算、配置与变更控制、审计追溯要求已经上升为长期横切主线约束,并说明它们分别作用于哪些边界、交互、数据关系或承载结构。

本步不写安全规范手册、认证实现、监控告警配置、日志字段清单、密钥存放脚本、性能压测脚本、运维恢复手册、配置文件格式、数据库、规则引擎、外部 GRC 产品、接口、事件、DTO、schema、部署参数或代码对象。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和边界红线 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供数据归属、一致性和失败处理口径 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台承接和失败降级口径 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 提供关键架构机制和当前不采用口径 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线方案、路径级取舍和不采用方案 |
| `00_req_step_13_non_functional_requirements.md` | 已完成 | 提供需求层非功能底线和判断口径 |
| `00_req_step_14_acceptance_criteria.md` | 已完成 | 提供需求层验收和否决项 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 提供容易串仓和伪闭环风险 |
| 旧 `01-架构设计.md` | 旧 Draft | 作为旧安全、审计、Policy engine、report、external GRC、性能数字和配置线索诊断输入 |

---

## 3. SOP 问题回答

### 3.1 安全边界如何处理?

安全边界以正式治理入口、责任语境、可见范围、数据归属、Policy / shared rules 和派生不反写为核心。任何同步写入、查询、异步输入、外部反馈、报告、对账、归档准备、维护动作或配置变化都不得绕过 Governance 的正式承接边界,也不得让 process waiting、work lifecycle、artifact body、conversation display、runtime cache、capability whitelist、observability alert、workspace view 或 external GRC status 直接定义 Governance truth。

低 scope Policy、项目级配置、role / member 入口、runtime 默认值、工具执行结果和 timeout fallback 都不能覆盖 shared rules 或组织级硬约束。高影响裁决、自动化授权、默认通过、默认超时和例外豁免必须经过正式 Policy、Control、Decision 和责任语境约束。

### 3.2 可观测性需要覆盖哪些正式对象和关键链路?

可观测性必须覆盖 Governance 核心事实、外部输入承接、派生消费和交接状态。架构层必须能看清 governance context、Gate / Decision、Approval / responsibility、Policy / shared rules、Control、AIIA / SoA、Nonconformity、event propagation、handoff、report、reconciliation、archive preparation、boundary violation、unresolved、stale、failed 和 retryable 等正式状态。

这里要求的是“治理事实和协作状态可辨识”,不是指定监控平台、日志字段、告警阈值或指标实现。

### 3.3 可用性和韧性需要守住什么底线?

Governance 核心 truth 写入失败时只能明确失败、拒绝、挂起或保持原状态,不得形成部分成立的裁决、Policy、Control、AIIA / SoA 结论或 Nonconformity 终态。外部引用、快照、safe summary 或 feedback 缺失时只能表达 unresolved、stale、pending、evidence-not-closed、failed 或 retryable,不得补造外部 truth 或正文。

下游消费、report、dashboard、observability、archive handoff、external GRC 导出、runtime cache 更新或派生视图重建失败,不得回滚已经成立的 Governance truth。重复、乱序、过期和重放输入必须通过幂等和顺序保护处理,不得产生重复裁决、重复 Policy 生效或状态回退。

### 3.4 性能预算是否需要给出口径?

当前不继承旧 Draft 中缺少新版负载模型支撑的 `150ms / 200ms / 50ms / 30s / 99.95%` 等数字作为架构硬指标。本步只给结构性性能预算口径:

Governance 核心同步路径不得被 report、dashboard、archive preparation、external GRC、observability、runtime cache propagation、full downstream fan-out、全量对账、复杂派生重建或历史追溯包生成拖重。Gate / Decision、Policy / shared rules、Control、AIIA / SoA、Nonconformity、query / trace 的核心判断必须围绕正式语境和必要引用收口,外围消费和交接通过异步或后台承接扩展。

### 3.5 配置如何管理,哪些配置不应散落?

配置与变更控制必须保护架构边界。配置可以影响运行承载、开关、批量大小、传播节奏、派生重建策略、导出启停或降级行为,但不得改变 Governance truth 归属、正式承接边界、数据所有权、Policy / shared rules 优先级、同步 / 异步 / 后台边界、只读派生原则、依赖裁剪规则或审计追溯要求。

影响高风险治理路径的配置变更必须可审查、可追溯、可回滚到明确口径,不能作为普通运行参数随意漂移。具体配置 key、文件格式、密钥存储、环境变量和运维脚本留到后续配置设计或实施阶段。

### 3.6 审计与可追溯性如何被正式保证?

Governance 必须能解释 actor、scope、object、decision reason、policy / control basis、evidence / external ref、result、consumer、handoff 和 maintenance action。追溯要求用于证明治理事实为何成立、为何拒绝、由谁承担、依据什么材料、如何被消费和如何交接。

Governance 拥有治理追溯事实和交接材料的语义,但不拥有 observability 物理 ledger、trace storage、archive package body、artifact / evidence body 或 external GRC 正文。追溯材料可以被导出、消费或归档准备,但不能由导出接收方反向定义 Governance truth。

### 3.7 哪些横切项与本仓无关,不应机械照抄模板?

本章不纳入 identity 认证凭据生命周期、runtime 工具沙箱、agent loop 恢复、artifact 内容扫描、method-library 标准版本治理、process checkpoint 恢复、work 项目执行 SLA、conversation UI 可访问性、workspace / console 展示体验、observability 物理存储、archive package 恢复手册和 external GRC 产品运维。这些事项可能重要,但主体职责不属于 `L1-governance`;本仓只保留与治理事实、正式裁决、Policy / Control、合规结论、纠正闭环、消费交接和边界保护有关的横切约束。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 安全、审计、report、external GRC、Policy engine 和性能指标混写 | 容易把产品设施或外部系统写成 Governance truth 支撑条件 | 改为横切约束表,只固定边界、保护目标和判断口径 |
| 旧性能数字直接进入架构目标 | 当前缺新版负载模型和验证来源 | 不作为硬指标继承,改为结构性性能预算口径 |
| audit store / observability / archive 线索贴近 truth center | 可能让物理审计和归档系统反向定义治理追溯事实 | 区分 Governance traceability truth 与外部 ledger / archive body |
| Policy engine / runtime cache 线索过早主导 | 可能让执行层成功状态定义 Policy effective fact | 固定 Policy truth 与 runtime cache / engine 分离 |
| 配置缺少边界约束 | 后续可能用配置绕过 shared rules、正式裁决或派生不反写 | 增加配置与变更控制横切约束 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 横切表达 | 通用非功能词和旧技术设施混列 | 只保留持续作用于 Governance 主线的约束 | 对齐架构规范 4.13 |
| 安全 | 泛化权限与系统安全 | 正式入口、责任语境、Policy / shared rules、正文排除和派生不反写 | Governance 的安全核心是治理事实不被打穿 |
| 可观测 | 监控 / 日志 / 审计实现倾向 | 核心事实、外部承接、派生消费和交接状态可见 | 先定义可辨识状态,后续再选实现 |
| 韧性 | 重试和恢复实现 | 失败必须显式表达,不得伪成功或补造外部 truth | 对齐 Step 8 / Step 9 |
| 性能 | 继承旧数字 | 不伪量化,先固定核心链路不被外围拖重 | 当前缺负载模型 |
| 配置 | 未形成架构红线 | 配置不得绕过 truth、shared rules、依赖和通信边界 | 防止实施阶段暗改架构 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按通用非功能模板逐项填充 | 覆盖看似完整 | 容易写空泛口号,与本仓边界无关 | 不采用 |
| 方案 B: 只保留持续作用于 Governance 主线的横切约束 | 与架构主线贴合,可审查 | 后续仍需详细设计 / 测试 / 配置继续落地 | 采用 |
| 方案 C: 把监控、告警、密钥、压测、恢复脚本都写进本章 | 看起来可执行 | 会滑入实现 / 运维手册,污染架构层边界 | 不采用 |
| 方案 D: 横切关注点全部后移到实施阶段 | 文档更轻 | 后续实现缺少长期边界约束,容易串仓 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否继承旧性能 / 可用性数字?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接继承旧 `150ms / 200ms / 50ms / 30s / 99.95%` | 数字看似清晰,但缺少新版负载模型和验证来源 |
| 方案 B | 当前只给结构性性能预算口径,后续由测试 / 验收量化 | 避免伪量化,仍保护核心链路不被外围拖重 |

推荐方案 B。

#### 是否把具体监控字段和告警阈值写入本章?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写入具体字段和阈值 | 越过详细设计和观测实现边界 |
| 方案 B | 只定义必须可见的对象、链路和状态 | 保持架构层粒度,后续可落监控设计 |

推荐方案 B。

#### 是否允许配置改变治理边界?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 允许配置改变 truth 归属、shared rules 或派生反写行为 | 配置层会成为隐式架构变更入口 |
| 方案 B | 不允许;配置只能在既有边界内改变运行承载和降级策略 | 保护已收稳架构主线 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式治理入口强制生效 | 同步写入、查询、异步输入、外部反馈、维护动作 | 所有改变或读取 Governance truth 的路径都必须经过正式入口、责任语境和可见边界判断。 | 防止外部入口、UI、runtime、report 或 external GRC 打穿治理核心。 | 这是横切读写和维护的边界规则,不是单个接口权限校验。 |
| 安全边界:Policy / shared rules 不可被低层覆盖 | Policy 生效、自动化授权、例外豁免、高影响决策、默认 timeout | 低 scope Policy、项目配置、runtime 默认值、tool result 或 cache 命中不得覆盖 shared rules 和组织级硬约束。 | 保护治理安全边界和自动化授权责任。 | 自动化路径依据不足时必须挂起、拒绝或升级人工裁决。 |
| 数据边界:外部正文不得入仓 | AIIA / SoA、Control、evidence、artifact、method、runtime、observability、archive、external GRC | Governance 只保存治理结论、引用、快照、safe summary 或追溯交接语义,不得吸收外部正文。 | 保护正文来源真相和 Governance truth 独立性。 | 横切同步、异步、report、archive preparation 和配置路径。 |
| 派生边界:只读消费不得反写 | report、dashboard、workspace / console、conversation display、reconciliation、external GRC | 派生、展示、报告、对账和导出只从 Governance truth 派生,不得创建、批准、关闭或改写治理事实。 | 防止第二 Governance truth。 | 派生失败只能表现为 stale、rebuilding、failed 或 unavailable。 |
| 可观测性:核心治理事实状态可见 | governance context、Gate / Decision、Approval、Policy、Control、AIIA / SoA、Nonconformity | 架构必须能区分成立、拒绝、挂起、不可见、未解析、过期、失败和待人工裁决等状态。 | 保护核心闭环是否真实成立的可审查性。 | 不指定日志字段、指标名或告警阈值。 |
| 可观测性:传播与交接状态可见 | event propagation、runtime cache consumption、observability handoff、archive preparation、external GRC export | 架构必须能区分待传播、已送达、未消费、failed、retryable、handoff-pending 和已交接等状态。 | 保护最终一致和外部消费的可解释性。 | 下游未消费不得回滚已成立 truth。 |
| 韧性:核心失败不伪成功 | 同步主真相写入、Gate / Decision、Policy / shared rules、Control、AIIA / SoA、Nonconformity | 核心失败只能失败、拒绝、挂起或保持原状态,不得写成半成立或默认通过。 | 保护正式治理事实的完整性。 | 该约束优先于调用方即时体验。 |
| 韧性:外部不可解析不补造 truth | 外部引用、快照、safe summary、evidence、runtime feedback、method definition | 外部来源缺失、过期或不可解析时只表达 unresolved、stale、pending、failed 或 evidence-not-closed。 | 防止 Governance 为了继续执行而伪造外部事实。 | 适用于同步判断、异步消费和后台刷新。 |
| 韧性:外围失败不污染核心 | report、dashboard、observability、archive、external GRC、runtime cache、派生重建 | 外围失败不得回滚、覆盖或补写 Governance truth。 | 保护核心 truth 在降级情况下独立成立。 | 外围失败通过 retryable、failed、pending 或旧视图表达。 |
| 性能预算:核心同步链路不被外围拖重 | Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity、query / trace | report、dashboard、archive preparation、external GRC、observability、runtime cache propagation、full fan-out 和全量对账不得成为核心同步前置。 | 保护核心治理判断在规模增长下仍可成立。 | 当前不写具体数字,先固定结构性预算。 |
| 性能预算:复杂消费通过派生和后台扩展 | 跨项目报告、治理看板、历史追溯、对账、归档准备、external GRC 导出 | 复杂读取和批量交接必须通过派生、后台承接或后续实现扩展,不得反向塑造核心模型。 | 保护核心模型不被报表和导出结构绑定。 | 具体容量和索引策略后续收敛。 |
| 配置与变更控制:配置不得越界 | 运行开关、传播节奏、派生重建、导出启停、降级策略、批量大小 | 配置不得改变 truth 归属、正式入口、Policy / shared rules、同步 / 异步 / 后台边界、只读派生和依赖裁剪。 | 防止配置层暗改架构。 | 具体配置 key 后移配置设计。 |
| 配置与变更控制:高风险变更可追溯 | Policy 生效规则、shared rules、Control 适用、自动化授权、外部交接、降级策略 | 影响治理主线的配置或策略变化必须可审查、可追溯、可解释。 | 保护责任语境和审计复盘能力。 | 不等同于写配置文件格式。 |
| 审计与可追溯:关键事实变化可复盘 | context、decision、approval、policy、control、AIIA / SoA、Nonconformity、handoff、maintenance | 关键变化必须解释 actor、scope、object、reason、basis、result、consumer 和 handoff 状态。 | 保护治理责任和合规解释能力。 | 这是 Governance 追溯事实,不是物理日志平台。 |
| 审计与可追溯:外部交接不反写真相 | observability、archive、external GRC、report、workspace / console | 交接材料必须能说明来源 Governance truth 和引用状态,接收方状态不得反向定义本仓 truth。 | 保护追溯交接和外部消费边界。 | 归档包正文、ledger body 和外部系统正文不归 Governance。 |

### 7.2 主线映射小表

| 横切关注点 | 主要作用章节 / 主线 | 后续承接 |
|---|---|---|
| 安全边界 | 职责边界、系统上下文、依赖方向、数据所有权、关键交互 | 概要设计、详细设计、测试方案、验收标准 |
| Policy / shared rules 保护 | 架构目标、数据所有权、技术机制、方案取舍 | 概要设计、详细设计、测试方案 |
| 正文排除和派生不反写 | 数据所有权、关键交互、关键技术选型、备选方案 | 概要设计、详细设计、验收标准 |
| 可观测性 | 关键交互、一致性策略、异步传播、后台承接 | 测试方案、验收标准、运维报告 |
| 韧性 / 恢复能力 | 数据一致性、通信方式、后台承接、外部交接 | 详细设计、测试方案、实施计划 |
| 性能预算 | 同步入口、派生承接、报告 / 对账 / 归档准备 | 测试方案、验收标准、容量验证 |
| 配置与变更控制 | 技术机制、横切约束、依赖裁剪、后续配置设计 | 配置设计、详细设计、实施计划 |
| 审计与可追溯 | 数据所有权、关键交互、traceability / evidence / handoff | 详细设计、测试方案、验收标准、归档交接 |

### 7.3 不进入本章的横切项

| 横切项 | 不进入本章原因 | 正确归属 |
|---|---|---|
| Identity 认证凭据、GlobalMember 生命周期和 role 管理 | 主体职责不属于 Governance。 | `L1-identity` / `L0-core` / 安全设计 |
| Runtime 工具沙箱、agent loop、执行恢复和 capability registry 安全 | 主体职责属于 runtime / capability 层。 | `L2-runtime` / `L3-capability-hub` |
| Artifact 内容扫描、证据正文完整性和 baseline 存储 | Governance 只引用和评审,不拥有正文。 | `L1-artifact` / archive / security 文档 |
| Method-library 标准、模板、Control definition 和 AIPolicyDef 版本治理 | Governance 只消费定义并形成生效事实。 | `L3-method-library` |
| Process checkpoint、waiting gate 执行恢复和 Activity SLA | Governance 不拥有 process execution truth。 | `L1-process` |
| Work 项目执行 SLA、WorkItem blocker 和 iteration 承诺恢复 | Governance 不拥有 work execution truth。 | `L1-work` |
| Conversation Gate card、review display 和 UI 可访问性 | Governance 不拥有 conversation display truth。 | `L1-conversation` / workspace / console |
| Observability 物理日志存储、指标平台和告警规则 | Governance 只拥有治理追溯语义和交接材料。 | `L4-observability` |
| Archive package body、长期归档恢复手册和外部 GRC 产品运维 | Governance 只准备和交接治理材料,不拥有归档正文或外部系统 truth。 | `L4-archive` / external GRC 集成文档 |

### 7.4 横切影响说明

`L1-governance` 的横切关注点不是通用质量清单,而是长期压在治理决策与治理控制事实之上的结构约束。安全、可观测、韧性、性能、配置和追溯都必须保护同一条主线:Governance truth 独立成立,外部正文不入仓,Policy / shared rules 不被低层覆盖,派生和外部消费不反写,失败和延迟可解释。具体产品、监控、告警、密钥、压测、配置 key、恢复脚本和运维流程只有在不改变这些横切约束的前提下,才能在后续设计和实施阶段继续细化。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §13 “横切关注点”直接摘录并整理本文件 §7.1、§7.2、§7.3 和 §7.4。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把具体监控字段和告警阈值写入架构横切章节 | A. 写入;B. 不写,只定义可观测对象、链路和状态;C. 完全不写可观测性 | B | 架构层应定义观察对象和状态,字段和阈值属于后续设计 | 已确认采用 B |
| 是否把具体配置项和配置文件写入本章 | A. 写入;B. 不写,只定义配置不可越界原则;C. 不讨论配置 | B | 配置设计有独立阶段,本章只固定配置不得绕过架构主线 | 已确认采用 B |
| 是否把外部仓的横切要求纳入本章 | A. 全部纳入;B. 只纳入与 Governance 边界相关的承接和交接约束;C. 全部不提 | B | 本仓不能替外部仓定义主体横切要求,但必须约束自己的边界行为 | 已确认采用 B |
| 是否现在量化性能 / 可用性目标 | A. 现在量化;B. 当前只给结构性预算口径,后续测试 / 验收量化;C. 完全不关注 | B | 当前缺正式负载模型,但不能不约束核心链路不被外围拖重 | 已确认采用 B |
| 是否允许配置改变治理边界 | A. 允许;B. 不允许,配置只能在已收稳架构边界内选择运行行为;C. 由实现决定 | B | truth、shared rules、依赖和通信边界不能由配置暗改 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 13 的待确认事项。具体监控字段、告警阈值、密钥处理、配置 key、压测指标、恢复脚本、外部 GRC 产品、observability 存储、archive package 格式和运维报告格式留到配置设计、详细设计、测试方案、验收标准和实施计划继续收敛。

---

## 10. 进入下一步条件

- 已明确安全边界、Policy / shared rules 保护、正文排除、派生不反写、可观测性、韧性 / 恢复能力、性能预算、配置与变更控制、审计与可追溯的横切约束。
- 已说明每项横切约束的作用范围、约束要求、保护目标和边界说明。
- 已明确哪些横切项不属于本仓主体职责。
- 已明确当前不继承旧性能 / 可用性数字为架构硬指标。
- 未写安全手册、监控配置、告警阈值、密钥脚本、压测脚本、恢复手册、产品选型或实现机制。
- 可以进入 Step 13“演进路线”。
