# Step 3. 背景与问题定义

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 3
> 回填章节: `00-需求文档.md` §3 背景与问题定义
> 生成日期: 2026-06-06

---

## 1. 本步目标

说明为什么 `L1-governance` 值得在当前阶段单独校准:Quantalithos 需要一处统一的治理事实来源,否则关键决策、策略授权、控制适用、影响评估、适用性声明和不符合纠正会散落在流程等待、任务状态、产物正文、对话显化、runtime cache 和审计日志中。本步只写背景与问题,不写目标、功能、规则、接口、数据归属或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已完成 | 固定上游来源,避免把相邻仓重新定义成问题来源 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-governance` 是治理决策与治理控制真相仓 |
| `projects/L1-governance/00-需求文档.md` §2 | 旧版背景与问题 | 提取关键节点强制人类、Policy / shared_rules、42001 / 9001 合规闭环等背景线索 |
| `projects/L1-governance/README.md` | 旧仓定位材料 | 提取治理中心、下游事件消费、runtime policy cache、capability-hub 等旧问题线索 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取 Gate、Policy、Control、AIIA、SoA、Nonconformity、Approval 和旧边界问题线索 |
| `product/最终目的.md` | 产品叙事上游 | 固定关键节点强制人类、决策必须留痕、AI 自主性必须受控的产品背景 |
| `product/六域模型.md` | 领域模型上游 | 固定 Governance 回答“关键决策由谁定”的领域背景 |
| `projects/L1-process/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 waiting gate 与 Gate decision 混淆风险输入 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 WorkItem / blocker / lifecycle 与 governance decision / Nonconformity 混淆风险输入 |
| `projects/L1-artifact` 旧文档 | 尚未本轮深度校准 | 作为 artifact 正文 / evidence 正文与 AIIA / SoA 治理结论混淆的候选风险输入 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 AIPolicyDef / method definition 与 governance Policy 生效事实混淆风险输入 |
| `methodology/standards-discussion/ISO-42001.md`、`ISO-9001.md`、`ISO-IEC-IEEE-24748-2.md` | 标准讨论输入 | 作为合规、控制、纠正和 Decision Gate 背景线索,不直接生成对象字段 |

---

## 3. SOP 问题回答

### 3.1 当前业务背景是什么？

Quantalithos 的产品叙事要求 AI member 可以参与长期软件项目,但关键节点必须能被人类或治理策略控制,决策必须留痕,自治级别必须可追溯,合规证据链必须能被审计。随着 core、bus、sdk、identity、conversation、work、process 和 method-library 已经收稳,平台需要继续把“关键决策由谁定”收束成独立的 governance 需求基线,让相邻仓围绕同一套治理事实协作。

这类治理事实不是单一审批页面,也不是单个策略缓存。它覆盖关键节点 Gate、Policy 生效、Approval / Decision、控制项适用、AIIA / SoA 结论、不符合纠正闭环等长期治理事实。它们会被 process、work、artifact、conversation、runtime、member-service、workspace、observability 和 archive 共同引用,因此必须有独立、稳定、可追溯的仓级需求来源。

### 3.2 当前的主要痛点或机会点是什么？

主要痛点不是“缺少某个审批接口”或“缺少某个 Policy DSL”,而是治理事实容易散落在多个相邻概念中:

- process 拥有 waiting gate / pause context,governance 拥有 Gate / approval / decision truth;若需求层不分清,流程等待状态会被误当作治理裁决。
- work 拥有 Project / WorkItem / blocker / dependency / lifecycle truth,governance 拥有 Gate decision 和 Nonconformity corrective loop;若不分清,任务推进和治理纠正会形成多真相。
- artifact 拥有 Artifact / evidence / AIIA / SoA 正文和版本,governance 拥有治理生命周期、适用性、覆盖和批准结论;若不分清,治理仓会保存第二份正文。
- method-library 拥有方法、流程、角色、工作产品和 AIPolicyDef source truth,runtime / capability-hub 拥有缓存、能力注册和执行判定;governance 只拥有 Policy 生效、授权和优先级事实。
- observability 拥有审计事件物理存储和告警流水,governance 拥有可被审计的治理结论;若不分清,审计日志会被误当作业务决策真相。

### 3.3 这些问题能否量化？

