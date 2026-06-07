# Step 14. 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 回填章节: `01-架构设计.md` §15 风险与待确认事项
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

显式收纳 `L1-governance` 架构校准后仍未关闭、且会影响后续概要设计 / 详细设计 / 测试验收 / 配置设计 / 实施计划判断的风险和待确认事项。

本步不写任务 backlog、TODO 清单、实施动作、最终解决方案、产品选型、接口字段、状态机细节或优化愿望,也不把前文已经收稳的 Governance truth、正文排除、Policy / shared rules 保护、派生不反写和依赖裁剪结论重新打开。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供需求基线、旧文档回流风险和一票否决输入 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供职责红线和易混淆边界 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供 `L0-core` 唯一编译期依赖和运行期协作口径 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / reference / derived separation 和一致性边界 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台承接、失败状态和外围最终一致口径 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 提供关键技术机制、正式承接层和当前不采用口径 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线方案、替代路径和不采用方案 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 提供安全、可观测、韧性、性能、配置和追溯横切约束 |
| `01_arch_step_13_evolution_path.md` | 已完成 | 提供可接受债务、不可接受债务和演进触发条件 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 提供需求层风险与待确认事项 |

---

## 3. SOP 问题回答

### 3.1 当前还有哪些尚未关闭的架构风险?

当前尚未关闭的正式风险不是“能力还没做完”,而是后续概要、详细、配置、测试和实现阶段可能重新打穿 `L1-governance` 主线边界的问题:

| 风险 | 当前判断 |
|---|---|
| Gate / Decision 与 process waiting state、work lifecycle、conversation display、workspace view 或 runtime cache 再次混写 | 会破坏 Governance 独立裁决 truth。 |
| Policy effective fact 与 AIPolicyDef、runtime policy cache、capability whitelist、tool execution 或 external GRC status 再次混写 | 会导致定义层、执行层或外部系统反向定义 Policy truth。 |
| Control / AIIA / SoA governance conclusion 与 standard text、artifact / evidence body、method definition body 或 external GRC document 再次混写 | 会让 Governance 保存第二份合规正文。 |
| Nonconformity corrective loop 退化为 bug、work blocker、observability alert、report comment 或普通任务 | 会破坏正式治理纠正闭环。 |
| shared rules 不可覆盖语义在后续 Policy 设计中被低 scope Policy、项目配置、runtime 默认值或 timeout fallback 弱化 | 会破坏组织级治理安全边界。 |
| report、dashboard、external GRC export、reconciliation、archive preparation 或 projection rebuild 被设计成可改写 Governance truth | 会让消费面、导出面或维护面成为第二 truth。 |
| 外部正文通过 ref、snapshot、safe summary、evidence、report、handoff 或 maintenance 进入 Governance truth | 会打穿正文归属和数据所有权。 |
| 同步成功被误写成 runtime cache、report、external GRC、observability 或 archive handoff 已经完成 | 会制造核心强一致与外围最终一致之间的伪闭环。 |
| 除 `L0-core` 外的 sibling repo 进入编译期业务依赖 | 会破坏 L1 平权 truth 域和全局依赖裁剪。 |
| 旧 external GRC、Policy engine、audit store、report system、旧性能数字回流为当前架构硬主线 | 会让旧 Draft 或产品设施反向定义当前架构。 |

### 3.2 这些风险会影响哪一层架构结构?

| 风险类型 | 影响范围 |
|---|---|
| 治理裁决与相邻状态混写 | 职责边界、系统上下文、关键交互、一致性策略、验收否决 |
| Policy truth 与定义 / 执行 / 外部状态混写 | 数据所有权、依赖方向、技术机制、安全边界、配置治理 |
| Control / AIIA / SoA 正文边界混写 | 数据归属、外部引用、审计追溯、archive / observability handoff |
| Nonconformity 纠正闭环退化 | 核心能力闭环、状态变化、责任语境、跨仓协作 |
| shared rules 被低层覆盖 | Policy 层级、自动化授权、配置变更、安全横切 |
| 派生 / 导出 / 维护反写 | read model、report、external export、reconciliation、后台维护 |
| 同步 / 异步边界伪闭环 | 通信方式、一致性分层、韧性 / 恢复、验收证据 |
| 编译期依赖越界 | 依赖方向、技术选型、实施边界、后续代码组织 |
| 旧口径回流 | 架构目标、技术机制、备选方案、演进路线、测试验收 |

### 3.3 当前还有哪些待确认事项?

当前待确认事项主要是还缺后续设计或测试阶段输入的问题,它们不推翻当前架构边界,但会影响后续能否 1:1 落码和验收:

