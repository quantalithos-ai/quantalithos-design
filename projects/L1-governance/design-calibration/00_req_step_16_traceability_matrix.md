# Step 16. 需求追溯矩阵

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 16
> 回填章节: `00-需求文档.md` §16 需求追溯矩阵
> 生成日期: 2026-06-06

---

## 1. 本步目标

把 Step 7~Step 15 已确认的核心闭环、用户故事、功能需求、业务规则、数据归属、验收标准和风险约束显式连接起来,用于发现漏项、孤儿项和串线项。本步只做映射和检查,不新增功能、故事、规则、数据或验收项。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-GOV-1~C-GOV-5 核心闭环 |
| `design-calibration/00_req_step_08_user_stories.md` | Step 8 已完成 | 固定 US-GOV-001~US-GOV-014 和外围增强故事 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 作为主矩阵主轴 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 映射 BR-GOV-001~BR-GOV-040 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 映射真相、快照、引用和禁止正文 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | Step 14 已完成 | 映射 AC-GOV-001~AC-GOV-031 和 VF-GOV-001~VF-GOV-010 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | Step 15 已完成 | 映射外围增强和待确认项的挂起口径 |

---

## 3. SOP 问题回答

### 3.1 每个核心能力闭环节点对应哪些用户故事?

| 核心能力闭环 | 对应用户故事 |
|---|---|
| C-GOV-1 治理语境与适用对象能够被确定 | US-GOV-001;US-GOV-002;US-GOV-003 |
| C-GOV-2 关键节点治理裁决能够形成正式结论 | US-GOV-004;US-GOV-005;US-GOV-006 |
| C-GOV-3 治理策略与控制适用约束能够成立 | US-GOV-006;US-GOV-007;US-GOV-008;US-GOV-009;US-GOV-011 |
| C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | US-GOV-010;US-GOV-011;US-GOV-012 |
| C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | US-GOV-002;US-GOV-005;US-GOV-008;US-GOV-013;US-GOV-014 |
| 外围增强 | US-GOV-E01;US-GOV-E02;US-GOV-E03;US-GOV-E04;US-GOV-E05;US-GOV-E06 |

### 3.2 每个用户故事对应哪些功能需求?

| 用户故事 | 对应功能需求 |
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

### 3.3 每个功能需求对应哪些业务规则、数据归属和验收标准?

完整答案见 §7.1 主追溯矩阵。核心功能需求均有故事来源、闭环映射、业务规则、数据归属和验收标准。外围增强需求作为后续能力线索保留,并通过 Step 15 的范围约束和 Step 14 的非阻塞验收口径防止误入当前核心闭环。

### 3.4 是否存在没有来源的功能、没有承接的规则、没有验收的能力?

当前结论为否。

