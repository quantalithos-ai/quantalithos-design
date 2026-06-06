# Step 14. 验收标准

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 14
> 回填章节: `00-需求文档.md` §14 验收标准
> 生成日期: 2026-06-05

---

## 1. 本步目标

把 Step 7 的核心能力闭环、Step 9 的功能需求、Step 10 的规则边界、Step 11 的数据归属和 Step 13 的非功能要求,统一收口成需求层可判断的验收条件。本步不写测试步骤、接口调用、脚本、测试数据准备、监控实现、CI 配置或详细证据文件格式。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心能力闭环 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定 FR-PROC-001~FR-PROC-008 与外围增强能力 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定 BR-PROC-001~BR-PROC-032 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相 / 快照 / 引用 / 禁止正文边界 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | Step 13 已完成 | 固定六类非功能判断口径 |
| `projects/L1-process/06-验收标准.md` | 旧版验收标准 | 作为旧验收线索和问题诊断输入,不直接继承测试门禁、证据列或硬指标 |

---

## 3. SOP 问题回答

### 3.1 哪些条件满足后,核心能力闭环算成立?

核心能力闭环验收必须证明 `L1-process` 不是方法定义缓存、任务执行日志、治理等待列表、runtime 调度记录或 workspace 进度投影,而是稳定的过程执行事实真相仓。

| 闭环节点 | 验收判断 |
|---|---|
| C-1 运行时过程形态成立 | 方法定义能够进入项目可执行过程形态,且不替代 method-library 定义真相。 |
| C-2 项目过程实例成立 | 项目过程实例能够作为正式运行事实成立,并被相邻仓稳定引用。 |
| C-3 过程节点和流控位置成立 | Activity、Token / Gateway 能表达当前推进位置和承担语境,且不等同 WorkItem、plan item 或 runtime step。 |
| C-4 暂停等待恢复连续成立 | waiting gate、pause context、checkpoint / recovery 能表达同一过程事实的等待和恢复连续性。 |
| C-5 可消费可追溯成立 | 过程形态、实例、节点、等待、恢复、执行反馈和相邻引用能够被授权消费并追溯。 |

### 3.2 哪些功能能力满足后,本次需求算完成?

本次需求的功能能力验收只覆盖核心闭环能力。外围增强能力可以作为后续需求线索,但不得成为当前需求通过的硬前置。

| 功能需求 | 验收判断 |
|---|---|
| FR-PROC-001 | 运行时过程形态能从方法定义来源形成、采用、调整或切换,且不接管定义正文。 |
| FR-PROC-002 | 项目过程实例能正式建立并作为过程运行事实被引用和追溯。 |
| FR-PROC-003 | 过程节点与流控位置能表达当前推进状态和等待原因。 |
| FR-PROC-004 | Activity 执行反馈能绑定到正式过程节点语境,且不保存 runtime 执行正文。 |
| FR-PROC-005 | 暂停等待与恢复语境能解释为什么停、等待什么、依据是什么。 |
| FR-PROC-006 | 过程事实恢复连续性能够避免故障或维护后产生多份过程真相。 |
| FR-PROC-007 | 过程执行事实能被管理者、审计者和相邻仓授权消费和追溯。 |
| FR-PROC-008 | 维护、对账和重建派生结果不能改变业务真相,并能说明来源和结果。 |

### 3.3 哪些规则 / 边界被满足后,才算没有串线?

规则 / 边界验收重点不在于状态机细节,而在于相邻仓真相不能反向污染 Process。

| 规则组 | 验收判断 |
|---|---|
| 不变量 | 运行时过程形态、ProcessInstance、Activity / Token / Gateway、waiting gate、checkpoint / recovery 和消费 / 维护面边界稳定成立。 |
| 禁止行为 | method-library、work、governance、artifact、runtime、identity、conversation、workspace、查询和维护动作不能直接写入 Process 业务真相。 |
| 显式变化 | 方法定义进入运行时形态、项目采用、实例运行、节点反馈、等待和恢复必须显式发生。 |
| 边界约束 | method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 的正文和决策真相不归 Process。 |
| 治理 / 审计约束 | 高风险裁剪、waiting gate、恢复、维护和关键变化必须满足正式外部依据或可追溯要求。 |