当前不能可靠量化为运行时指标。旧文档中的 `RaiseGate P95 < 150ms`、`DecideGate P95 < 200ms`、`GetApplicablePolicies P95 < 50ms`、Policy 下发 `< 30s`、`200w Gate / 1000w Policy 记录`、覆盖率 `>= 95%` 等,更适合后续规模假设、非功能需求或测试要求,不应在 Step 3 伪装成问题量化。

本步采用“当前表现 + 影响范围 / 后果”的方式表达问题:

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 治理事实缺少统一需求收束 | 旧 governance 文档内容丰富,但正式需求层混有产品背景、标准语义、详细字段、状态机、RPC、事件名、性能和覆盖率指标 | 相邻仓会各自解释 Gate 结果、Policy 生效、控制适用、AIIA / SoA 结论和纠正状态 |
| 治理结论与相邻仓状态容易混淆 | waiting gate / Gate decision、WorkItem lifecycle / Gate decision、artifact正文 / governance批准结论、runtime cache / Policy truth 在旧文档和相邻仓文档中反复交织 | 后续架构、详细设计和实现会在 process、work、artifact、runtime、conversation、observability 之间反复选边 |
| 合规对象的正文、标准语义和治理结论容易混写 | ISO 42001 / ISO 9001 / ISO 24748-2 语义、AIIA / SoA 文档正文、Control 编号、Nonconformity 纠正事实和审计证据在旧描述中混层 | Governance 可能误存标准原文、artifact 正文或审计总账,导致数据归属和可落码性断裂 |

### 3.4 哪些是业务问题,哪些是技术问题？

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对“关键节点谁决定、依据什么策略、哪些控制适用、影响评估和适用性声明是否成立、不符合如何纠正”的统一需求语言,用户、AI member、审计方和相邻仓难以稳定理解治理结论。 |
| 技术问题 | waiting gate / Gate decision、WorkItem state / governance decision、Artifact body / AIIA / SoA conclusion、AIPolicyDef / Policy truth、runtime cache / Policy enforcement、audit log / governance fact 等边界若不在需求层先讲清,后续设计与实现会反复出现 1:1 落码冲突。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §2.1 | 背景强调 AI 员工必须在受控、可审计、可追责框架下工作 | 方向正确,可保留 | 正式 §3 背景继续使用该产品背景,但不写成标准或实现方案 |
| `00-需求文档.md` §2.2 | 用 `domain/governance/README.md` 行数、Gate 六段式、Policy DSL、47 条不变量表达痛点 | 部分是旧进度描述,部分滑入详细设计和实现验证 | 转译为“旧设计未按最新 SOP 收束为治理事实需求问题” |
| `00-需求文档.md` §2.3 | 写 `200w Gate / 1000w Policy`、P95 和 Policy 下发时延 | 更像规模 / 非功能输入,不是 Step 3 问题定义 | 后移 Step 13 判断是否作为非功能或容量假设 |
| `00-需求文档.md` §2.4 | 把业务问题 / 技术问题直接写成 Gate 六段式、Policy 优先级、AIIA / SoA 双身份、Nonconformity 闭环 | 线索有价值,但已混入候选功能、规则和数据归属 | 本步只抽象为治理事实未统一、相邻仓状态混淆、正文 / 结论混写三类问题 |
| `README.md` | 写 runtime C6 Policy Cache、capability-hub 白名单、observability 全量审计 | 是边界风险线索,但 Step 3 不能展开依赖或实现 | 纳入“Policy truth 与执行 / 审计边界混淆”问题 |
| `domain/governance/README.md` | 已有字段、状态机、RPC、事件名和 47 条不变量 | 层级过深,不能反向支配需求问题 | 仅作为旧问题线索,不引入字段、RPC 和事件名 |
| `methodology/standards-discussion/*` | 提供 ISO 42001、ISO 9001、ISO 24748-2 讨论 | 标准语义有价值,但不能直接变成仓内对象字段或验收数字 | 后续 Step 9 / Step 10 / Step 13 再裁剪 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 背景主线 | governance 是 ISO 42001 AIMS 核心技术载体 | 平台需要统一治理事实,支撑关键节点受控、决策留痕、策略授权和合规闭环 | 避免 Step 3 写成标准实现方案 |
| 问题表达 | 旧文档混有标准、对象字段、状态机、RPC、功能名、性能和覆盖率 | 收敛为 3 个核心问题:治理事实未统一、治理结论与相邻仓状态混淆、正文 / 标准语义 / 结论混写 | 避免 Step 3 写成目标、功能、测试或非功能 |
| 量化处理 | 使用 P95、Policy 下发时延、记录规模和覆盖率 | 不在 Step 3 采用运行时指标;记录为后续非功能 / 测试候选 | 当前没有真实测量来源,不能伪量化 |
| 业务 / 技术分类 | 旧文档直接列 Gate、Policy、AIIA / SoA、Nonconformity 技术问题 | 业务问题聚焦统一治理语言;技术问题聚焦需求边界和后续落码冲突 | 更符合最新规范 4.3 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧文档的“ISO 42001 技术载体未落地”问题主线 | 简短,贴近旧描述 | 容易把标准实现、对象字段和合规验收提前写成问题 | 不采用 |
| 方案 B: 收敛为“治理事实缺少统一需求收束” | 与 Step 2 定位一致,能解释为什么当前需要先校准 Governance | 需要后续 Step 4 再展开目标,不能在本步直接给解决路径 | 采用 |
| 方案 C: 把性能、规模和覆盖率作为主要问题 | 有数字,看起来可量化 | 旧数字不是当前真实测量,且性能不是本轮需求校准的主要矛盾 | 不采用 |
| 方案 D: 把 Gate 六段式作为唯一问题 | 抓住核心决策风险 | 过窄,无法覆盖 Policy、Control、AIIA、SoA、Nonconformity 和跨仓正文边界 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否继续保留旧文档中的规模和性能量化？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 3 写 P95、Policy 下发时延、`200w Gate / 1000w Policy`、覆盖率 | 看起来量化,但可能误导为当前已确认容量和测试目标 |
| 方案 B | Step 3 不使用该数字,后续 Step 13 / Step 14 再判断是否作为非功能和验收候选 | 问题定义更干净,避免伪量化 |

