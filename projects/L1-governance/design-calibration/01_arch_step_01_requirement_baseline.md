# Step 1. 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

确认当前架构设计依赖的需求结论已经收敛到足以支撑架构推导的程度,并识别哪些需求结论会直接影响系统边界、数据所有权、依赖方向和一致性策略。本步只提炼对架构有约束力的需求结论,不重写需求文档全文,不定义容器、模块、协议、状态机、数据库或技术栈。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 已按需求 SOP Step 1~17 重建 | 作为架构设计直接需求基线 |
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 识别上游承接来源 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 提炼本仓定位和非职责 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 提炼依赖裁剪和禁止依赖 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | 已完成 | 固定 C-GOV-1~C-GOV-5 核心闭环 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | 已完成 | 提炼边界规则和禁止行为 |
| `design-calibration/00_req_step_11_data_ownership.md` | 已完成 | 提炼真相、快照、引用和禁止正文边界 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | 已完成 | 提炼验收与一票否决边界 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 识别后续设计待确认项 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 检查需求闭环和漏项 |
| 旧 `projects/L1-governance/01-架构设计.md` | 旧 Draft | 只作为问题诊断来源 |

---

## 3. SOP 问题回答

### 3.1 当前架构设计依赖哪些需求结论?

当前架构设计直接依赖新版 `00-需求文档.md` 中已经闭合的以下需求结论:

| 编号 | 需求结论 | 对架构的约束 |
|---|---|---|
| ARB-GOV-001 | `L1-governance` 是治理决策与治理控制真相仓 | 架构必须围绕正式治理事实组织,不能退化为审批 UI、policy cache、artifact 副本或外部 GRC 适配层 |
| ARB-GOV-002 | Gate / Approval / Decision、Policy effective fact、shared rules、Control、AIIA / SoA 治理结论、Nonconformity 是本仓主线事实 | 架构必须能承载这些事实的生命周期、追溯和消费边界 |
| ARB-GOV-003 | ProcessInstance、Activity、waiting gate state、checkpoint 和 recovery truth 不归 Governance | 架构必须区分 Gate / Decision truth 与 process waiting state |
| ARB-GOV-004 | Project、WorkItem、Iteration、blocker、dependency 和 project member truth 不归 Governance | 架构不得把 work lifecycle 或项目事实写成治理裁决 |
| ARB-GOV-005 | Artifact、Evidence、AIIA / SoA 文档正文、baseline 和 archive package 正文不归 Governance | 架构必须把治理结论与 artifact / evidence 正文分开 |
| ARB-GOV-006 | AIPolicyDef、Control definition、method、template 和标准正文不归 Governance | 架构必须区分定义来源与 Policy / Control 生效事实 |
| ARB-GOV-007 | Runtime enforcement、agent loop、tool execution、policy cache 和 capability registry 不归 Governance | 架构不得让 runtime / capability 执行层反向定义 Policy truth |
| ARB-GOV-008 | 查询、报表、投影重建、对账、归档准备和维护任务不得隐式改变业务治理结论 | 架构必须隔离写路径、读路径、维护路径和归档交接路径 |
| ARB-GOV-009 | `L0-core` 是唯一编译期依赖;其他 L1/L2/L3/L4 仓不得成为 package dependency | 架构依赖方向必须通过运行期、事件、adapter、引用或快照边界表达 |
| ARB-GOV-010 | C-GOV-1~C-GOV-5 核心闭环必须成立 | 架构目标必须覆盖治理语境、正式裁决、Policy / Control、AIIA / SoA / Nonconformity、消费追溯 |
| ARB-GOV-011 | 外围增强不阻塞当前核心闭环 | 高级看板、Policy DSL、复杂 Gate 编排、自动草拟、外部 GRC 和健康度分析不能被误写为当前必达核心范围 |
| ARB-GOV-012 | 旧性能 / SLA 数字只是候选目标 | 架构可保留性能方向,但不能把旧 `150ms / 200ms / 50ms / 30s / 99.95%` 直接写成已验证硬验收 |