### 3.4 哪些数据边界被满足后,才算数据归属正确?

数据归属验收必须证明 Process 只拥有过程执行事实,不保存相邻仓正文。

| 数据类型 | 验收判断 |
|---|---|
| 真相数据 | 运行时过程形态、ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery、process timing 和追溯记录由 Process 拥有。 |
| 快照数据 | 外部摘要和 process read model 只能服务稳定消费、判断和解释,不形成独立业务真相。 |
| 引用数据 | method、work、identity、governance、artifact、runtime、conversation、observability、archive 等对象只作为引用进入。 |
| 禁止保存正文 | method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 正文不得进入 Process。 |

### 3.5 哪些非功能要求被满足后,才算质量达标?

非功能验收采用 Step 13 的六类判断口径,当前不把旧 `200ms / 50ms / 500ms / 30s` 写成需求层硬指标。

| 非功能类别 | 验收判断 |
|---|---|
| 性能 | 运行时过程形态形成、过程推进、等待恢复和基础读取不应成为项目推进主链瓶颈。 |
| 可用性 | 外围增强失效时核心闭环仍应成立;外部依赖延迟时不得篡改 Process 真相边界。 |
| 安全 | 正文边界、授权边界、高风险变化和相邻仓边界必须成立。 |
| 审计 / 可追溯 | 过程形态、实例、节点、等待、恢复、反馈和维护对账必须可解释。 |
| 幂等 / 一致性 | 重复输入不得产生重复正式事实;恢复不得产生第二份过程真相;快照 / 投影滞后必须可解释。 |
| 可观测性 | 核心变化、边界越界、依赖延迟和维护状态必须可发现。 |

### 3.6 哪些失败情形属于一票否决?

一票否决项只覆盖会使 `L1-process` 仓定位失效、核心闭环断裂或相邻仓边界被打穿的严重情况。外围增强缺失、候选性能指标未定稿、展示体验不足不属于一票否决。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `06-验收标准.md` §11 | 以 F-001/F-010、Given-When-Then 和执行方式组织 | 滑入测试方案和接口候选,不符合需求层验收粒度 | 改为核心闭环和功能能力验收 |
| `06-验收标准.md` §11.2 | 直接写 P95、checkpoint inline、30s 恢复等量化门槛 | 这些指标在 Step 13 已收敛为候选目标 | 不作为当前需求层硬验收 |
| `06-验收标准.md` §11.3 | 文档和测试作为完成口径 | 文档 / 测试门禁属于实施和验收专项 | 需求 Step 14 只写能力、边界、数据和非功能条件 |
| `06-验收标准.md` §12 | 风险、缓解和待确认事项混在旧验收后 | 风险应进入 Step 15 | 后续独立整理风险 |
| `06-验收标准.md` §13 | 追溯矩阵以旧 US 和验收场景为主 | 追溯矩阵应在 Step 16 从新闭环 / 功能 / 规则 / 验收生成 | 不直接继承 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收组织 | 按旧功能 / 测试场景组织 | 按核心闭环、功能、规则、数据、非功能组织 | 对齐需求规范 4.14 |
| 验收粒度 | 接口、Given-When-Then、执行方式、测试报告混入 | 只写“验什么”和“怎样算通过” | 防止 Step 14 变成测试方案 |
| 一票否决 | 分散在红线和风险中 | 独立列出核心失败条件 | 让仓边界失效问题不被普通缺陷淹没 |
| 旧硬指标 | 作为性能门禁 | 作为候选目标,不进入需求层硬验收 | 避免伪量化 |
| 外围增强 | 容易与核心功能同等验收 | 明确不阻塞核心需求通过 | 保持核心闭环优先 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 `06-验收标准.md` 门禁 | 可直接进入测试执行 | 混入接口、测试步骤、证据和硬指标,且没有按需求规范分类 | 不采用 |
| 方案 B: 按需求规范 4.14 分类重写 | 能追溯 Step 7 / 9 / 10 / 11 / 13,适合后续 Step 16 | 后续测试方案还要再细化执行证据 | 采用 |
| 方案 C: 只列一票否决项 | 简洁 | 功能和数据归属验收覆盖不足 | 不采用 |
| 方案 D: 把所有外围增强也纳入验收 | 覆盖面更大 | 会让增强能力阻塞核心需求通过 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把旧性能数字作为一票否决?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 未达到旧 P95 / 30s 数字即一票否决 | 会把未验证候选指标误升级为硬需求 |
| 方案 B | 只要求核心主链不成为协作瓶颈,数字后续测试阶段验证 | 保留性能方向,避免伪量化 |