推荐方案 B。原因是这些数字没有来自当前已完成上游的正式测量或验收基线,更适合非功能和测试阶段评估。

#### 是否把 ISO 42001 / ISO 9001 / ISO 24748-2 写成问题本身？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成“缺少 ISO 42001 / 9001 / 24748-2 实现” | 会把标准方案前置,并可能让标准原文覆盖仓级需求边界 |
| 方案 B | 写成“缺少统一治理事实收束”,标准作为背景和后续规则候选 | 保留旧线索,不把方案前置 |

推荐方案 B。原因是 Step 3 只说明为什么值得做,不确认标准条款如何映射对象、字段或验收。

#### 是否把 Gate 作为唯一核心问题？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 只写 Gate 决策问题 | 背景更短,但会漏掉 Policy、Control、AIIA、SoA、Nonconformity 的治理闭环 |
| 方案 B | Gate 作为治理事实未统一的核心表现之一,与 Policy 和合规闭环共同纳入问题 | 覆盖治理事实全貌,同时不进入功能设计 |

推荐方案 B。原因是 Step 2 已把 governance 定位为治理决策与治理控制真相仓,Step 3 必须解释这两类真相为什么都需要收束。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

`L1-governance` 当前值得讨论,是因为产品要求 AI member 的关键节点受控、决策留痕、自治级别可追溯、合规证据链可审计。基础契约、事件协作、SDK、身份、对话、工作、过程和方法定义已经收稳后,平台需要继续收束治理事实,避免相邻仓各自解释 Gate、Policy、Control、AIIA、SoA 和 Nonconformity。

### 7.2 现状与问题结论

| 问题编号 | 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|---|
| P-GOV-001 | 治理事实缺少统一需求收束 | 旧 governance 文档内容丰富但层级混杂,正式需求未按最新 SOP 重建 | 相邻仓会各自解释 Gate 结果、Policy 生效、控制适用、AIIA / SoA 结论和纠正状态 |
| P-GOV-002 | 治理结论与相邻仓状态容易混淆 | waiting gate / Gate decision、WorkItem lifecycle / Gate decision、artifact正文 / governance批准结论、runtime cache / Policy truth 反复需要澄清 | process、work、artifact、runtime、conversation、observability 之间容易形成多真相 |
| P-GOV-003 | 合规对象的正文、标准语义和治理结论容易混写 | ISO 42001 / ISO 9001 / ISO 24748-2 语义、AIIA / SoA 文档正文、Control 编号、Nonconformity 纠正事实和审计证据混层 | Governance 可能误存标准原文、artifact 正文或审计总账,导致数据归属和可落码性断裂 |

