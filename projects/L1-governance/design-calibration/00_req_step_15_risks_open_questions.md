# Step 15. 风险与待确认事项

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 15
> 回填章节: `00-需求文档.md` §15 风险与待确认事项
> 生成日期: 2026-06-06

---

## 1. 本步目标

显式收纳 `L1-governance` 需求校准中仍需要持续约束的风险和待确认事项,防止后续概要设计、详细设计、测试方案或实现 Agent 为了补齐内容而自行脑补确定性结论。本步不新增功能、不补写规则、不做设计方案选择,也不把普通 TODO 或外围增强清单包装成风险。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| Step 1~Step 14 中间产物 | 已完成 | 汇总已经收口的关键结论和仍需显式约束的不确定性 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 提取边界打穿、治理约束和审计约束风险 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 提取正文入仓、快照成真相、引用越界风险 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | Step 13 已完成 | 提取候选性能指标和可用性 / 可观测性不确定性 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | Step 14 已完成 | 提取一票否决边界和验收口径 |
| 旧 `projects/L1-governance/00-需求文档.md` / `06-验收标准.md` | 旧输入 | 识别旧口径中仍可能影响后续文档的残留风险 |

---

## 3. SOP 问题回答

### 3.1 当前还有哪些尚未关闭的风险?

当前风险不是“功能还没实现”,而是后续设计和实现中容易重新串线的需求边界风险:

| 风险 | 当前判断 |
|---|---|
| Gate / Decision 与 process waiting state、work lifecycle、conversation UI 或 runtime cache 在后续设计中再次混写 | 高风险。它会直接破坏 Governance / 相邻仓边界。 |
| Policy effective fact 与 AIPolicyDef、runtime policy cache、capability whitelist 或 tool execution 在后续设计中再次混写 | 高风险。它会导致执行层或定义层反向定义 Policy truth。 |
| Control / AIIA / SoA 治理结论与标准原文、artifact / evidence 正文或外部 GRC 文档在后续设计中再次混写 | 高风险。它会让 Governance 保存第二份合规正文。 |
| Nonconformity 纠正闭环退化为 bug、work blocker、observability alert 或普通备注 | 高风险。它会破坏治理纠正闭环。 |
| shared rules 不可覆盖语义在后续 Policy 设计中弱化 | 高风险。它会破坏组织级安全边界。 |
| 维护、报告、对账、归档准备或投影重建被设计成可改写治理业务结论 | 高风险。它会让消费面或维护面反写真相。 |
| 旧 P95、Policy 下发、SLA 和 audit coverage 数字被误认为需求层硬验收 | 中风险。它会让后续验收伪量化。 |
| 高级 Policy DSL、复杂 Gate 编排、AIIA / SoA 自动草拟、外部 GRC 集成和高级看板被误升级为核心闭环能力 | 中风险。它会加重当前需求范围。 |
| 需求层未定义 API / 状态机 / 存储后,后续 Agent 可能自行补设计 | 中风险。它会在概要 / 详细设计前形成隐含口径。 |

### 3.2 这些风险会影响哪一层需求结构?

| 风险类型 | 主要影响范围 |
|---|---|
| 治理裁决与相邻状态混淆风险 | §2 本仓定位、§7 核心闭环、§9 功能需求、§10 业务规则、§11 数据归属、§14 验收标准 |
| Policy truth 与定义 / 执行混淆风险 | §2 本仓定位、§6 使用方与依赖、§9 功能需求、§10 业务规则、§12 接口与依赖、§14 验收标准 |
| Control / AIIA / SoA 正文边界风险 | §4 目标 / 非目标、§9 功能需求、§10 业务规则、§11 数据归属、§14 验收标准 |
| Nonconformity 纠正闭环风险 | §7 核心闭环、§9 功能需求、§10 业务规则、§14 验收标准 |
| 维护面反写真相风险 | §9 功能需求、§10 业务规则、§11 数据归属、§12 接口与依赖、§14 验收标准 |
| 非功能伪量化风险 | §13 非功能需求、§14 验收标准、后续测试方案 |
| 外围增强误入核心风险 | §7 核心闭环、§8 用户故事、§9 功能需求、§14 验收标准 |
| 需求粒度漂移风险 | §9 功能需求、§10 业务规则、§12 接口与依赖、后续概要 / 详细设计 |

### 3.3 当前还有哪些待确认事项?

待确认事项只保留会影响后续设计口径的问题。前序 Step 中已经明确推荐并被后续决策吸收的问题,不在本步重复列为待确认。

当前仍需挂起的问题集中在后续设计阶段的细化口径:

1. Governance 具体 API / Command / Query / Event 名称和字段形态。
2. Governance context、Gate、Decision、Approval、Policy、Control、AIIA、SoA、Nonconformity 的详细对象 schema、状态集和迁移规则。
3. Gate 六类可解释语境如何在正式对象 / 协议中承载。
4. Policy 生效、冲突、shared rules、授权、自动裁决和默认超时裁决的详细判定方式。
5. Control 基线、AIIA / SoA 覆盖、适用 / 排除和批准结论的字段级承载方式。
6. Nonconformity 高严重处置、纠正、复验和关闭的详细流程与外部协作方式。
7. Governance audit / traceability fact 与 observability audit store 的正式交接协议。
8. 旧性能 / 下发 / SLA 候选指标是否会在测试和容量阶段转为正式目标。
9. PostgreSQL、object storage、审计物理存储或外部 GRC 集成是否进入正式配置和实施基线。

### 3.4 哪些待确认项会影响前文结论是否成立?

这些待确认项不会推翻当前需求结论,但会影响后续文档如何细化:

| 待确认类型 | 对前文结论的影响 |
|---|---|
| API / Command / Event 细节 | 不影响需求层能力边界;影响详细设计和实施计划 |
| 对象 schema、状态集和迁移规则 | 不影响“显式变化”和“治理 truth”原则;影响详细设计对象契约和状态矩阵 |
| Gate 六类可解释语境承载 | 不影响 Gate 裁决完整性原则;影响详细设计字段和协议 |
| Policy / shared rules 判定方式 | 不影响 shared rules 不可覆盖和 Policy truth 归属;影响规则引擎和 port 设计 |
| Control / AIIA / SoA 字段级承载 | 不影响正文边界和治理结论归属;影响详细设计、测试方案和 artifact 协作 |
| Nonconformity 流程细节 | 不影响纠正闭环原则;影响详细设计流程和跨仓事件 |
| audit / observability 交接协议 | 不影响 Governance 拥有自身追溯事实;影响观测交接和审计存储实现 |
| 性能候选指标 | 不影响核心闭环是否成立;影响测试方案和容量验收 |
| 存储 / 外部 GRC | 不影响需求层数据归属;影响架构、配置和实施计划 |

### 3.5 哪些风险当前阶段可接受,哪些会阻塞后续推进?

| 分类 | 风险 / 待确认项 | 当前判断 |
|---|---|---|
| 当前可接受 | API 名称、字段 schema、状态集、存储实现、事件 schema、具体证据格式尚未细化 | 属于概要 / 详细 / 配置设计职责,不阻塞需求文档进入 Step 16。 |
| 当前可接受 | 旧性能、Policy 下发、SLA 和 audit coverage 数字未转为硬指标 | 已作为候选目标暂存,不阻塞需求文档。 |
| 当前可接受 | Policy DSL、复杂 Gate 编排、自动草拟、外部 GRC、高级看板未纳入核心闭环 | 已按外围增强处理,不阻塞核心需求。 |
| 后续若发生则阻塞 | Governance 接管 process、work、artifact、conversation、identity、method-library、runtime、capability、observability、workspace、console 或 external GRC 真相 | 命中一票否决,必须回退修正。 |
| 后续若发生则阻塞 | Gate / Decision 被相邻仓状态、UI 或 runtime cache 替代 | 命中治理裁决真相污染,必须回退修正。 |
| 后续若发生则阻塞 | Policy truth 被 runtime cache、capability whitelist、tool execution 或 method definition 反向定义 | 命中 Policy truth 边界失败,必须回退修正。 |
| 后续若发生则阻塞 | shared rules 可被低 scope 覆盖 | 命中组织级安全边界失败,必须回退修正。 |
| 后续若发生则阻塞 | 维护、报告、对账、归档准备或投影重建能改写业务治理结论 | 命中消费面 / 维护面反写真相,必须回退修正。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §12 | 风险章节偏实现风险、性能风险和待办事项 | 未按需求结构关联边界、规则、数据和验收 | 改为风险清单 + 待确认事项表 |
| 旧 `06-验收标准.md` | 风险接受和签署属于验收管理 | 不适合直接进入需求 §15 | 后续专项验收文档可保留管理动作 |
| 前序 Step 的 Q 表 | 每步都有方案选择 | 大多数已经被后续决策吸收 | Step 15 只保留仍需挂起的后续设计细化事项 |
| 旧性能 / 容量数字 | 多处出现 | 容易被误读为硬指标 | 作为候选目标暂存,不进入一票否决 |
| 旧 domain README 字段 / RPC / event / INV | 细节丰富 | 容易被误当作当前需求层结论 | 暂按详细设计输入线索,不得直接压过需求层边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险组织 | 风险、遗留、验收管理混写 | 风险清单和待确认事项拆开 | 对齐规范 4.15 |
| 当前处理口径 | 容易写解决方案或空状态 | 写当前如何约束、暂存或归类 | 防止本章继续做设计 |
| 待确认来源 | 原样复制每步 Q 表 | 只保留未由后续决策吸收的问题 | 避免重复和伪不确定 |
| 阻塞判断 | 不清楚哪些会阻塞后续 | 区分当前可接受和后续发生即阻塞 | 便于 Step 16 和后续设计审查 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 原样汇总 Step 1~14 所有 Q 表 | 信息完整 | 大量问题已被后续步骤吸收,会制造重复待确认 | 不采用 |
| 方案 B: 只保留仍需显式约束的风险和后续设计细化事项 | 高信号,便于后续审查 | 需要判断哪些问题已收口 | 采用 |
| 方案 C: 不写待确认事项,认为前序已完全收敛 | 文档干净 | 会掩盖后续设计仍需细化的口径 | 不采用 |
| 方案 D: 在本步解决所有待确认事项 | 看似完整 | 违反 Step 15 职责,会越界进入概要 / 详细设计 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把每个前序 Q 都列入正式待确认事项?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 全部列入 | 会让已收口的边界重新变成未定 |
| 方案 B | 只列后续设计仍需细化的问题 | 保持需求结论稳定 |