1. Governance API / Command / Query / Event / Job / DTO 的正式名称、字段和错误语义。
2. Governance context、Gate、Decision、Approval、Policy、Control、AIIA、SoA、Nonconformity、traceability、handoff 的详细对象 schema、状态集和迁移规则。
3. Gate 六类可解释语境在正式对象、协议和追溯记录中的承载方式。
4. Policy 生效、scope、priority、conflict、shared rules、例外豁免、自动授权和 timeout fallback 的字段级判定口径。
5. Control applicability / review、AIIA / SoA coverage、evidence freshness、external standard mapping 和周期重评的详细承载口径。
6. Nonconformity severity、corrective action、verification、closure、reopen、root-cause 和外部协作的详细流程口径。
7. Governance traceability / evidence / handoff 与 `L4-observability`、`L4-archive` 的正式交接 schema、回链验证和失败恢复口径。
8. report / dashboard / workspace / console / conversation display / external GRC export 的只读 derived view 和导出映射口径。
9. runtime cache / capability consumption 对 Policy 的消费状态、unsupported policy、stale / failed / retryable marker 的正式 schema。
10. 旧性能、Policy 下发、report 延迟、archive handoff、audit coverage 等候选数字是否由正式负载模型和测试数据硬化。
11. 具体 DB、message bus、cache、search、rule engine、object storage、audit store、external GRC 产品是否进入配置和实施基线。

### 3.4 哪些待确认项会影响前文结论是否成立?

这些待确认事项不会改变前文已收稳的结论:Governance 拥有独立治理事实,外部正文不入仓,Policy / shared rules 归 Governance,派生和导出不反写,非 core sibling 不进入编译期依赖。它们会影响后续设计如何表达对象、状态、协议、事件、持久化、错误、配置、测试和交接。如果后续细化结果选择让外部正文、相邻仓 truth、派生视图、runtime cache 或 external GRC 反向定义 Governance truth,则会从“待确认事项”转化为阻塞风险。

### 3.5 哪些风险是当前阶段可接受的,哪些会阻塞后续推进?

当前可带约束推进的风险包括:旧产品设施和旧性能数字回流风险、完整 ES / rule engine / external GRC 未定、API / 状态 / schema / 产品承载未定、report / export / archive handoff 细节未定。它们不阻塞 Step 15 / Step 16,但必须在后续对应文档正式闭合。

会阻塞后续推进的是:Governance truth 边界不清、外部正文进入 Governance truth、Gate / Decision 被相邻状态替代、Policy truth 被定义层 / 执行层 / 外部系统反向定义、shared rules 可被低 scope 覆盖、Nonconformity 退化为普通任务或告警、派生 / 导出 / 维护反写、同步成功伪装外围已完成、非 core sibling 编译期依赖。

---

## 4. 当前文档问题诊断

| 旧 / 前序内容 | 问题 | 本轮处理 |
|---|---|---|
| 需求 Step 15 已列风险和待确认事项 | 需要转成架构层影响范围、处理口径和阻塞性 | 作为本步主要输入,并映射到架构结构 |
| Step 13 已列可接受债务和不可接受债务 | 需要区分哪些是正式风险,哪些只是后续演进或可接受债务 | 不把所有债务自动写成风险 |
| 旧 external GRC、Policy engine、audit store、report system 线索 | 容易回流为当前架构主线 | 写成非阻塞风险,当前只作为历史候选暂存 |
| 旧 `150ms / 200ms / 50ms / 30s / 99.95%` 数字 | 缺少新版负载模型和验证来源 | 写成待确认事项和容量演进触发线索,不作为当前硬指标 |
| 前序每步的 Q 表 | 大部分已经被后续步骤吸收 | 本步只保留仍影响后续架构 / 设计成立的问题 |
| API、状态机、schema、存储和产品选择未定 | 容易诱导后续 Agent 自行补真相源 | 写成待确认事项,明确不能在实现中脑补 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 分散在需求风险、演进债务、横切约束和旧文档问题中 | 汇总成正式架构风险表 | 对齐书写规范 §4.15 |
| 待确认事项 | 容易混入 TODO、方案、演进愿望或已收敛 Q 表 | 只保留缺确认且会影响主线判断的问题 | 防止制造伪不确定 |
| 阻塞判断 | 可接受债务和不可接受债务可能混淆 | 明确阻塞 / 不阻塞 / 有条件阻塞 | 支撑后续设计审查 |
| 当前处理口径 | 容易写解决方案或实施动作 | 只写架构层约束、暂存或挂起 | 不越过本步职责 |
| 旧口径处理 | 旧设施和旧数字可能继续污染主线 | 统一按历史输入暂存,不得压过新版主线 | 防止旧 Draft 回流 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 汇总全部前序 Q 表 | 信息完整 | 大量问题已被后续 Step 吸收,会制造伪未定 | 不采用 |
| 方案 B: 拆分正式风险和待确认事项,并给出阻塞判断 | 可审查,能支撑后续概要 / 详细 / 测试 / 配置 | 文档较长,需要严格避免写解决方案 | 采用 |
| 方案 C: 把 API / 状态机 / schema / 产品未定全部写成阻塞风险 | 看似保守 | 会让架构文档承担详细设计职责 | 不采用 |
| 方案 D: 不保留待确认事项 | 文档干净 | 会诱导后续 Agent 自行脑补字段、状态、端口或产品 | 不采用 |