需要注意的是,外围增强能力不是孤儿需求,而是已显式标记为外围增强;它们当前不作为核心闭环成立条件,也不作为当前需求通过的一票否决前置。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` | 没有按最新结构给出闭环、故事、功能、规则、数据、验收之间的主矩阵 | 后续读者难以判断功能是否有来源和验收 | 新增固定结构主追溯矩阵 |
| 旧 `00-需求文档.md` | 功能、规则和验收跨章节关系靠自然语言理解 | 容易漏掉边界规则或验收项 | 通过主矩阵显式映射 |
| 前序 Step | 每步都有局部映射表 | 分散,不利于最终审查 | Step 16 汇总为统一矩阵和漏项检查表 |
| 外围增强项 | 已在 Step 8 / Step 9 保留 | 若不明确映射,容易被误读为当前核心缺口 | 在矩阵中标注为外围增强并引用 Step 15 挂起口径 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 追溯结构 | 分散在 Step 7~Step 15 | 以功能需求为主轴统一呈现 | 对齐规范 4.16 |
| 主轴选择 | 可能按故事、规则或闭环散列 | 固定按功能需求 | 便于检查每个功能是否有来源、规则、数据和验收 |
| 外围增强 | 只在故事和功能中出现 | 单独标注为外围增强,不作为核心验收硬前置 | 防止误判为孤儿需求 |
| 漏项检查 | 无统一结论 | 明确给出漏项检查表 | 便于进入 Step 17 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只映射核心 FR-GOV-001~010 | 表更短 | 外围增强会在追溯中消失,容易被误判为未处理 | 不采用 |
| 方案 B: 核心和外围增强都进入矩阵,但标明外围增强口径 | 覆盖完整,不会误升级外围增强 | 矩阵稍长 | 采用 |
| 方案 C: 以用户故事为主轴 | 贴近叙事 | 不符合规范 4.16 主轴要求 | 不采用 |
| 方案 D: 用自然语言说明“整体已对齐” | 简短 | 无法结构化检查漏项 | 不采用 |

### 6.1 待确认问题的方案选择

#### 外围增强功能是否进入主矩阵?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不进入 | 会丢失 Step 8 / Step 9 已保留的增强线索 |
| 方案 B | 进入并标注为外围增强 | 既保留线索,又不误升级为核心 |

推荐方案 B。原因是追溯矩阵必须覆盖前文已经定义的功能需求。

#### 是否为外围增强新增验收项?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 16 新增外围增强验收 | 违反“不新增前文未确认项” |
| 方案 B | 只映射到已有非功能 / 风险挂起口径 | 保持 Step 16 只做追溯 |

推荐方案 B。原因是 Step 16 不负责补写验收标准。

---

## 7. 结构化中间产物

### 7.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| FR-GOV-001 治理语境与适用对象确定 | C-GOV-1 | US-GOV-001;US-GOV-002 | BR-GOV-001;BR-GOV-021;BR-GOV-028~BR-GOV-035;BR-GOV-039 | governance context 为 Governance 真相;process / work / artifact / conversation / identity / method / runtime / observability 只可作为摘要或引用;相邻仓正文禁止保存 | AC-GOV-001;AC-GOV-006;AC-GOV-016;AC-GOV-018;AC-GOV-019;AC-GOV-021~AC-GOV-025;VF-GOV-001~VF-GOV-003 |
| FR-GOV-002 治理输入收束与可裁决语境形成 | C-GOV-1 | US-GOV-002;US-GOV-003 | BR-GOV-001;BR-GOV-012~BR-GOV-017;BR-GOV-021;BR-GOV-036 | Gate / 决策请求语境为 Governance 真相;系统触发、周期复核、风险信号和相邻仓输入只可作为快照 / 引用;自动化和观测输入不得创造治理结论 | AC-GOV-001;AC-GOV-007;AC-GOV-016~AC-GOV-020;AC-GOV-022~AC-GOV-025;VF-GOV-001~VF-GOV-004 |
| FR-GOV-003 关键节点正式治理裁决 | C-GOV-2 | US-GOV-004;US-GOV-005 | BR-GOV-002;BR-GOV-003;BR-GOV-004;BR-GOV-019;BR-GOV-022;BR-GOV-023;BR-GOV-036;BR-GOV-039 | Gate / Decision / Approval / responsibility 为 Governance 真相;process waiting、work lifecycle、conversation UI 和 runtime cache 只可作为语境或消费方 | AC-GOV-002;AC-GOV-008;AC-GOV-016~AC-GOV-021;AC-GOV-022~AC-GOV-025;VF-GOV-001;VF-GOV-002;VF-GOV-006 |
| FR-GOV-004 自动化治理边界表达 | C-GOV-2;C-GOV-3 | US-GOV-006;US-GOV-009 | BR-GOV-005;BR-GOV-006;BR-GOV-018;BR-GOV-019;BR-GOV-036;BR-GOV-037 | Policy effective fact、shared rules 和自动化治理授权边界为 Governance 真相;runtime / capability feedback 只作摘要或引用;tool execution 正文禁止保存 | AC-GOV-002;AC-GOV-003;AC-GOV-009;AC-GOV-016;AC-GOV-017;AC-GOV-020;AC-GOV-026~AC-GOV-031;VF-GOV-004;VF-GOV-005 |
| FR-GOV-005 Policy 生效与授权约束 | C-GOV-3 | US-GOV-007;US-GOV-008;US-GOV-009 | BR-GOV-005;BR-GOV-006;BR-GOV-016;BR-GOV-017;BR-GOV-018;BR-GOV-024;BR-GOV-037;BR-GOV-039 | Policy effective fact、shared rules、范围、优先级、冲突和替代关系为 Governance 真相;AIPolicyDef、runtime cache、capability whitelist 只可作为定义引用、反馈摘要或消费方 | AC-GOV-003;AC-GOV-010;AC-GOV-016~AC-GOV-021;AC-GOV-022~AC-GOV-025;AC-GOV-028~AC-GOV-031;VF-GOV-004;VF-GOV-005 |
| FR-GOV-006 Control 适用与复核责任 | C-GOV-3;C-GOV-4 | US-GOV-007;US-GOV-011 | BR-GOV-007;BR-GOV-009;BR-GOV-025;BR-GOV-033;BR-GOV-037;BR-GOV-039 | Control applicability / implementation / review fact 为 Governance 真相;Control definition 和标准正文只作 method-library 引用或摘要;标准原文禁止保存 | AC-GOV-003;AC-GOV-004;AC-GOV-011;AC-GOV-016;AC-GOV-018~AC-GOV-021;AC-GOV-022~AC-GOV-025;VF-GOV-003 |
| FR-GOV-007 AIIA / SoA 治理评审结论 | C-GOV-4 | US-GOV-010;US-GOV-013 | BR-GOV-008;BR-GOV-009;BR-GOV-014;BR-GOV-026;BR-GOV-030;BR-GOV-039 | AIIA / SoA governance conclusion 为 Governance 真相;artifact / evidence 正文、baseline 和 archive package 只作引用或摘要;第二份正文禁止保存 | AC-GOV-004;AC-GOV-012;AC-GOV-016;AC-GOV-018;AC-GOV-019;AC-GOV-021~AC-GOV-025;AC-GOV-029;VF-GOV-003;VF-GOV-007 |
| FR-GOV-008 Nonconformity 纠正闭环 | C-GOV-4 | US-GOV-012;US-GOV-013 | BR-GOV-010;BR-GOV-027;BR-GOV-038;BR-GOV-039 | Nonconformity corrective loop 为 Governance 真相;work blocker、bug、observability alert 和 evidence body 只可作为来源引用或摘要;普通任务 / 告警不得替代治理闭环 | AC-GOV-004;AC-GOV-013;AC-GOV-016;AC-GOV-018;AC-GOV-020~AC-GOV-025;AC-GOV-029;VF-GOV-008 |
| FR-GOV-009 治理事实消费与追溯 | C-GOV-5 | US-GOV-002;US-GOV-005;US-GOV-008;US-GOV-013 | BR-GOV-011;BR-GOV-012~BR-GOV-017;BR-GOV-028~BR-GOV-035;BR-GOV-039;BR-GOV-040 | governance audit / traceability record 为 Governance 真相;read model / report / dashboard summary 为派生快照;相邻仓只消费 Governance truth,不得反向定义 | AC-GOV-005;AC-GOV-014;AC-GOV-016;AC-GOV-017;AC-GOV-019;AC-GOV-021~AC-GOV-031;VF-GOV-002~VF-GOV-010 |
| FR-GOV-010 治理事实维护、对账、报告和归档准备 | C-GOV-5 | US-GOV-014 | BR-GOV-011;BR-GOV-020;BR-GOV-030;BR-GOV-035;BR-GOV-040 | governance read model / report / dashboard summary 为派生快照;归档准备只输出治理事实、合规材料和引用来源;维护动作不得成为业务 truth 写源 | AC-GOV-005;AC-GOV-015;AC-GOV-017;AC-GOV-019;AC-GOV-021;AC-GOV-023~AC-GOV-031;VF-GOV-003;VF-GOV-009;VF-GOV-010 |
| FR-GOV-E01 高级治理看板与报表 | 外围增强 | US-GOV-E01 | BR-GOV-011;BR-GOV-020;BR-GOV-040 | 高级看板和报表只消费 Governance truth 派生快照,不拥有 workspace / console UI truth | AC-GOV-023;AC-GOV-025;AC-GOV-031;Step 15 按外围增强挂起 |
| FR-GOV-E02 Policy DSL 与模拟评估 | 外围增强 | US-GOV-E02 | BR-GOV-005;BR-GOV-006;BR-GOV-018;BR-GOV-037 | DSL 和模拟评估只能服务 Policy 维护,不得替代 Policy effective fact 或 shared rules truth | AC-GOV-010;AC-GOV-028;AC-GOV-030;Step 15 按外围增强挂起 |
| FR-GOV-E03 复杂 Gate 编排与升级路径 | 外围增强 | US-GOV-E03 | BR-GOV-002;BR-GOV-004;BR-GOV-022;BR-GOV-023;BR-GOV-036 | 复杂编排只能扩展正式裁决和责任语境,不得替代基础 Gate / Decision truth | AC-GOV-002;AC-GOV-008;AC-GOV-021;Step 15 按外围增强挂起 |
| FR-GOV-E04 AIIA / SoA 自动草拟和周期重评建议 | 外围增强 | US-GOV-E04 | BR-GOV-008;BR-GOV-009;BR-GOV-026;BR-GOV-039 | 自动草拟和重评建议只可作为评审输入,不得替代 AIIA / SoA 正式治理结论或 artifact 正文 | AC-GOV-012;AC-GOV-029;Step 15 按外围增强挂起 |
| FR-GOV-E05 外部 GRC / 审计工具集成 | 外围增强 | US-GOV-E05 | BR-GOV-014;BR-GOV-020;BR-GOV-035;BR-GOV-040 | 外部 GRC / 审计工具只能消费或导出 Governance facts,不得成为 Governance truth 来源 | AC-GOV-023;AC-GOV-025;AC-GOV-029;Step 15 按外围增强挂起 |
| FR-GOV-E06 容量、延迟、策略传播和报告健康度分析 | 外围增强 | US-GOV-E06 | BR-GOV-011;BR-GOV-020;BR-GOV-040 | 健康度分析只消费派生快照、观测摘要和治理事实引用,不拥有 observability 正文或业务治理结论 | AC-GOV-026;AC-GOV-031;Step 15 按外围增强挂起 |

### 7.2 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。FR-GOV-001~FR-GOV-010 与 FR-GOV-E01~FR-GOV-E06 均有对应故事。 |
| 是否存在没有闭环映射的功能需求 | 否。核心功能均映射到 C-GOV-1~C-GOV-5;外围增强功能明确映射为外围增强。 |
| 是否存在没有规则保护的核心功能 | 否。FR-GOV-001~FR-GOV-010 均有 BR-GOV 规则保护。 |
| 是否存在没有数据归属支撑的功能需求 | 否。核心功能均可映射到真相、快照、引用或禁止正文边界。 |
| 是否存在没有验收标准的功能需求 | 否。核心功能均有 AC-GOV 验收;外围增强不设当前硬验收,按 Step 15 挂起。 |
| 是否存在没有承接的业务规则 | 否。BR-GOV-001~BR-GOV-040 均在核心功能、边界规则、数据归属或非功能验收中承接。 |
| 是否存在没有承接的数据归属要求 | 否。真相、快照、引用和禁止正文均在功能、规则与验收中承接。 |
| 是否存在没有来源的验收标准 | 否。AC-GOV-001~AC-GOV-031 均来自 Step 7 / 9 / 10 / 11 / 13。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。本矩阵没有新增前文未确认的新项。 |
| 是否存在边界外故事、规则、数据或验收项未被排除 | 否。边界外能力已在 Step 8 / Step 9 排除,并在 Step 10 / Step 11 / Step 14 中约束。 |

### 7.3 追溯结论

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | C-GOV-1~C-GOV-5 均有故事、功能、规则、数据和验收承接。 |
| 功能完整性 | 核心功能 FR-GOV-001~FR-GOV-010 均闭合;外围增强 FR-GOV-E01~E06 已保留但不阻塞当前验收。 |
| 边界完整性 | process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console、archive 和 external GRC 边界均有规则、数据和验收约束。 |
| 验收完整性 | 核心能力、功能能力、规则边界、数据归属和非功能均有 AC / VF 承接。 |
| 可进入 Step 17 | 可以进入正式 `00-需求文档.md` 重建。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §16。正式文档可摘录本文件 §7.1~§7.3 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/00_req_step_16_traceability_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“漏项检查表”小节,了解本章如何检查闭环、故事、功能、规则、数据和验收之间的追溯关系。

本文采用 `design-calibration/00_req_step_16_traceability_matrix.md` §7 的追溯矩阵结论。主矩阵以功能需求为中心,连接核心闭环、用户故事、业务规则、数据归属要求和验收标准。当前没有孤儿功能、孤儿规则、孤儿数据归属要求或孤儿验收标准;外围增强能力已经按外围增强和 Step 15 挂起口径处理,不阻塞当前核心需求闭环。

正式章节应摘录:

- `design-calibration/00_req_step_16_traceability_matrix.md` §7.1 主追溯矩阵。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.2 漏项检查表。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.3 追溯结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| Q-001 | 是否需要在正式文档中完整摘录主矩阵 | 当前建议完整摘录。原因是主矩阵是需求追溯的正式审查入口。 |
| Q-002 | 外围增强是否在正式矩阵中保留 | 当前建议保留并标注外围增强。原因是它们已进入 Step 8 / Step 9,不应在追溯中消失。 |

---

## 10. 进入下一步条件

- 已形成以功能需求为主轴的主追溯矩阵。
- 已形成漏项检查表。
- 矩阵没有新增前文未确认的新项。
- 核心功能均有故事来源、闭环映射、规则保护、数据归属和验收标准。
- 外围增强已明确按外围增强和 Step 15 挂起口径处理。