### 3.2 这些需求结论里哪些已经稳定?

| 稳定结论 | 判断 |
|---|---|
| 仓定位 | 稳定。`L1-governance` 是治理决策与治理控制真相仓。 |
| 真相边界 | 稳定。Governance 只拥有治理事实,相邻仓正文和执行正文禁止入仓。 |
| 核心闭环 | 稳定。C-GOV-1~C-GOV-5 均有故事、功能、规则、数据和验收承接。 |
| 依赖裁剪 | 稳定。唯一编译期依赖为 `L0-core`;其他仓只能运行期、事件协作、引用、快照或 adapter 协作。 |
| 验收否决项 | 稳定。核心闭环断裂、治理事实污染、边界打穿、关键变化不可追溯和非 core 编译依赖均为否决项。 |

### 3.3 哪些需求结论仍然待确认?

当前没有阻塞架构 Step 2 的需求缺口。下列事项已在需求文档 §15 挂起,属于后续架构、概要、详细、配置、测试或实施阶段的细化问题:

| 待确认事项 | 当前架构处理口径 |
|---|---|
| API / Command / Query / Event 名称和字段形态 | 不在 Step 1 定义;后续详细设计收敛 |
| Governance context、Gate、Decision、Approval、Policy、Control、AIIA、SoA、Nonconformity 的详细对象 schema、状态集和迁移规则 | 不在 Step 1 定义;后续详细设计对象契约和状态矩阵收敛 |
| Gate 六类可解释语境的字段承载方式 | 架构只保留必须有触发、请求、候选、证据、决策责任和结论六类语境的原则 |
| Policy 生效、冲突、shared rules、自动裁决和默认超时裁决的详细判定方式 | 架构只保留 shared rules 不可覆盖和正式授权边界,不选 DSL / engine |
| Control 基线、AIIA / SoA 覆盖、适用 / 排除和批准结论的字段级承载方式 | 架构只保留治理结论与正文引用分离原则 |
| Nonconformity 高严重处置、纠正、复验和关闭的详细流程 | 架构只保留正式治理处置闭环原则 |
| Governance audit / traceability fact 与 observability audit store 的交接协议 | 架构只保留 Governance 拥有追溯事实、observability 拥有物理存储原则 |
| 旧性能 / 下发 / SLA 候选目标是否升级为正式测试目标 | 架构可列为候选 SLO,不得写成已验证硬指标 |
| PostgreSQL、object storage、审计物理存储或外部 GRC 集成是否进入正式配置和实施基线 | 后续架构技术选型和配置设计再收敛 |

### 3.4 哪些需求会直接影响架构边界?

| 需求 | 影响的架构边界 |
|---|---|
| Governance 是治理事实真相仓 | 必须保留独立 governance service / domain 边界 |
| Gate / Decision 不等于 process waiting state | Decision boundary 与 Process pause / waiting boundary 必须分开 |
| Policy effective fact 不等于 AIPolicyDef / runtime cache / capability whitelist | Policy truth、definition source、execution cache 和 capability registry 必须分开 |
| Control / AIIA / SoA 结论不等于标准原文或 artifact 正文 | Compliance conclusion boundary 与 artifact / method-library body boundary 必须分开 |
| Nonconformity 不等于 bug / work blocker / observability alert | Corrective loop boundary 与 work / observability boundary 必须分开 |
| 查询、报表、对账和归档准备不得反写真相 | write model、read model、maintenance model、archive handoff boundary 必须分开 |

### 3.5 哪些需求会直接影响数据所有权?