推荐方案 B。原因是 Step 13 已明确旧数字只是候选目标。

#### 是否把完整 BPMN / 嵌套过程缺失列为验收失败?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为当前验收失败 | 外围增强会压过核心闭环 |
| 方案 B | 不作为核心需求失败;基础节点与流控位置必须成立 | 对齐 Step 8 / Step 9 |

推荐方案 B。原因是完整 BPMN / 嵌套过程是外围增强,不是当前核心闭环条件。

#### 是否把测试证据路径写入本步?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 14 写测试脚本、报告路径和证据格式 | 会与测试方案、验收标准专项文档混淆 |
| 方案 B | 只写需求层验收条件,执行证据后移 | 保持需求文档粒度清晰 |

推荐方案 B。原因是 SOP 明确本步不写测试步骤、脚本和接口调用细节。

---

## 7. 结构化中间产物

### 7.1 验收类别结论

| 验收类别 | 对应输入 | 覆盖范围 |
|---|---|---|
| 核心能力闭环验收 | Step 7 | C-1~C-5 是否共同成立 |
| 功能能力验收 | Step 9 | FR-PROC-001~FR-PROC-008 是否完成 |
| 规则 / 边界验收 | Step 10 | BR-PROC-001~BR-PROC-032 是否防止串线 |
| 数据归属验收 | Step 11 | 真相、快照、引用、禁止正文边界是否成立 |
| 非功能验收 | Step 13 | 六类质量要求是否达到需求层判断口径 |

### 7.2 验收标准表

