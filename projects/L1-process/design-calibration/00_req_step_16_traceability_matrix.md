# Step 16. 需求追溯矩阵

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 16
> 回填章节: `00-需求文档.md` §16 需求追溯矩阵
> 生成日期: 2026-06-05

---

## 1. 本步目标

把 Step 7~Step 15 已确认的核心闭环、用户故事、功能需求、业务规则、数据归属、验收标准和风险约束显式连接起来,用于发现漏项、孤儿项和串线项。本步只做映射和检查,不新增功能、故事、规则、数据或验收项。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心闭环 |
| `design-calibration/00_req_step_08_user_stories.md` | Step 8 已完成 | 固定 US-PROC-001~US-PROC-012 和外围增强故事 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 作为主矩阵主轴 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 映射 BR-PROC-001~BR-PROC-032 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 映射真相、快照、引用和禁止正文 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | Step 14 已完成 | 映射 AC-PROC-001~AC-PROC-029 和 VF-PROC-001~VF-PROC-008 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | Step 15 已完成 | 映射外围增强和待确认项的挂起口径 |

---

## 3. SOP 问题回答

### 3.1 每个核心能力闭环节点对应哪些用户故事?

| 核心能力闭环 | 对应用户故事 |
|---|---|
| C-1 运行时过程形态成立 | US-PROC-001;US-PROC-002 |
| C-2 项目过程实例成立 | US-PROC-003;US-PROC-004 |
| C-3 过程节点和流控位置成立 | US-PROC-005;US-PROC-006;US-PROC-007 |
| C-4 暂停等待恢复连续成立 | US-PROC-008;US-PROC-009;US-PROC-010 |
| C-5 可消费可追溯成立 | US-PROC-004;US-PROC-010;US-PROC-011;US-PROC-012 |
| 外围增强 | US-PROC-E01;US-PROC-E02;US-PROC-E03;US-PROC-E04;US-PROC-E05 |

### 3.2 每个用户故事对应哪些功能需求?