| 数据类别 | 架构影响 |
|---|---|
| Governance 真相 | 架构必须为 governance context、Gate / Decision、Approval、Policy effective fact、shared rules、Control、AIIA / SoA 结论、Nonconformity 和 governance traceability record 留出主真相承载 |
| 外部快照 | 架构可接收 process、work、artifact、conversation、identity、method-library、runtime、capability、observability 等摘要,但必须能表达来源和滞后状态 |
| 外部引用 | 架构必须通过 Ref / metadata / trace context 保持相邻仓可追溯连接 |
| 禁止正文 | 架构不得设计任何保存相邻仓正文、runtime 执行正文、conversation / UI 正文、observability 正文或 external GRC 正文的主路径 |

### 3.6 哪些需求会直接影响依赖方向或一致性策略?

| 需求 | 影响 |
|---|---|
| `L0-core` 唯一编译期依赖 | 内部层次和 package dependency 必须遵守裁剪规则 |
| 其他仓通过运行期 / 事件协作 / adapter / 引用 / 快照协作 | 架构需要明确 port、adapter、consumer、publisher、resolver 和 snapshot 边界 |
| 重复输入不得产生重复治理事实或分叉结论 | 架构必须支持幂等和冲突识别 |
| 正式裁决形成后不得原地改写 | 架构必须支持 append-only decision correction / superseding path |
| shared rules 不得被低 scope 覆盖 | 架构必须能表达 priority / scope / conflict resolution 层级 |
| 投影可滞后但不得反写真相 | 架构必须区分强一致写模型与最终一致消费模型 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `01-架构设计.md` 文档元信息 | 状态为 Draft,日期为 2026-05-11 | 与当前新版需求基线日期和链路不一致 | Step 16 删除旧文件后重建 |
| 旧 `01-架构设计.md` §1~§3 | 把 Gate 六段式、SoA 38 控制项、旧性能数字和旧技术假设直接写成架构目标 | 新版需求已将旧数字和部分合规细节降为候选或后续细化项 | 不直接继承旧硬目标,后续 Step 2 / Step 10 重新收敛 |
| 旧 `01-架构设计.md` §4 | 把 PostgreSQL、artifact、runtime、conversation SLA 等作为架构依赖和降级前提 | 需求层已明确外部系统不是当前主链依赖,PostgreSQL 是实现候选 | 后续依赖和技术选型重新判断 |
| 旧 `01-架构设计.md` | Gate / Policy / Control / AIIA / SoA / Nonconformity 与实现聚合草案混写 | 缺少新版需求基线追溯,容易把历史对象细节直接升级为架构事实 | 架构校准按 SOP 重建中间产物 |
| 旧文档链 | 缺少当前 `04-配置设计.md` / `07-实施计划.md` 新链路 | 不符合当前项目文档体系 | 正式文档重建时补齐链路 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构输入 | 旧 `00` / 旧 README / domain README 混合 | 新版 `00-需求文档.md` 为直接基线 | 避免旧口径残留 |
| 架构主线 | Gate / Policy / Control / AIIA / SoA / Nonconformity 直接按旧对象草案展开 | 先以治理事实边界、职责、上下文、依赖方向和数据所有权为架构主线 | 保持需求到架构的推导关系 |
| 技术和存储 | 旧文档预设 PostgreSQL 和部分 SLA | Step 1 不做技术定稿 | 技术选型属于 Step 10 |
| 性能目标 | 旧数字直接写目标值 | 旧数字降为候选目标 | 与新版需求 §13 / §15 一致 |
| 依赖边界 | 旧文档未完整体现唯一编译期依赖 | 明确 `L0-core` 唯一编译期依赖 | 与需求裁剪和验收否决项一致 |
| 风险处理 | 部分不确定项隐含在正文 | 显式列入待确认或后续细化 | 防止后续自行脑补 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接修补旧 `01-架构设计.md` | 快 | 旧口径残留风险高,难以追溯到 Step | 不采用 |
| 方案 B: 按架构 SOP 生成 Step 1~16 中间产物后重建正式文档 | 可追溯,能逐步消除旧口径 | 需要更多步骤 | 采用 |
| 方案 C: 在 Step 1 直接确定技术栈、存储和容器 | 进展看似更快 | 越过 Step 2~Step 10,会把候选项写成结论 | 不采用 |
| 方案 D: 把需求 §15 的待确认项全部视为架构阻塞 | 保守 | 会让架构承担详细设计职责 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否保留旧 PostgreSQL / SLA / SoA 38 控制项硬目标口径?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 延续旧架构技术和硬指标假设 | 可能与新版需求的候选目标和后续选型流程冲突 |
| 方案 B | Step 1 不继承旧技术栈和旧硬指标,Step 2 / Step 10 / 测试阶段重新收敛 | 保持需求到架构的推导关系 |