| 验收类别 | ID | 验收项 | 验收条件 |
|---|---|---|---|
| 核心能力闭环验收 | AC-PROC-001 | 运行时过程形态成立 | 方法定义能够进入项目可执行过程形态,且不替代 method-library 定义真相。 |
| 核心能力闭环验收 | AC-PROC-002 | 项目过程实例成立 | 项目过程实例能够作为正式运行事实成立、引用和追溯,不退化为 workspace 进度条或 runtime 记录。 |
| 核心能力闭环验收 | AC-PROC-003 | 过程节点和流控位置成立 | Activity、Token / Gateway 能表达当前推进位置和承担语境,且不等同 WorkItem、plan item 或 runtime step。 |
| 核心能力闭环验收 | AC-PROC-004 | 暂停等待恢复连续成立 | waiting gate、pause context、checkpoint / recovery 能表达同一过程事实的等待和恢复连续性。 |
| 核心能力闭环验收 | AC-PROC-005 | 过程执行事实可消费可追溯 | 过程形态、实例、节点、等待、恢复、执行反馈和相邻引用能被授权消费并追溯。 |
| 功能能力验收 | AC-PROC-006 | 运行时过程形态形成能力 | FR-PROC-001 的形成、采用、调整和切换能力成立,且不接管方法定义正文。 |
| 功能能力验收 | AC-PROC-007 | 项目过程实例成立能力 | FR-PROC-002 的正式过程运行事实能够成立、引用和追溯。 |
| 功能能力验收 | AC-PROC-008 | 过程节点与流控位置表达能力 | FR-PROC-003 能表达当前推进状态、承担语境和等待原因。 |
| 功能能力验收 | AC-PROC-009 | Activity 执行语境与反馈绑定能力 | FR-PROC-004 能把执行反馈绑定到正式过程节点,且不保存 runtime 执行正文。 |
| 功能能力验收 | AC-PROC-010 | 暂停等待与恢复语境表达能力 | FR-PROC-005 能解释为什么停、等待什么、依据是什么。 |
| 功能能力验收 | AC-PROC-011 | 过程事实恢复连续性维护能力 | FR-PROC-006 能避免故障或维护后产生多份过程真相。 |
| 功能能力验收 | AC-PROC-012 | 过程执行事实消费与追溯能力 | FR-PROC-007 能支持授权消费、追溯和相邻仓理解过程状态。 |
| 功能能力验收 | AC-PROC-013 | 过程执行事实维护与对账能力 | FR-PROC-008 能维护派生结果和对账,且不改变业务真相。 |
| 规则 / 边界验收 | AC-PROC-014 | 不变量成立 | BR-PROC-001~BR-PROC-007 的过程执行事实不变量成立。 |
| 规则 / 边界验收 | AC-PROC-015 | 禁止行为被阻断 | BR-PROC-008~BR-PROC-014 的越界写入、查询隐式修改和维护反写真相被禁止。 |
| 规则 / 边界验收 | AC-PROC-016 | 显式变化成立 | BR-PROC-015~BR-PROC-020 的正式变化必须显式发生。 |
| 规则 / 边界验收 | AC-PROC-017 | 相邻仓边界成立 | BR-PROC-021~BR-PROC-028 的 method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 边界不被打穿。 |
| 规则 / 边界验收 | AC-PROC-018 | 治理约束成立 | BR-PROC-029~BR-PROC-030 的高风险裁剪、强制 gate 移除、waiting gate 和恢复依据不能绕过正式约束。 |
| 规则 / 边界验收 | AC-PROC-019 | 审计约束成立 | BR-PROC-031~BR-PROC-032 的关键变化、恢复、对账和维护动作可追溯可解释。 |
| 数据归属验收 | AC-PROC-020 | Process 真相数据归属正确 | 运行时过程形态、ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery、process timing 和追溯记录归 Process。 |
| 数据归属验收 | AC-PROC-021 | 外部快照不成真相 | 外部摘要和 process read model 只服务判断、解释和消费,不形成独立业务真相。 |
| 数据归属验收 | AC-PROC-022 | 外部引用不接管正文 | method、work、identity、governance、artifact、runtime、conversation、observability、archive 等对象只作为引用进入。 |
| 数据归属验收 | AC-PROC-023 | 外部正文禁止入仓 | method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 正文不得保存为 Process 数据。 |
| 非功能验收 | AC-PROC-024 | 性能判断口径成立 | 运行时过程形态形成、过程推进、等待恢复和基础读取不成为项目推进主链瓶颈;旧量化指标仅作候选目标。 |
| 非功能验收 | AC-PROC-025 | 可用性判断口径成立 | 外围增强失效不影响核心闭环;外部依赖延迟不导致 Process 造真相。 |
| 非功能验收 | AC-PROC-026 | 安全判断口径成立 | 正文边界、授权边界、高风险变化和相邻仓边界成立。 |
| 非功能验收 | AC-PROC-027 | 审计 / 可追溯判断口径成立 | 过程形态、实例、节点、等待、恢复、反馈和维护对账均可解释。 |
| 非功能验收 | AC-PROC-028 | 幂等 / 一致性判断口径成立 | 重复输入不产生重复正式事实,恢复不产生第二份过程真相,快照 / 投影滞后能解释。 |
| 非功能验收 | AC-PROC-029 | 可观测性判断口径成立 | 核心变化、边界越界、依赖延迟和维护状态可发现。 |

### 7.3 一票否决项