推荐方案 B。原因是 Step 15 的目标是约束不确定性,不是重开所有选择。

#### 是否把外围增强能力写成风险?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成“未实现 Policy DSL / 复杂 Gate / 外部 GRC”的风险 | 会把后续增强误写成当前缺陷 |
| 方案 B | 写成“外围增强误入核心闭环”的范围风险 | 保持当前核心需求边界 |

推荐方案 B。原因是外围增强本身不是风险,误升级才是风险。

#### 是否把具体 API / 状态机未定写成阻塞风险?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成需求文档阻塞 | 会让需求层承担详细设计职责 |
| 方案 B | 写成后续设计待确认,当前不阻塞需求 Step 16 | 对齐文档分层 |

推荐方案 B。原因是需求文档只负责能力、边界和验收口径。

---

## 7. 结构化中间产物

### 7.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| Gate / Decision 与 process waiting state、work lifecycle、conversation UI 或 runtime cache 在后续设计中再次混写 | 影响 §2、§7、§9、§10、§11、§14 | 当前按正式治理裁决 truth 收口:Governance 拥有 Gate / Decision,相邻仓只能消费结论或提供语境。 |
| Policy effective fact 与 AIPolicyDef、runtime policy cache、capability whitelist 或 tool execution 在后续设计中再次混写 | 影响 §2、§6、§9、§10、§12、§14 | 当前按 Policy 生效事实归 Governance 处理,定义、执行和工具能力只可引用或反馈。 |
| Control / AIIA / SoA 治理结论与标准原文、artifact / evidence 正文或外部 GRC 文档在后续设计中再次混写 | 影响 §4、§9、§10、§11、§14 | 当前按治理结论归 Governance、正文归 artifact / method-library / external system 处理。 |
| Nonconformity 纠正闭环退化为 bug、work blocker、observability alert 或普通备注 | 影响 §7、§9、§10、§14 | 当前按正式不符合、原因、纠正、复验和关闭闭环处理。 |
| shared rules 不可覆盖语义在后续 Policy 设计中弱化 | 影响 §10、§13、§14 | 当前按组织级硬约束处理,低 scope 不得覆盖。 |
| 维护、报告、对账、归档准备或投影重建被设计成可改写治理业务结论 | 影响 §9、§10、§11、§12、§14 | 当前按消费 / 维护面不得成为写源处理。 |
| 旧 `150ms / 200ms / 50ms / 30s / 99.95%` 指标被误读为需求层硬验收 | 影响 §13、§14、后续测试方案 | 当前按候选目标暂存,后续架构 / 测试阶段验证后再决定是否升级。 |
| 高级 Policy DSL、复杂 Gate 编排、AIIA / SoA 自动草拟、外部 GRC 集成和高级看板被误升级为核心闭环 | 影响 §7、§8、§9、§14 | 当前按外围增强能力处理,不阻塞当前核心需求通过。 |
| 后续 Agent 因需求层未写 API / 状态机 / 存储而自行补设计 | 影响 §12、后续概要 / 详细设计 / 配置 / 实施计划 | 当前按文档分层约束:需求只写能力级接口和边界,协议、状态和存储必须在后续文档正式收敛。 |