推荐方案 B。原因是旧技术和指标属于历史输入,不是新版需求基线结论。

#### 外围增强是否进入架构硬前提?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 高级看板、Policy DSL、复杂 Gate 编排、自动草拟、外部 GRC 和健康度分析全部作为当前硬目标 | 会扩大当前核心闭环范围 |
| 方案 B | 作为演进和风险线索保留,不阻塞当前核心架构 | 与需求 §15 一致 |

推荐方案 B。原因是当前架构应优先保护 C-GOV-1~C-GOV-5 核心闭环。

---

## 7. 结构化中间产物

### 7.1 需求基线结论

| 结论编号 | 需求基线结论 | 架构承接方式 |
|---|---|---|
| RB-GOV-001 | `L1-governance` 是治理决策与治理控制真相仓 | 架构围绕 Governance truth、read model、maintenance boundary 和 handoff boundary 组织 |
| RB-GOV-002 | Governance 不拥有 process / work / artifact / conversation / identity / method-library / runtime / capability / observability / workspace / archive / external GRC 正文或 truth | 架构通过引用、快照、事件、resolver 和 adapter 协作 |
| RB-GOV-003 | Gate / Decision、Approval、Policy、shared rules、Control、AIIA / SoA 结论、Nonconformity 和追溯记录是本仓主事实 | 架构必须保留这些事实的生命周期、决策不可原地改写和追溯路径 |
| RB-GOV-004 | C-GOV-1~C-GOV-5 核心闭环必须成立 | 架构目标必须覆盖治理语境、裁决、Policy / Control、合规纠正闭环和消费追溯 |
| RB-GOV-005 | 查询、投影、报告、对账、归档准备和维护不得反写真相 | 架构必须隔离写路径与读 / 维护 / 归档路径 |
| RB-GOV-006 | `L0-core` 是唯一编译期依赖 | 架构依赖方向和实现计划必须执行依赖裁剪 |
| RB-GOV-007 | 旧性能 / SLA 数字为候选目标 | 架构可把性能作为质量目标,但不把旧数字定为硬验收 |
| RB-GOV-008 | 外围增强不阻塞核心闭环 | 架构可保留高级治理看板、Policy DSL、复杂 Gate 编排、自动草拟、外部 GRC 和健康度分析作为演进能力 |

### 7.2 架构硬约束结论

| 约束编号 | 硬约束 | 影响章节 |
|---|---|---|
| HC-GOV-001 | 不得接管 process / work / artifact / conversation / identity / method-library / runtime / capability / observability / workspace / archive / external GRC truth | §4 职责边界;§8 依赖方向;§9 数据所有权 |
| HC-GOV-002 | 不得保存相邻仓正文、runtime 执行正文、conversation / UI 正文、observability 正文或 external GRC 正文 | §9 数据所有权;§13 横切关注点 |
| HC-GOV-003 | Gate / Decision truth 不得由 process waiting state、work lifecycle、conversation UI 或 runtime cache 替代 | §4 职责边界;§10 关键交互 |
| HC-GOV-004 | Policy effective fact 不得由 AIPolicyDef、runtime cache、capability whitelist 或 tool execution 反向定义 | §6 限界上下文;§8 依赖方向;§9 数据所有权 |
| HC-GOV-005 | AIIA / SoA 和 Control 结论必须引用正文来源,不得复制标准原文或 artifact / evidence body | §9 数据所有权;§10 关键交互 |
| HC-GOV-006 | Nonconformity 必须保持治理纠正闭环,不得退化为 bug、work blocker 或 observability alert | §6 限界上下文;§10 关键交互 |
| HC-GOV-007 | 唯一编译期上游限定为 `L0-core` | §8 依赖方向 |
| HC-GOV-008 | 投影、查询、报告、对账、归档准备和维护任务不得隐式创建、修改、批准或关闭治理事实 | §7 容器;§9 数据所有权;§13 横切关注点 |

