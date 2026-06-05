# Step 16. 需求追溯矩阵

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 16
> 回填章节: `00-需求文档.md` §16 需求追溯矩阵
> 生成日期: 2026-06-02

---

## 1. 本步目标

把 Step 7~Step 15 已确认的核心闭环、用户故事、功能需求、业务规则、数据归属、验收标准和风险约束显式连接起来，用于发现漏项、孤儿项和串线项。本步只做映射和检查，不新增功能、故事、规则、数据或验收项。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心闭环 |
| `design-calibration/00_req_step_08_user_stories.md` | Step 8 已完成 | 固定 US-WORK-001~US-WORK-010 和外围增强故事 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 作为主矩阵主轴 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 映射 BR-WORK-001~BR-WORK-027 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 映射真相、快照、引用和禁止正文 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | Step 14 已完成 | 映射 AC-WORK-001~AC-WORK-029 和 VF-WORK-001~VF-WORK-008 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | Step 15 已完成 | 映射外围增强和待确认项的挂起口径 |

---

## 3. SOP 问题回答

### 3.1 每个核心能力闭环节点对应哪些用户故事？

| 核心能力闭环 | 对应用户故事 |
|---|---|
| C-1 项目主语成立 | US-WORK-001；US-WORK-002 |
| C-2 项目内成员承担成立 | US-WORK-003；US-WORK-004 |
| C-3 正式工作全集成立 | US-WORK-004；US-WORK-005；US-WORK-006 |
| C-4 承诺子集成立 | US-WORK-007；US-WORK-008 |
| C-5 可消费可追溯成立 | US-WORK-002；US-WORK-008；US-WORK-009；US-WORK-010 |
| 外围增强 | US-WORK-E01；US-WORK-E02；US-WORK-E03；US-WORK-E04；US-WORK-E05 |

### 3.2 每个用户故事对应哪些功能需求？

| 用户故事 | 对应功能需求 |
|---|---|
| US-WORK-001 | FR-WORK-001 |
| US-WORK-002 | FR-WORK-001；FR-WORK-007 |
| US-WORK-003 | FR-WORK-002 |
| US-WORK-004 | FR-WORK-002；FR-WORK-003 |
| US-WORK-005 | FR-WORK-003；FR-WORK-004 |
| US-WORK-006 | FR-WORK-004 |
| US-WORK-007 | FR-WORK-006 |
| US-WORK-008 | FR-WORK-005；FR-WORK-006；FR-WORK-007 |
| US-WORK-009 | FR-WORK-005；FR-WORK-007 |
| US-WORK-010 | FR-WORK-008 |
| US-WORK-E01 | FR-WORK-E01 |
| US-WORK-E02 | FR-WORK-E02 |
| US-WORK-E03 | FR-WORK-E03 |
| US-WORK-E04 | FR-WORK-E04 |
| US-WORK-E05 | FR-WORK-E05 |

### 3.3 每个功能需求对应哪些业务规则、数据归属和验收标准？

完整答案见 §7.1 主追溯矩阵。核心功能需求均有故事来源、闭环映射、业务规则、数据归属和验收标准。外围增强需求作为后续能力线索保留，并通过 Step 15 的范围约束和 Step 14 的非阻塞验收口径防止误入当前核心闭环。

### 3.4 是否存在没有来源的功能、没有承接的规则、没有验收的能力？

当前结论为否。