### 6.1 待确认问题的方案选择

#### API / 状态机 / schema 未定是否阻塞正式架构文档整理?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 阻塞 Step 15 / Step 16 | 架构文档会被迫下沉详细设计 |
| 方案 B | 不阻塞 Step 15 / Step 16,但阻塞对应详细设计或实现 boundary 自行补字段 | 保持文档层级正确 |

推荐方案 B。

#### 外部 GRC / rule engine / report 产品未定是否是架构风险?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 产品未定本身是阻塞风险 | 会让架构层承担产品横评 |
| 方案 B | 产品未定是待确认事项;产品回流为 truth 才是阻塞风险 | 保护架构层和实现层分工 |

推荐方案 B。

#### 完整 ES / CQRS 未定是否需要现在定论?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前必须定论 | 会过早锁定持久化和事件模型 |
| 方案 B | 保留为后续待确认和 ADR 候选,当前只固定 traceability / event collaboration / handoff | 对齐当前主线复杂度 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| Gate / Decision 与 process waiting state、work lifecycle、conversation display、workspace view 或 runtime cache 混写风险 | 职责边界;系统上下文;关键交互;一致性策略;验收否决 | 当前按正式 Governance decision truth 收口,相邻仓只能提供语境、等待、显化或消费结论。 | 阻塞 | 一旦发生会让相邻状态、UI 或执行缓存替代治理裁决。 |
| Policy effective fact 与 AIPolicyDef、runtime policy cache、capability whitelist、tool execution 或 external GRC status 混写风险 | 数据所有权;依赖方向;技术机制;安全边界;配置治理 | 当前按 Policy 生效事实归 Governance 处理,定义、执行、能力和外部系统只可引用、消费或反馈。 | 阻塞 | 一旦发生会让定义层、执行层或外部系统反向定义 Policy truth。 |
| Control / AIIA / SoA governance conclusion 与标准正文、artifact / evidence body、method definition body 或 external GRC document 混写风险 | 数据归属;外部引用;审计追溯;archive / observability handoff | 当前按治理结论归 Governance、正文归来源仓或外部系统处理。 | 阻塞 | 一旦发生会让 Governance 保存第二份合规正文。 |
| Nonconformity corrective loop 退化为 bug、work blocker、observability alert、report comment 或普通任务风险 | 核心能力闭环;状态变化;责任语境;跨仓协作 | 当前按正式不符合、原因、纠正、复验和关闭闭环处理。 | 阻塞 | 一旦发生会破坏治理纠正闭环和关闭依据。 |
| shared rules 不可覆盖语义被低 scope Policy、项目配置、runtime 默认值或 timeout fallback 弱化风险 | Policy 层级;自动化授权;配置变更;安全横切 | 当前按组织级 shared rules 硬约束处理,低层配置和执行默认值不得覆盖。 | 阻塞 | 一旦发生会破坏治理安全边界。 |
| report、dashboard、external GRC export、reconciliation、archive preparation 或 projection rebuild 反写真相风险 | read model;report;external export;reconciliation;后台维护 | 当前派生、导出、对账、归档准备和投影重建只能消费、解释或交接,不能创建或改写治理事实。 | 阻塞 | 一旦发生会形成第二 Governance truth。 |
| 外部正文通过 ref、snapshot、safe summary、evidence、report、handoff 或 maintenance 进入 Governance truth 风险 | 数据所有权;外部快照;审计追溯;配置控制 | 当前所有外部材料只能以 ref / snapshot / safe summary / marker / handoff 语义承接,正文禁止入仓。 | 阻塞 | 该风险命中正文归属一票否决。 |
| 同步成功伪装 runtime cache、report、external GRC、observability 或 archive handoff 已完成风险 | 通信方式;一致性分层;韧性 / 恢复;验收证据 | 当前同步只证明核心治理事实成立、拒绝、挂起或失败,外围消费和交接必须有独立状态。 | 阻塞 | 该风险会制造伪一致,使最终一致失败不可解释。 |
| 非 `L0-core` sibling repo 成为编译期业务依赖风险 | 依赖方向;跨仓协作;技术选型;实施边界 | 当前只允许非 core sibling 通过运行期接缝、事件、ref、snapshot、safe summary 或 handoff 协作。 | 阻塞 | 一旦发生会破坏全局依赖裁剪和 L1 平权 truth 域。 |
| 旧 external GRC、Policy engine、audit store、report system 和旧性能数字回流为当前硬主线风险 | 架构目标;技术机制;备选方案;演进路线;测试验收 | 当前只作为历史候选输入暂存,不得高于 Step 1~13 已收稳结论。 | 不阻塞 | 风险已识别,只要不回流为 truth source、产品前置或硬指标,可带约束推进。 |
| 完整 ES / CQRS、rule engine 或 external GRC 产品被过早锁定或被完全遗忘风险 | 技术机制;备选方案;详细设计;ADR;演进路线 | 当前保留 traceability / event collaboration / handoff,完整范式和产品承载后续按压力判断。 | 不阻塞 | 当前不锁定不代表排除,但后续不能由实现自行选边。 |
| 后续 Agent 因 API、状态机、schema、port、存储或产品未定而自行补真相源风险 | 概要设计;详细设计;测试方案;配置设计;实现 boundary | 当前明确这些内容进入后续对应文档,不得在实现中临时造字段、状态、端口或产品口径。 | 有条件阻塞 | 如果对应详细设计仍未闭合就进入实现,该风险会阻塞落码。 |