### 7.3 未关闭需求风险结论

| 风险 | 当前状态 | 是否阻塞 Step 2 |
|---|---|---|
| API / Command / Event 形态未定 | 后续详细设计职责 | 否 |
| 状态集和迁移规则未定 | 后续详细设计职责 | 否 |
| Gate 六类可解释语境字段未定 | 后续对象契约和协议职责 | 否 |
| Policy DSL / engine / conflict resolution 细节未定 | 后续架构目标、技术选型和详细设计职责 | 否 |
| Control 基线、AIIA / SoA 覆盖字段未定 | 后续详细设计和测试职责 | 否 |
| Governance traceability fact 与 observability audit store 交接协议未定 | 后续关键交互、配置和详细设计职责 | 否 |
| 旧性能指标是否升级未定 | 后续测试与容量验证 | 否 |
| 存储实现和外部 GRC 集成未定 | 后续技术选型和配置设计 | 否 |
| 相邻仓正文进入 Governance 或非 core 仓成为编译期依赖 | 后续若发生则一票否决 | 不阻塞 Step 2,但必须作为硬约束 |

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前文档问题诊断”小节,了解本章如何从新版需求基线排除旧架构残留口径。

本文首先承接 `projects/L1-governance/00-需求文档.md` 已收稳的需求基线,再向上追溯产品、全局架构、ADR 和相邻仓设计结论。本文不重新定义需求、业务规则、数据归属或验收标准,只把这些结论转译为系统结构、职责边界、依赖方向、数据所有权、一致性策略、技术取舍和演进约束。

旧版 `01-架构设计.md` 中的 PostgreSQL、旧 SLA 硬目标、旧 SoA 38 控制项直接硬化和旧文档链只作为历史输入,不作为新版架构真相源直接继承。
```

```md
## 3. 约束条件

本章应摘录:

- `design-calibration/01_arch_step_01_requirement_baseline.md` §7.1 需求基线结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §7.2 架构硬约束结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §7.3 未关闭需求风险结论。
```

```md
## 16. 需求追溯矩阵

本章应承接 `00-需求文档.md` §16 的需求追溯结论,并在架构层补充每个核心需求如何进入职责边界、系统上下文、依赖方向、数据所有权、一致性策略和技术取舍。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | 是否需要在 Step 2 把旧性能 / SLA 数字列入架构候选 SLO | 建议列为候选质量目标,不写成硬验收 |
| Q-002 | 是否需要在 Step 2 明确高级看板、Policy DSL、复杂 Gate 编排、自动草拟和外部 GRC 不属于当前核心闭环 | 建议写成架构非目标或演进事项 |
| Q-003 | 是否需要在 Step 10 重新选择存储、规则表达和外部 GRC 集成策略 | 需要。旧 PostgreSQL / 外部 GRC 口径不得直接继承 |

---

## 10. 进入下一步条件

- 已明确哪些需求可直接作为架构前提。
- 已明确哪些需求仍然待确认,且这些待确认项不阻塞 Step 2。
- 已明确会影响架构边界、数据所有权、依赖方向和一致性策略的需求结论。
- 已识别旧 `01-架构设计.md` 的残留口径,不会在新版架构中直接继承。
- 可以进入 Step 2“明确架构目标与约束”。