需要注意的是，外围增强能力不是孤儿需求，而是已显式标记为外围增强；它们当前不作为核心闭环成立条件，也不作为当前需求通过的一票否决前置。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` | 没有按最新结构给出闭环、故事、功能、规则、数据、验收之间的主矩阵 | 后续读者难以判断功能是否有来源和验收 | 新增固定结构主追溯矩阵 |
| 旧 `00-需求文档.md` | 功能、规则和验收跨章节关系靠自然语言理解 | 容易漏掉边界规则或验收项 | 通过主矩阵显式映射 |
| 前序 Step | 每步都有局部映射表 | 分散，不利于最终审查 | Step 16 汇总为统一矩阵和漏项检查表 |
| 外围增强项 | 已在 Step 8 / Step 9 保留 | 若不明确映射，容易被误读为当前核心缺口 | 在矩阵中标注为外围增强并引用 Step 15 挂起口径 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 追溯结构 | 分散在 Step 7~Step 15 | 以功能需求为主轴统一呈现 | 对齐规范 4.16 |
| 主轴选择 | 可能按故事、规则或闭环散列 | 固定按功能需求 | 便于检查每个功能是否有来源、规则、数据和验收 |
| 外围增强 | 只在故事和功能中出现 | 单独标注为外围增强，不作为核心验收硬前置 | 防止误判为孤儿需求 |
| 漏项检查 | 无统一结论 | 明确给出漏项检查表 | 便于进入 Step 17 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只映射核心 FR-WORK-001~008 | 表更短 | 外围增强会在追溯中消失，容易被误判为未处理 | 不采用 |
| 方案 B: 核心和外围增强都进入矩阵，但标明外围增强口径 | 覆盖完整，不会误升级外围增强 | 矩阵稍长 | 采用 |
| 方案 C: 以用户故事为主轴 | 贴近叙事 | 不符合规范 4.16 主轴要求 | 不采用 |
| 方案 D: 用自然语言说明“整体已对齐” | 简短 | 无法结构化检查漏项 | 不采用 |

### 6.1 待确认问题的方案选择

#### 外围增强功能是否进入主矩阵？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不进入 | 会丢失 Step 8 / Step 9 已保留的增强线索 |
| 方案 B | 进入并标注为外围增强 | 既保留线索，又不误升级为核心 |

推荐方案 B。原因是追溯矩阵必须覆盖前文已经定义的功能需求。

#### 是否为外围增强新增验收项？

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
| FR-WORK-001 项目工作主语成立 | C-1 项目主语成立 | US-WORK-001；US-WORK-002 | BR-WORK-001；BR-WORK-012；BR-WORK-025；BR-WORK-026 | Project 为 Work 真相数据；工作事实审计 / 追溯记录为真相数据；外部项目语境只可作为引用或快照 | AC-WORK-001；AC-WORK-006；AC-WORK-014；AC-WORK-016；AC-WORK-018；AC-WORK-019；VF-WORK-001 |
| FR-WORK-002 项目内成员承担表达 | C-2 项目内成员承担成立 | US-WORK-003；US-WORK-004 | BR-WORK-002；BR-WORK-013；BR-WORK-017；BR-WORK-025；BR-WORK-026 | ProjectMember 为 Work 真相数据；GlobalMemberRef / ActorRef 为引用数据；ProjectMember 可承担性为外部快照 | AC-WORK-002；AC-WORK-007；AC-WORK-014；AC-WORK-016；AC-WORK-017；AC-WORK-018；VF-WORK-003 |
| FR-WORK-003 正式工作全集收束 | C-3 正式工作全集成立 | US-WORK-004；US-WORK-005 | BR-WORK-003；BR-WORK-007；BR-WORK-008；BR-WORK-009；BR-WORK-010；BR-WORK-014；BR-WORK-026 | Backlog 正式工作全集和 WorkItem 为真相数据；conversation / process / governance / artifact / runtime 输入只能作为引用或快照；外部正文禁止保存 | AC-WORK-003；AC-WORK-008；AC-WORK-014；AC-WORK-015；AC-WORK-016；AC-WORK-020；VF-WORK-002；VF-WORK-006 |
| FR-WORK-004 正式工作拆分与升级边界 | C-3 正式工作全集成立 | US-WORK-005；US-WORK-006 | BR-WORK-004；BR-WORK-008；BR-WORK-015；BR-WORK-022；BR-WORK-023；BR-WORK-025；BR-WORK-026 | child WorkItem、promote 结果与来源引用关系为 Work 真相数据；ImplementationPlanRef / PlanItemRef 为引用数据；runtime 和 ImplementationPlan 正文禁止保存 | AC-WORK-003；AC-WORK-009；AC-WORK-015；AC-WORK-016；AC-WORK-017；AC-WORK-020；VF-WORK-002；VF-WORK-005 |
| FR-WORK-005 正式工作依赖与阻塞表达 | C-3 正式工作全集成立；C-5 可消费可追溯成立 | US-WORK-008；US-WORK-009 | BR-WORK-003；BR-WORK-014；BR-WORK-026；BR-WORK-027 | 工作依赖 / 阻塞关系为真相数据；完成、阻塞和解除依据使用外部引用或摘要；工作事实审计 / 追溯记录为真相数据 | AC-WORK-010；AC-WORK-019；AC-WORK-020；AC-WORK-027；AC-WORK-028；VF-WORK-007 |
| FR-WORK-006 Iteration 承诺子集形成 | C-4 承诺子集成立 | US-WORK-007；US-WORK-008 | BR-WORK-005；BR-WORK-016；BR-WORK-020；BR-WORK-026 | Iteration 承诺子集为真相数据；planning / review / timing 摘要为快照；process 相关 Ref 为引用数据 | AC-WORK-004；AC-WORK-011；AC-WORK-014；AC-WORK-016；AC-WORK-017；AC-WORK-020；VF-WORK-001 |
| FR-WORK-007 项目工作事实消费与追溯 | C-5 可消费可追溯成立 | US-WORK-002；US-WORK-008；US-WORK-009 | BR-WORK-006；BR-WORK-011；BR-WORK-017~BR-WORK-024；BR-WORK-026 | 消费视图 / 看板 / 任务摘要为派生快照；相邻仓对象为引用数据；外部正文禁止保存；工作事实审计 / 追溯记录为真相数据 | AC-WORK-005；AC-WORK-012；AC-WORK-017；AC-WORK-019；AC-WORK-021；AC-WORK-022；AC-WORK-023；AC-WORK-027；VF-WORK-004；VF-WORK-007 |
| FR-WORK-008 项目工作事实维护与对账 | C-5 可消费可追溯成立 | US-WORK-010 | BR-WORK-006；BR-WORK-011；BR-WORK-027 | 消费视图 / 看板 / 任务摘要为快照；维护对账结果不得成为业务真相；工作事实审计 / 追溯记录为真相数据 | AC-WORK-013；AC-WORK-015；AC-WORK-019；AC-WORK-021；AC-WORK-025；AC-WORK-029；VF-WORK-006 |
| FR-WORK-E01 高级看板与多视图消费 | 外围增强 | US-WORK-E01 | BR-WORK-006；BR-WORK-011；BR-WORK-024 | 高级看板 / 视图偏好只消费 Work 真相派生快照，不拥有 workspace 聚合正文 | AC-WORK-021；AC-WORK-025；Step 15 按外围增强挂起 |
| FR-WORK-E02 自动化维护建议 | 外围增强 | US-WORK-E02 | BR-WORK-006；BR-WORK-011；BR-WORK-027 | 自动建议只可基于真相数据、快照和引用形成，不得直接修改业务真相 | AC-WORK-013；AC-WORK-019；AC-WORK-025；Step 15 按外围增强挂起 |
| FR-WORK-E03 容量趋势与负载风险提示 | 外围增强 | US-WORK-E03 | BR-WORK-002；BR-WORK-006；BR-WORK-027 | 容量趋势只能使用 ProjectMember 承担事实、Iteration 承诺范围和派生快照，不形成新真相 | AC-WORK-021；AC-WORK-024；AC-WORK-025；Step 15 按外围增强挂起 |
| FR-WORK-E04 项目内工具能力调整协同 | 外围增强 | US-WORK-E04 | BR-WORK-017；BR-WORK-019；BR-WORK-021；BR-WORK-025；BR-WORK-026 | 工具能力调整只可引用 identity、method-library 和 governance 结论，不拥有定义或决策正文 | AC-WORK-017；AC-WORK-018；AC-WORK-026；Step 15 按外围增强挂起 |
| FR-WORK-E05 跨项目依赖理解 | 外围增强 | US-WORK-E05 | BR-WORK-006；BR-WORK-010；BR-WORK-024；BR-WORK-027 | 跨项目依赖只可作为消费 / 分析快照或外部引用，不改变单项目 Work 真相 | AC-WORK-021；AC-WORK-022；AC-WORK-025；Step 15 按外围增强挂起 |

### 7.2 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。FR-WORK-001~FR-WORK-008 与 FR-WORK-E01~FR-WORK-E05 均有对应故事。 |
| 是否存在没有闭环映射的功能需求 | 否。核心功能均映射到 C-1~C-5；外围增强功能明确映射为外围增强。 |
| 是否存在没有规则保护的核心功能 | 否。FR-WORK-001~FR-WORK-008 均有 BR-WORK 规则保护。 |
| 是否存在没有数据归属支撑的功能需求 | 否。核心功能均可映射到真相、快照、引用或禁止正文边界。 |
| 是否存在没有验收标准的功能需求 | 否。核心功能均有 AC-WORK 验收；外围增强不设当前硬验收，按 Step 15 挂起。 |
| 是否存在没有承接的业务规则 | 否。BR-WORK-001~BR-WORK-027 均在核心功能、边界规则或非功能验收中承接。 |
| 是否存在没有承接的数据归属要求 | 否。真相、快照、引用和禁止正文均在功能、规则与验收中承接。 |
| 是否存在没有来源的验收标准 | 否。AC-WORK-001~AC-WORK-029 均来自 Step 7 / 9 / 10 / 11 / 13。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。本矩阵没有新增前文未确认的新项。 |
| 是否存在边界外故事、规则、数据或验收项未被排除 | 否。边界外能力已在 Step 8 / Step 9 排除，并在 Step 10 / Step 11 / Step 14 中约束。 |

### 7.3 追溯结论

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | C-1~C-5 均有故事、功能、规则、数据和验收承接。 |
| 功能完整性 | 核心功能 FR-WORK-001~FR-WORK-008 均闭合；外围增强 FR-WORK-E01~E05 已保留但不阻塞当前验收。 |
| 边界完整性 | identity、conversation、method-library、process、governance、artifact、runtime、workspace 边界均有规则、数据和验收约束。 |
| 验收完整性 | 核心能力、功能能力、规则边界、数据归属和非功能均有 AC / VF 承接。 |
| 可进入 Step 17 | 可以进入正式 `00-需求文档.md` 重建。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §16。正式文档可摘录本文件 §7.1~§7.3 的表格，不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 16. 需求追溯矩阵

> 校准来源：
> - `design-calibration/00_req_step_16_traceability_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“漏项检查表”小节，了解本章如何检查闭环、故事、功能、规则、数据和验收之间的追溯关系。