| 用户故事 | 对应功能需求 |
|---|---|
| US-PROC-001 | FR-PROC-001 |
| US-PROC-002 | FR-PROC-001 |
| US-PROC-003 | FR-PROC-002 |
| US-PROC-004 | FR-PROC-002;FR-PROC-007 |
| US-PROC-005 | FR-PROC-003 |
| US-PROC-006 | FR-PROC-003;FR-PROC-004 |
| US-PROC-007 | FR-PROC-004 |
| US-PROC-008 | FR-PROC-005 |
| US-PROC-009 | FR-PROC-005;FR-PROC-006 |
| US-PROC-010 | FR-PROC-006;FR-PROC-008 |
| US-PROC-011 | FR-PROC-007 |
| US-PROC-012 | FR-PROC-007;FR-PROC-008 |
| US-PROC-E01 | FR-PROC-E01 |
| US-PROC-E02 | FR-PROC-E02 |
| US-PROC-E03 | FR-PROC-E03 |
| US-PROC-E04 | FR-PROC-E04 |
| US-PROC-E05 | FR-PROC-E05 |

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
| 方案 A: 只映射核心 FR-PROC-001~008 | 表更短 | 外围增强会在追溯中消失,容易被误判为未处理 | 不采用 |
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
| FR-PROC-001 运行时过程形态形成 | C-1 运行时过程形态成立 | US-PROC-001;US-PROC-002 | BR-PROC-001;BR-PROC-002;BR-PROC-015;BR-PROC-016;BR-PROC-021;BR-PROC-029 | ProcessTemplate runtime index / 运行时过程形态、ProcessProfile / 项目过程裁剪语境为 Process 真相;方法定义目录级快照和方法定义相关 Ref 只作快照 / 引用;method-library 定义正文禁止保存 | AC-PROC-001;AC-PROC-006;AC-PROC-014;AC-PROC-016;AC-PROC-017;AC-PROC-018;AC-PROC-020~AC-PROC-023;VF-PROC-002 |
| FR-PROC-002 项目过程实例成立 | C-2 项目过程实例成立 | US-PROC-003;US-PROC-004 | BR-PROC-003;BR-PROC-010;BR-PROC-017;BR-PROC-022;BR-PROC-031 | ProcessInstance 为 Process 真相;ProjectRef / work 相关 Ref 和项目 / 工作语境摘要只作引用 / 快照;Project / WorkItem / Iteration truth 不归 Process | AC-PROC-002;AC-PROC-007;AC-PROC-014;AC-PROC-016;AC-PROC-017;AC-PROC-019~AC-PROC-023;VF-PROC-003 |
| FR-PROC-003 过程节点与流控位置表达 | C-3 过程节点和流控位置成立 | US-PROC-005;US-PROC-006 | BR-PROC-004;BR-PROC-009;BR-PROC-018;BR-PROC-022;BR-PROC-031 | Activity 过程节点执行事实、Token / Gateway 流控位置事实和 process timing / stage / rhythm fact 为 Process 真相;work 相关 Ref 只作引用;WorkItem / Backlog / Iteration 正文禁止保存 | AC-PROC-003;AC-PROC-008;AC-PROC-014~AC-PROC-017;AC-PROC-019~AC-PROC-023;VF-PROC-003 |
| FR-PROC-004 Activity 执行语境与反馈绑定 | C-3 过程节点和流控位置成立 | US-PROC-006;US-PROC-007 | BR-PROC-004;BR-PROC-013;BR-PROC-018;BR-PROC-025;BR-PROC-031 | Activity 过程节点执行事实为 Process 真相;runtime feedback 摘要和 runtime / member-service Ref 只作快照 / 引用;runtime 执行日志、工具调用正文和微步 checkpoint 禁止保存 | AC-PROC-003;AC-PROC-009;AC-PROC-014~AC-PROC-017;AC-PROC-019~AC-PROC-023;VF-PROC-003;VF-PROC-005 |
| FR-PROC-005 暂停等待与恢复语境表达 | C-4 暂停等待恢复连续成立 | US-PROC-008;US-PROC-009 | BR-PROC-005;BR-PROC-011;BR-PROC-019;BR-PROC-023;BR-PROC-030;BR-PROC-031 | waiting gate / pause context 为 Process 真相;governance decision / policy 摘要和 governance 相关 Ref 只作快照 / 引用;Gate / Policy / decision truth 不归 Process | AC-PROC-004;AC-PROC-010;AC-PROC-014~AC-PROC-019;AC-PROC-020~AC-PROC-023;VF-PROC-004 |
| FR-PROC-006 过程事实恢复连续性维护 | C-4 暂停等待恢复连续成立;C-5 可消费可追溯成立 | US-PROC-009;US-PROC-010 | BR-PROC-006;BR-PROC-020;BR-PROC-025;BR-PROC-028;BR-PROC-031;BR-PROC-032 | Checkpoint / recovery fact、process audit / traceability record 为 Process 真相;observability / archive Ref 只作引用;runtime 微步 checkpoint、reasoning trace 和归档包正文禁止保存 | AC-PROC-004;AC-PROC-011;AC-PROC-014;AC-PROC-016;AC-PROC-017;AC-PROC-019~AC-PROC-023;AC-PROC-027~AC-PROC-029;VF-PROC-005~VF-PROC-007 |
| FR-PROC-007 过程执行事实消费与追溯 | C-5 可消费可追溯成立 | US-PROC-004;US-PROC-011;US-PROC-012 | BR-PROC-007;BR-PROC-014;BR-PROC-021~BR-PROC-028;BR-PROC-031 | process read model / timeline / progress summary 为 Process 真相派生快照;process audit / traceability record 为 Process 真相;相邻仓对象只作引用或快照;相邻仓正文禁止保存 | AC-PROC-005;AC-PROC-012;AC-PROC-014;AC-PROC-015;AC-PROC-017;AC-PROC-019~AC-PROC-023;AC-PROC-026~AC-PROC-029;VF-PROC-002~VF-PROC-006 |
| FR-PROC-008 过程执行事实维护与对账 | C-5 可消费可追溯成立 | US-PROC-010;US-PROC-012 | BR-PROC-007;BR-PROC-014;BR-PROC-020;BR-PROC-032 | process read model / timeline / progress summary 只作派生快照;维护对账结果不得成为业务真相写源;process audit / traceability record 为 Process 真相 | AC-PROC-005;AC-PROC-013;AC-PROC-015;AC-PROC-016;AC-PROC-019;AC-PROC-021;AC-PROC-025;AC-PROC-028;AC-PROC-029;VF-PROC-006;VF-PROC-007 |
| FR-PROC-E01 高级过程投影视图 | 外围增强 | US-PROC-E01 | BR-PROC-007;BR-PROC-014;BR-PROC-028 | 高级 timeline / dashboard 只消费 Process 真相派生快照,不拥有 workspace 聚合视图状态 | AC-PROC-021;AC-PROC-025;AC-PROC-029;Step 15 按外围增强挂起 |
| FR-PROC-E02 完整 BPMN / 嵌套过程表达 | 外围增强 | US-PROC-E02 | BR-PROC-004;BR-PROC-031 | 复杂网关和嵌套过程只能扩展过程节点 / 流控表达,不改变基础 Process 真相边界 | AC-PROC-003;AC-PROC-008;Step 15 按外围增强挂起 |
| FR-PROC-E03 模板刚度与高级裁剪策略 | 外围增强 | US-PROC-E03 | BR-PROC-001;BR-PROC-002;BR-PROC-016;BR-PROC-029 | 高级裁剪只作用于 ProcessProfile / 运行时过程形态语境,不接管 method-library 定义正文 | AC-PROC-006;AC-PROC-018;Step 15 按外围增强挂起 |
| FR-PROC-E04 自动调度 / 重试 / 补偿建议 | 外围增强 | US-PROC-E04 | BR-PROC-006;BR-PROC-014;BR-PROC-020;BR-PROC-032 | 自动建议只能基于 Process 真相、快照和引用形成,不得隐式推进或恢复过程事实 | AC-PROC-011;AC-PROC-013;AC-PROC-025;AC-PROC-028;Step 15 按外围增强挂起 |
| FR-PROC-E05 容量、延迟和恢复趋势分析 | 外围增强 | US-PROC-E05 | BR-PROC-007;BR-PROC-014;BR-PROC-028;BR-PROC-032 | 趋势分析只能消费派生快照、维护证据和观测引用,不拥有 metrics / observability 正文 | AC-PROC-024;AC-PROC-029;Step 15 按外围增强挂起 |