### 7.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| Governance API / Command / Query / Event / Job / DTO 名称、字段和错误语义 | 概要设计;详细设计;测试方案;实现 boundary | 缺正式协议、字段级契约和错误映射 | 当前只保留能力级交互和边界,不预支接口签名 | 不影响架构主线成立,但影响后续可落码性。 |
| Governance context、Gate、Decision、Approval、Policy、Control、AIIA、SoA、Nonconformity、traceability、handoff 的对象 schema、状态集和迁移规则 | 详细对象契约;状态矩阵;持久化;测试方案 | 缺字段级对象、状态和转换表 | 当前只固定 Governance truth、显式变化、强一致和不可伪成功 | 后续不能由实现临时补状态或字段。 |
| Gate 六类可解释语境的正式承载方式 | Gate / Decision 协议;traceability;查询结果;验收证据 | 缺对象 / 协议 / 追溯记录中的字段归属 | 当前按触发、请求、候选、证据、责任和结论语境挂起 | 该事项影响裁决可解释性,不改变 Decision truth 归属。 |
| Policy 生效、scope、priority、conflict、shared rules、例外豁免、自动授权和 timeout fallback 的字段级判定口径 | Policy 对象;规则机制;runtime consumption;安全测试 | 缺详细规则表、冲突处理和自动化授权口径 | 当前只固定 Policy truth 归 Governance、shared rules 不可被低 scope 覆盖 | 不能由 rule engine 或 runtime cache 反向定义。 |
| Control applicability / review、AIIA / SoA coverage、evidence freshness、external standard mapping 和周期重评的详细承载口径 | Control / AIIA / SoA 对象;artifact / method 协作;测试证据 | 缺字段级 schema、引用状态和评审周期口径 | 当前只固定治理结论归 Governance、正文归来源仓 | 该事项影响详细设计和测试证据,不允许正文入仓。 |
| Nonconformity severity、corrective action、verification、closure、reopen、root-cause 和外部协作流程 | Nonconformity 对象;跨仓事件;Work / Observability 协作;验收标准 | 缺状态、原因、责任、复验和关闭字段口径 | 当前只固定正式纠正闭环 truth,不退化为任务或告警 | 后续流程细化不得让 Work blocker 或 alert 替代治理闭环。 |
| Governance traceability / evidence / handoff 与 `L4-observability`、`L4-archive` 的正式交接 schema、回链验证和失败恢复口径 | 横切追溯;archive / observability handoff;事件协作;验收证据 | 缺交接 schema、回链、失败状态和恢复规则 | 当前只保留治理追溯语义和 handoff 接缝,不拥有物理 ledger / archive body | 不影响当前 truth 边界,但影响审计和归档验收。 |
| report / dashboard / workspace / console / conversation display / external GRC export 的只读 derived view 和导出映射口径 | query / projection;external export;reconciliation;消费面验收 | 缺视图身份、映射规则、stale / rebuild / export 状态 | 当前按只读派生和导出挂起,不得反写真相 | 该事项影响消费体验和 external GRC 集成,不改变核心 truth。 |
| runtime cache / capability consumption 对 Policy 的消费状态、unsupported policy、stale / failed / retryable marker 的正式 schema | runtime seam;Policy consumption;事件;配置设计;测试方案 | 缺消费状态、marker 字段和失败处理口径 | 当前只固定 runtime / capability 消费 Policy,不定义 Policy truth | 该事项影响自动化执行边界和失败可解释性。 |
| 完整 ES / CQRS、rule engine、Policy DSL、simulation、external GRC 产品是否升级为 ADR 级决策 | 技术机制;ADR;详细设计;演进路线 | 缺对象、状态、事件、重放、规则复杂度和外部集成压力确认 | 当前作为后续演进和 ADR 候选挂起 | 当前不锁定,也不排除;不能由实现自行选边。 |
| 旧性能、Policy 下发、report 延迟、archive handoff、audit coverage 等候选数字是否硬化为正式 SLO | 横切性能;测试方案;验收标准;容量评估 | 缺正式负载模型、测量方法和验收数据 | 当前只保留结构性性能预算,旧数字不作为硬指标 | 不能继承旧数字或随意补数。 |
| 具体 DB、message bus、cache、search、rule engine、object storage、audit store、external GRC 产品是否进入配置和实施基线 | 容器部署;配置设计;实施计划;容量验证 | 缺产品级输入、运行约束和容量模型 | 当前只固定承载角色和架构机制,不锁产品 | 产品选择不得推翻依赖、数据、交互和一致性边界。 |