本文采用 `design-calibration/00_req_step_16_traceability_matrix.md` §7 的追溯矩阵结论。主矩阵以功能需求为中心，连接核心闭环、用户故事、业务规则、数据归属要求和验收标准。当前没有孤儿功能、孤儿规则、孤儿数据归属要求或孤儿验收标准；外围增强能力已经按外围增强和 Step 15 挂起口径处理，不阻塞当前核心需求闭环。

正式章节应摘录：

- `design-calibration/00_req_step_16_traceability_matrix.md` §7.1 主追溯矩阵。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.2 漏项检查表。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.3 追溯结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | 是否需要在正式文档中完整摘录主矩阵 | 当前建议完整摘录。原因是主矩阵是需求追溯的正式审查入口。 |
| Q-002 | 外围增强是否在正式矩阵中保留 | 当前建议保留并标注外围增强。原因是它们已进入 Step 8 / Step 9，不应在追溯中消失。 |

---

## 10. 进入下一步条件

- 已形成以功能需求为主轴的主追溯矩阵。
- 已形成漏项检查表。
- 矩阵没有新增前文未确认的新项。
- 核心功能均有故事来源、闭环映射、规则保护、数据归属和验收标准。
- 外围增强已明确按外围增强和 Step 15 挂起口径处理。