### 7.2 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。FR-PROC-001~FR-PROC-008 与 FR-PROC-E01~FR-PROC-E05 均有对应故事。 |
| 是否存在没有闭环映射的功能需求 | 否。核心功能均映射到 C-1~C-5;外围增强功能明确映射为外围增强。 |
| 是否存在没有规则保护的核心功能 | 否。FR-PROC-001~FR-PROC-008 均有 BR-PROC 规则保护。 |
| 是否存在没有数据归属支撑的功能需求 | 否。核心功能均可映射到真相、快照、引用或禁止正文边界。 |
| 是否存在没有验收标准的功能需求 | 否。核心功能均有 AC-PROC 验收;外围增强不设当前硬验收,按 Step 15 挂起。 |
| 是否存在没有承接的业务规则 | 否。BR-PROC-001~BR-PROC-032 均在核心功能、边界规则、数据归属或非功能验收中承接。 |
| 是否存在没有承接的数据归属要求 | 否。真相、快照、引用和禁止正文均在功能、规则与验收中承接。 |
| 是否存在没有来源的验收标准 | 否。AC-PROC-001~AC-PROC-029 均来自 Step 7 / 9 / 10 / 11 / 13。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。本矩阵没有新增前文未确认的新项。 |
| 是否存在边界外故事、规则、数据或验收项未被排除 | 否。边界外能力已在 Step 8 / Step 9 排除,并在 Step 10 / Step 11 / Step 14 中约束。 |

### 7.3 追溯结论

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | C-1~C-5 均有故事、功能、规则、数据和验收承接。 |
| 功能完整性 | 核心功能 FR-PROC-001~FR-PROC-008 均闭合;外围增强 FR-PROC-E01~E05 已保留但不阻塞当前验收。 |
| 边界完整性 | method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 边界均有规则、数据和验收约束。 |
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
|---|---|---|
| Q-001 | 是否需要在正式文档中完整摘录主矩阵 | 当前建议完整摘录。原因是主矩阵是需求追溯的正式审查入口。 |
| Q-002 | 外围增强是否在正式矩阵中保留 | 当前建议保留并标注外围增强。原因是它们已进入 Step 8 / Step 9,不应在追溯中消失。 |

---

## 10. 进入下一步条件

- 已形成以功能需求为主轴的主追溯矩阵。
- 已形成漏项检查表。
- 矩阵没有新增前文未确认的新项。
- 核心功能均有故事来源、闭环映射、规则保护、数据归属和验收标准。
- 外围增强已明确按外围增强和 Step 15 挂起口径处理。