### 7.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| Governance 具体 API / Command / Query / Event 名称和字段形态如何定义 | §12、后续概要 / 详细设计 | 当前暂按能力级接口处理,不在需求层固定协议名称和字段。 |
| Governance context、Gate、Decision、Approval、Policy、Control、AIIA、SoA、Nonconformity 的详细对象 schema、状态集和迁移规则如何定义 | §10、§14、后续详细设计 | 当前暂按显式变化和不变量处理,不在需求层定死状态机。 |
| Gate 六类可解释语境如何在正式对象 / 协议中承载 | §10、§14、后续详细设计 | 当前暂按触发、请求、候选、证据、决策责任和结论六类语境处理,不写字段。 |
| Policy 生效、冲突、shared rules、授权、自动裁决和默认超时裁决的详细判定方式如何定义 | §10、§13、§14、后续详细设计 | 当前暂按 shared rules 不可覆盖和正式授权边界处理,不选 DSL / engine。 |
| Control 基线、AIIA / SoA 覆盖、适用 / 排除和批准结论的字段级承载方式如何定义 | §10、§11、§14、后续详细 / 测试 | 当前暂按正式控制基线覆盖和正文引用处理,不复制标准原文。 |
| Nonconformity 高严重处置、纠正、复验和关闭的详细流程与外部协作如何定义 | §9、§10、§14、后续详细设计 | 当前暂按正式治理处置闭环处理,不固定自动触发机制。 |
| Governance audit / traceability fact 与 observability audit store 的正式交接协议如何定义 | §11、§12、§13、后续详细 / 配置 | 当前暂按 Governance 拥有自身追溯事实、observability 拥有物理存储处理。 |
| 旧性能 / 下发 / SLA 候选目标是否升级为正式测试目标 | §13、§14、后续测试方案 | 当前作为候选目标暂存,不强行定为需求层硬指标。 |
| PostgreSQL、object storage、审计物理存储或外部 GRC 集成是否进入正式配置和实施基线 | §12、后续架构 / 配置 / 实施计划 | 当前暂不纳入需求依赖,只在后续架构与配置设计中判断。 |

### 7.3 当前不阻塞项与后续阻塞项

| 类型 | 条目 |
|---|---|
| 当前不阻塞 Step 16 | API / Command / Event 名称未定;对象 schema 未定;状态机未定;事件 schema 未定;存储实现未定;证据 schema 未定;候选性能目标未定;外围增强版本未定 |
| 后续一旦发生即阻塞 | 相邻仓正文进入 Governance;Gate / Decision 被相邻仓状态替代;Policy truth 被 runtime / capability / method definition 反向定义;shared rules 被低 scope 覆盖;AIIA / SoA 正文进入 Governance;Nonconformity 退化为普通任务或告警;维护面反写真相;非 core 仓成为编译期依赖 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §15。正式文档可摘录本文件 §7.1~§7.3 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/00_req_step_15_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前不阻塞项与后续阻塞项”小节,了解本章如何显式约束仍需挂起的不确定性。

本文采用 `design-calibration/00_req_step_15_risks_open_questions.md` §7 的风险与待确认事项结论。当前没有阻塞需求文档进入追溯矩阵的待确认项;API、对象 schema、状态机、事件 schema、证据 schema、存储实现、候选性能目标和外围增强版本范围均后移对应后续文档。若后续出现相邻仓正文进入 Governance、Gate / Decision 被相邻仓状态替代、Policy truth 被执行层或定义层反向定义、shared rules 被低 scope 覆盖、AIIA / SoA 正文进入 Governance、Nonconformity 退化为普通任务或告警、维护面反写真相或非 core 仓成为编译期依赖,则必须回退修正。

正式章节应摘录:

- `design-calibration/00_req_step_15_risks_open_questions.md` §7.1 风险清单。
- `design-calibration/00_req_step_15_risks_open_questions.md` §7.2 待确认事项。
- `design-calibration/00_req_step_15_risks_open_questions.md` §7.3 当前不阻塞项与后续阻塞项。
```

---

## 9. 进入下一步条件

- 已明确拆分风险清单和待确认事项。
- 每条风险都有影响范围和当前处理口径。
- 每条待确认事项都有影响章节和当前状态。
- 已区分当前不阻塞项与后续一旦发生即阻塞项。
- 未把普通 TODO、未来优化项、实施方案或空泛不确定性写进本步。