### 7.3 当前处理口径说明短文

本章把已经明确会打穿 Governance truth、职责边界、依赖方向、数据归属、一致性分层或关键交互的问题写成风险,把仍缺对象、状态、协议、产品、容量或跨仓交接确认的问题写成待确认事项。风险的当前处理口径只说明如何保守约束或暂存,不写最终修复方案;待确认事项只说明缺什么确认和当前如何挂起,不预支详细设计结论。可接受债务和后续演进项本身不是风险,但如果后续实现用它们绕过正文排除、Policy / shared rules、派生不反写或依赖裁剪,就会转化为阻塞问题。任何不确定项都不得为了形成完整叙事而回填成前文确定结论。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §15 “风险与待确认事项”直接摘录并整理本文件 §7.1、§7.2 和 §7.3。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把风险与待确认事项拆成两张表 | A. 拆开;B. 合并为问题清单;C. 写成任务 backlog | A | A 符合书写规范 §4.15,能区分已知风险和缺失确认 | 已确认采用 A |
| 是否把旧 external GRC / Policy engine / report / audit store / 性能数字回流列为风险 | A. 列为非阻塞风险;B. 删除;C. 重新纳入主线 | A | 这是本轮重校准要防止的问题,但只要保持历史输入身份就不阻塞 | 已确认采用 A |
| 是否把外部正文入仓、相邻状态替代 Decision、Policy truth 被执行层反向定义、派生反写、非 core 编译期依赖列为阻塞风险 | A. 列为阻塞;B. 列为不阻塞;C. 写成待确认 | A | 这些问题会直接破坏 Governance 独立 truth 和架构边界 | 已确认采用 A |
| 是否在本步决定具体 API / 状态 / rule engine / external GRC / 数据库 / report 产品 | A. 现在决定;B. 挂起到后续设计;C. 删除不提 | B | 架构层应固定边界和承载口径,具体产品和接口不能在本步脑补 | 已确认采用 B |
| 是否把完整 ES / CQRS 或 Policy DSL 写成当前必选 | A. 当前必选;B. 保留观察,后续 ADR 决策;C. 完全排除 | B | 当前已有追溯、事件协作和 handoff,完整范式需等待详细设计和审计压力验证 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 15 的待确认事项。§7.2 所列内容均作为后续概要设计、详细设计、测试方案、验收标准、配置设计和实施计划需要继续确认的架构输入。

---

## 10. 进入下一步条件

- 已明确拆分正式风险与待确认事项。
- 已说明每项风险的影响范围、当前处理口径和阻塞性。
- 已说明每项待确认事项的影响范围、缺失确认和当前挂起口径。
- 未把任务 backlog、TODO、最终解决方案、已定结论或普通愿望写成风险 / 待确认事项。
- 未为了形成完整叙事而脑补确定性架构结论。
- 可以进入 Step 15“ADR 与需求追溯”。