| ID | 一票否决项 | 否决原因 |
|---|---|---|
| VF-PROC-001 | C-1~C-5 任一核心闭环节点无法成立。 | Process 仓失去过程执行事实真相仓定位。 |
| VF-PROC-002 | ProcessTemplateDef / TaskDefinition / Method Content 正文被 Process 接管。 | method-library / Process 边界被打穿。 |
| VF-PROC-003 | ProcessInstance / Activity / Token 被直接视为 Project / WorkItem / Iteration / runtime step truth。 | process / work / runtime 边界混淆。 |
| VF-PROC-004 | waiting gate 或 pause context 被写成 governance Gate / Policy / decision 真相。 | process / governance 边界被打穿。 |
| VF-PROC-005 | artifact、runtime、identity、conversation、workspace、observability 或 archive 正文被保存为 Process 数据。 | 数据归属边界被打穿。 |
| VF-PROC-006 | 查询、投影、报告、恢复对账或维护任务能隐式创建、推进、暂停、恢复或完成过程事实。 | 消费面或维护面反写真相。 |
| VF-PROC-007 | 恢复产生第二份过程真相,或关键变化不可追溯。 | 恢复连续性和审计能力失效。 |
| VF-PROC-008 | `L1-process` 的唯一编译期上游不再限定为 `L0-core`,把 bus 或其他 L1 / L2 / L3 / L4 仓写成 package dependency。 | 全局依赖裁剪规则被破坏。 |

### 7.4 验收与功能 / 规则映射结论

| 范围 | 对应验收项 |
|---|---|
| C-1~C-5 核心能力闭环 | AC-PROC-001~AC-PROC-005;VF-PROC-001 |
| FR-PROC-001~FR-PROC-008 | AC-PROC-006~AC-PROC-013 |
| BR-PROC-001~BR-PROC-032 | AC-PROC-014~AC-PROC-019;VF-PROC-002~VF-PROC-007 |
| Step 11 数据归属 | AC-PROC-020~AC-PROC-023;VF-PROC-002~VF-PROC-005 |
| Step 13 非功能要求 | AC-PROC-024~AC-PROC-029 |
| Step 6 / Step 12 依赖裁剪 | VF-PROC-008 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §14。正式文档可摘录本文件 §7.1~§7.4 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 14. 验收标准

> 校准来源:
> - `design-calibration/00_req_step_14_acceptance_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“一票否决项”小节,了解本章如何从核心闭环、功能需求、规则边界、数据归属和非功能要求收敛验收条件。

本文采用 `design-calibration/00_req_step_14_acceptance_criteria.md` §7 的验收标准结论。验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类组织;一票否决项只覆盖核心闭环断裂、过程执行事实污染、相邻仓边界打穿、关键变化不可追溯和依赖裁剪失效。

正式验收章节应摘录:

- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.1 验收类别结论。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.2 验收标准表。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.3 一票否决项。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.4 验收与功能 / 规则映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把旧 P95 / 30s 性能数字作为一票否决 | 是 | 否,作为后续测试 / 容量阶段候选目标 | 推荐 B。原因是 Step 13 已避免伪量化 |
| Q-002 | 外围增强能力未完成是否导致当前需求不通过 | 是 | 否,只要核心闭环和边界成立即可通过 | 推荐 B。原因是外围增强不决定 Process 成立 |
| Q-003 | 是否在需求验收章节写测试脚本、报告路径和接口调用步骤 | 写 | 不写,后移测试方案和验收标准专项文档 | 推荐 B。原因是 Step 14 只写需求层验收条件 |
| Q-004 | 一票否决是否包含普通缺陷和可延期优化 | 包含 | 不包含,只覆盖核心闭环和边界失效 | 推荐 B。原因是一票否决要保持高信号 |

当前建议:接受上述推荐后进入 Step 15。

---

## 10. 进入下一步条件

- 已按核心能力闭环、功能能力、规则 / 边界、数据归属、非功能五类整理验收项。
- 每条验收项都有可判断的验收条件。
- 已明确一票否决项。
- 已说明验收项与功能、规则、数据归属和非功能要求的映射。
- 未写测试步骤、测试脚本、接口调用、测试数据准备、监控实现或 CI 配置。