### 7.3 问题分类结论

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对“关键节点谁决定、依据什么策略、哪些控制适用、影响评估和适用性声明是否成立、不符合如何纠正”的统一需求语言,用户、AI member、审计方和相邻仓难以稳定理解治理结论。 |
| 技术问题 | Governance 与流程、工作、产物、对话、身份、方法定义、runtime、capability-hub、observability 和 UI 的边界会直接影响对象、状态、测试和实现签名;若问题不先收束,后续实现 agent 容易遇到 1:1 落码冲突。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §3。

```md
## 3. 背景与问题定义

> 校准来源:
> - `design-calibration/00_req_step_03_problem_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“当前文档问题诊断”和“设计取舍”小节,了解本章如何从旧文档中的背景、痛点和边界风险收敛为当前问题主线。

### 3.1 业务背景

Quantalithos 的产品叙事要求 AI member 可以参与长期软件项目,但关键节点必须能被人类或治理策略控制,决策必须留痕,自治级别必须可追溯,合规证据链必须能被审计。随着基础契约、事件协作、SDK、身份、对话、工作、过程和方法定义已经收稳,平台需要把 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 收束为统一的治理事实需求。

### 3.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 治理事实缺少统一需求收束 | 旧 governance 文档内容丰富但层级混杂,正式需求未按最新 SOP 重建 | 相邻仓会各自解释 Gate 结果、Policy 生效、控制适用、AIIA / SoA 结论和纠正状态 |
| 治理结论与相邻仓状态容易混淆 | waiting gate / Gate decision、WorkItem lifecycle / Gate decision、artifact正文 / governance批准结论、runtime cache / Policy truth 反复需要澄清 | process、work、artifact、runtime、conversation、observability 之间容易形成多真相 |
| 合规对象的正文、标准语义和治理结论容易混写 | ISO 42001 / ISO 9001 / ISO 24748-2 语义、AIIA / SoA 文档正文、Control 编号、Nonconformity 纠正事实和审计证据混层 | Governance 可能误存标准原文、artifact 正文或审计总账,导致数据归属和可落码性断裂 |

### 3.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对“关键节点谁决定、依据什么策略、哪些控制适用、影响评估和适用性声明是否成立、不符合如何纠正”的统一需求语言,用户、AI member、审计方和相邻仓难以稳定理解治理结论。 |
| 技术问题 | Governance 与流程、工作、产物、对话、身份、方法定义、runtime、capability-hub、observability 和 UI 的边界会直接影响对象、状态、测试和实现签名;若问题不先收束,后续实现 agent 容易遇到 1:1 落码冲突。 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在 Step 3 保留旧规模和性能量化 | 保留 P95、Policy 下发时延、记录规模和覆盖率 | 后移到 Step 13 / Step 14 非功能和验收评估 | 推荐 B。原因是 Step 3 不应伪量化,也不应提前写非功能或测试指标 |
| Q-002 | 是否把问题主线写成“ISO 42001 实现未落地” | 使用旧问题主线 | 改为“治理事实缺少统一需求收束” | 推荐 B。原因是“ISO 42001 实现”过早绑定标准映射和实现形态 |
| Q-003 | 是否把 Gate 写成唯一问题 | 只写 Gate | 写成治理事实未统一的核心表现之一,同时覆盖 Policy、Control、AIIA、SoA 和 Nonconformity | 推荐 B。原因是 Governance 的边界已经覆盖治理决策与治理控制两类真相 |

当前建议:接受上述推荐后进入 Step 4。

---

## 10. 进入下一步条件

- 已说明当前业务背景:平台需要统一治理事实,支撑关键节点受控、决策留痕、策略授权和合规闭环。
- 已列出 3 个主要问题:治理事实缺少统一需求收束、治理结论与相邻仓状态混淆、合规对象正文 / 标准语义 / 治理结论混写。
- 已说明旧量化指标不在 Step 3 使用,后移非功能和验收阶段。
- 已区分业务问题与技术问题。
- 未把目标、功能、规则、接口、数据归属或实现方案写进问题定义。
