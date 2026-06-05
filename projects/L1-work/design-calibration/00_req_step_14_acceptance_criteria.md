# Step 14. 验收标准

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 14
> 回填章节: `00-需求文档.md` §14 验收标准
> 生成日期: 2026-06-02

---

## 1. 本步目标

把 Step 7 的核心能力闭环、Step 9 的功能需求、Step 10 的规则边界、Step 11 的数据归属和 Step 13 的非功能要求，统一收口成需求层可判断的验收条件。本步不写测试步骤、接口调用、脚本、测试数据准备、监控实现、CI 配置或详细证据文件格式。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心能力闭环 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定 FR-WORK-001~FR-WORK-008 与外围增强能力 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定 BR-WORK-001~BR-WORK-027 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相 / 快照 / 引用 / 禁止正文边界 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | Step 13 已完成 | 固定六类非功能判断口径 |
| `projects/L1-work/06-验收标准.md` | 旧版验收标准 | 作为旧验收线索和问题诊断输入，不直接继承测试门禁、证据列或硬指标 |

---

## 3. SOP 问题回答

### 3.1 哪些条件满足后，核心能力闭环算成立？

核心能力闭环验收必须证明 `L1-work` 不是普通任务列表、执行计划仓或看板投影，而是稳定的项目工作事实真相仓。

| 闭环节点 | 验收判断 |
|---|---|
| C-1 项目主语成立 | 软件项目能够作为正式工作对象成立，并被相邻仓稳定引用。 |
| C-2 项目内成员承担成立 | GlobalMember 的项目内承担能够被表达为 ProjectMember，且不接管平台级成员真相。 |
| C-3 正式工作全集成立 | Backlog、WorkItem、child WorkItem 能表达协作级正式工作，并排除个人执行步骤、对话建议和 runtime 局部计划项。 |
| C-4 承诺子集成立 | Iteration 能从 Backlog 正式工作全集中形成当前时间窗口内的承诺子集。 |
| C-5 可消费可追溯成立 | 项目、成员承担、正式工作、承诺子集、完成依据和维护结果能够被授权消费并追溯。 |

### 3.2 哪些功能能力满足后，本次需求算完成？

本次需求的功能能力验收只覆盖核心闭环能力。外围增强能力可以作为后续需求线索，但不得成为当前需求通过的硬前置。

| 功能需求 | 验收判断 |
|---|---|
| FR-WORK-001 | 项目工作主语能正式建立、引用和追溯。 |
| FR-WORK-002 | 项目内成员承担能基于外部成员身份形成独立项目事实。 |
| FR-WORK-003 | 正式工作全集能收束协作级工作，并拒绝边界外内容直接进入。 |
| FR-WORK-004 | 正式拆分和 plan item promote 能显式形成 child WorkItem 或被拒绝。 |
| FR-WORK-005 | 正式工作依赖、阻塞和解除依据能被表达和解释。 |
| FR-WORK-006 | Iteration 能表达从正式工作全集中选择出的承诺范围。 |
| FR-WORK-007 | 项目工作事实能被成员、审计者和相邻仓授权消费和追溯。 |
| FR-WORK-008 | 维护、对账和重建派生结果不能改变业务真相，并能说明来源和结果。 |

### 3.3 哪些规则 / 边界被满足后，才算没有串线？

规则 / 边界验收重点不在于状态机细节，而在于相邻仓真相不能反向污染 Work。

| 规则组 | 验收判断 |
|---|---|
| 不变量 | Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和消费 / 维护面边界稳定成立。 |
| 禁止行为 | conversation、runtime、process、artifact、governance、workspace、查询和维护动作不能直接写入 Work 业务真相。 |
| 显式变化 | Project 建立、ProjectMember 承担、WorkItem 正式化、promote、Iteration 承诺范围变化必须显式发生。 |
| 边界约束 | identity、conversation、method-library、process、governance、artifact、runtime、workspace 的正文和决策真相不归 Work。 |
| 治理 / 审计约束 | 高风险变化必须满足治理或方法定义约束；关键变化和维护动作必须可追溯。 |

### 3.4 哪些数据边界被满足后，才算数据归属正确？

数据归属验收必须证明 Work 只拥有项目工作事实，不保存相邻仓正文。

| 数据类型 | 验收判断 |
|---|---|
| 真相数据 | Project、ProjectMember、Backlog、WorkItem、child WorkItem、依赖 / 阻塞、Iteration、promote 结果和追溯记录由 Work 拥有。 |
| 快照数据 | 外部摘要和消费视图只能服务稳定消费、判断和解释，不形成独立业务真相。 |
| 引用数据 | 外部对象只以引用关系进入，正文生命周期仍归上游仓。 |
| 禁止保存正文 | identity、conversation、method-library、process、governance、artifact、runtime、workspace 正文不得进入 Work。 |

### 3.5 哪些非功能要求被满足后，才算质量达标？

非功能验收采用 Step 13 的六类判断口径，当前不把旧 `100ms / 300ms / 500w` 写成需求层硬指标。

| 非功能类别 | 验收判断 |
|---|---|
| 性能 | 核心写真相、读取消费、Iteration 和 promote 主线不应成为协作主链瓶颈。 |
| 可用性 | 外围增强失效时，核心闭环仍应成立；外部依赖延迟时不得篡改 Work 真相边界。 |
| 安全 | 正文边界、授权边界、高风险变化和相邻仓边界必须成立。 |
| 审计 / 可追溯 | Project、ProjectMember、WorkItem、child WorkItem、Iteration、promote、完成依据和维护对账必须可解释。 |
| 幂等 / 一致性 | 重复输入不得产生重复正式事实；快照 / 投影滞后必须可解释。 |
| 可观测性 | 核心变化、边界越界、依赖延迟和维护状态必须可发现。 |

### 3.6 哪些失败情形属于一票否决？

一票否决项只覆盖会使 `L1-work` 仓定位失效、核心闭环断裂或相邻仓边界被打穿的严重情况。外围增强缺失、候选性能指标未定稿、展示体验不足不属于一票否决。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `06-验收标准.md` §4 | 以 CreateProject、CreateWorkItem、StartIteration 等功能 / 测试场景组织 | 滑入测试方案和接口候选，不符合需求层验收粒度 | 改为核心闭环和功能能力验收 |
| `06-验收标准.md` §5 | 直接写 `CreateWorkItem P95 < 100ms`、`GetProjectBoard P95 < 300ms` | 这些指标在 Step 13 已收敛为候选目标 | 不作为当前需求层硬验收 |
| `06-验收标准.md` §6 | 三红线有价值，但表达成证据 / 日志检查 | 方向正确，粒度偏测试和验收执行 | 转译为规则边界、数据归属和追溯验收 |
| `06-验收标准.md` §7 | Gate / Policy、权限和供应链混写 | 治理边界有价值，供应链不是需求 Step 14 主体 | 保留治理边界，供应链后移测试 / 运维 |
| `06-验收标准.md` §8~§10 | 缺陷分级、风险接受、签署 | 属于验收管理流程，不是需求文档验收条件 | 后续 `06-验收标准.md` 专项文档可承接 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收组织 | 按主要功能 / 测试门禁组织 | 按核心闭环、功能、规则、数据、非功能组织 | 对齐需求规范 4.14 |
| 验收粒度 | 接口、证据、日志、测试报告混入 | 只写“验什么”和“怎样算通过” | 防止 Step 14 变成测试方案 |
| 一票否决 | 分散在红线和缺陷等级中 | 独立列出核心失败条件 | 让仓边界失效问题不被普通缺陷淹没 |
| 旧硬指标 | 作为性能门禁 | 作为候选目标，不进入需求层硬验收 | 避免伪量化 |
| 外围增强 | 容易与核心功能同等验收 | 明确不阻塞核心需求通过 | 保持核心闭环优先 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 `06-验收标准.md` 门禁 | 可直接进入测试执行 | 混入接口、证据、脚本和硬指标，且没有按需求规范分类 | 不采用 |
| 方案 B: 按需求规范 4.14 分类重写 | 能追溯 Step 7 / 9 / 10 / 11 / 13，适合后续 Step 16 | 后续测试方案还要再细化执行证据 | 采用 |
| 方案 C: 只列一票否决项 | 简洁 | 功能和数据归属验收覆盖不足 | 不采用 |
| 方案 D: 把所有外围增强也纳入验收 | 覆盖面更大 | 会让增强能力阻塞核心需求通过 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把旧性能数字作为一票否决？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 未达到旧 P95 数字即一票否决 | 会把未验证候选指标误升级为硬需求 |
| 方案 B | 只要求核心主链不成为协作瓶颈，数字后续测试阶段验证 | 保留性能方向，避免伪量化 |

推荐方案 B。原因是 Step 13 已明确旧数字只是候选目标。

#### 是否把高级看板缺失列为验收失败？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为当前验收失败 | 外围增强会压过核心闭环 |
| 方案 B | 不作为核心需求失败；基础消费和追溯必须成立 | 对齐 Step 8 / Step 9 |

推荐方案 B。原因是 Work 核心是项目工作事实，而不是高级展示。

#### 是否把测试证据路径写入本步？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 14 写测试脚本、报告路径和证据格式 | 会与测试方案、验收标准专项文档混淆 |
| 方案 B | 只写需求层验收条件，执行证据后移 | 保持需求文档粒度清晰 |

推荐方案 B。原因是 SOP 明确本步不写测试步骤、脚本和接口调用细节。

---

## 7. 结构化中间产物

### 7.1 验收类别结论

| 验收类别 | 对应输入 | 覆盖范围 |
|---|---|---|
| 核心能力闭环验收 | Step 7 | C-1~C-5 是否共同成立 |
| 功能能力验收 | Step 9 | FR-WORK-001~FR-WORK-008 是否完成 |
| 规则 / 边界验收 | Step 10 | BR-WORK-001~BR-WORK-027 是否防止串线 |
| 数据归属验收 | Step 11 | 真相、快照、引用、禁止正文边界是否成立 |
| 非功能验收 | Step 13 | 六类质量要求是否达到需求层判断口径 |

### 7.2 验收标准表

| 验收类别 | ID | 验收项 | 验收条件 |
|---|---|---|---|
| 核心能力闭环验收 | AC-WORK-001 | 项目主语成立 | Project 能作为正式工作对象建立、引用和追溯，不退化为对话主题、流程实例或 workspace 视图。 |
| 核心能力闭环验收 | AC-WORK-002 | 项目内成员承担成立 | ProjectMember 能表达 GlobalMember 在项目内的承担事实，且不接管平台成员生命周期。 |
| 核心能力闭环验收 | AC-WORK-003 | 正式工作全集成立 | Backlog、WorkItem、child WorkItem 能形成协作级正式工作全集，并排除个人执行步骤、对话建议和 runtime 局部计划项。 |
| 核心能力闭环验收 | AC-WORK-004 | Iteration 承诺子集成立 | Iteration 能从 Backlog 正式工作全集中形成承诺范围，且不等同于 Backlog 全集或 process planning。 |
| 核心能力闭环验收 | AC-WORK-005 | 项目工作事实可消费可追溯 | 项目、成员承担、正式工作、承诺子集、完成依据和维护结果能被授权消费并追溯。 |
| 功能能力验收 | AC-WORK-006 | 项目工作主语成立能力 | FR-WORK-001 的项目建立、引用和追溯能力成立。 |
| 功能能力验收 | AC-WORK-007 | 项目内成员承担表达能力 | FR-WORK-002 的项目内承担事实与身份真相边界成立。 |
| 功能能力验收 | AC-WORK-008 | 正式工作全集收束能力 | FR-WORK-003 能把正式协作工作收束进 Backlog，并拒绝边界外输入直接污染。 |
| 功能能力验收 | AC-WORK-009 | 正式拆分与升级边界能力 | FR-WORK-004 能显式形成 child WorkItem 或给出拒绝，不隐式吸收 runtime step。 |
| 功能能力验收 | AC-WORK-010 | 依赖与阻塞表达能力 | FR-WORK-005 能表达正式工作依赖、阻塞和解除依据，并保持可解释。 |
| 功能能力验收 | AC-WORK-011 | Iteration 承诺能力 | FR-WORK-006 能形成和调整当前承诺子集，并保持与 Backlog 全集边界。 |
| 功能能力验收 | AC-WORK-012 | 消费与追溯能力 | FR-WORK-007 能支持授权消费、追溯和相邻仓理解项目工作状态。 |
| 功能能力验收 | AC-WORK-013 | 维护与对账能力 | FR-WORK-008 能维护派生结果和对账，且不改变业务真相。 |
| 规则 / 边界验收 | AC-WORK-014 | 不变量成立 | BR-WORK-001~BR-WORK-006 的项目工作事实不变量成立。 |
| 规则 / 边界验收 | AC-WORK-015 | 禁止行为被阻断 | BR-WORK-007~BR-WORK-011 的越界写入、查询隐式修改和维护反写真相被禁止。 |
| 规则 / 边界验收 | AC-WORK-016 | 显式变化成立 | BR-WORK-012~BR-WORK-016 的正式变化必须显式发生。 |
| 规则 / 边界验收 | AC-WORK-017 | 相邻仓边界成立 | BR-WORK-017~BR-WORK-024 的 identity、conversation、method-library、process、governance、artifact、runtime、workspace 边界不被打穿。 |
| 规则 / 边界验收 | AC-WORK-018 | 治理约束成立 | BR-WORK-025 的高风险项目变化、工作拆分、promote 和工具能力调整不能绕过正式约束。 |
| 规则 / 边界验收 | AC-WORK-019 | 审计约束成立 | BR-WORK-026~BR-WORK-027 的关键变化、阻塞、完成、spillover、对账和维护动作可追溯可解释。 |
| 数据归属验收 | AC-WORK-020 | Work 真相数据归属正确 | Project、ProjectMember、Backlog、WorkItem、child WorkItem、依赖 / 阻塞、Iteration、promote 结果和追溯记录归 Work。 |
| 数据归属验收 | AC-WORK-021 | 外部快照不成真相 | 外部摘要和消费视图只服务判断、解释和消费，不形成独立业务真相。 |
| 数据归属验收 | AC-WORK-022 | 外部引用不接管正文 | GlobalMember、method、process、governance、artifact、runtime、conversation 等对象只作为引用进入。 |
| 数据归属验收 | AC-WORK-023 | 外部正文禁止入仓 | 相邻仓正文和运行时执行正文不得保存为 Work 数据。 |
| 非功能验收 | AC-WORK-024 | 性能判断口径成立 | 核心写入、读取、Iteration 和 promote 主线不成为协作主链瓶颈；旧量化指标仅作候选目标。 |
| 非功能验收 | AC-WORK-025 | 可用性判断口径成立 | 外围增强失效不影响核心闭环；外部依赖延迟不导致 Work 造真相。 |
| 非功能验收 | AC-WORK-026 | 安全判断口径成立 | 正文边界、授权边界、高风险变化和相邻仓边界成立。 |
| 非功能验收 | AC-WORK-027 | 审计 / 可追溯判断口径成立 | 核心变化、完成依据、阻塞解除和维护对账均可解释。 |
| 非功能验收 | AC-WORK-028 | 幂等 / 一致性判断口径成立 | 重复输入不产生重复正式事实，快照 / 投影滞后能解释。 |
| 非功能验收 | AC-WORK-029 | 可观测性判断口径成立 | 核心变化、边界越界、依赖延迟和维护状态可发现。 |

### 7.3 一票否决项

| ID | 一票否决项 | 否决原因 |
|---|---|---|
| VF-WORK-001 | C-1~C-5 任一核心闭环节点无法成立。 | Work 仓失去项目工作事实真相仓定位。 |
| VF-WORK-002 | Backlog、WorkItem 或 child WorkItem 混入个人执行步骤、对话建议或 runtime 局部计划项。 | 正式工作全集被污染。 |
| VF-WORK-003 | ProjectMember 接管 GlobalMember、Role、Actor 生命周期或身份正文。 | identity / Work 边界被打穿。 |
| VF-WORK-004 | Work 保存 conversation、method-library、process、governance、artifact、runtime 或 workspace 正文。 | 数据归属边界被打穿。 |
| VF-WORK-005 | ImplementationPlan / PlanItem / runtime progress 直接成为 Work 业务真相。 | runtime / artifact 与 Work 边界混淆。 |
| VF-WORK-006 | process planning、governance、artifact、workspace、查询或维护任务能隐式创建或修改 Work 业务真相。 | 相邻仓或消费面反写真相。 |
| VF-WORK-007 | Project、ProjectMember、WorkItem、child WorkItem、Iteration、promote、完成依据等关键变化不可追溯。 | 审计和消费解释能力失效。 |
| VF-WORK-008 | Work 的唯一编译期上游不再限定为 `L0-core`，把 bus 或其他 L1 / L2 仓写成 package dependency。 | 全局依赖裁剪规则被破坏。 |

### 7.4 验收与功能 / 规则映射结论

| 范围 | 对应验收项 |
|---|---|
| C-1~C-5 核心能力闭环 | AC-WORK-001~AC-WORK-005；VF-WORK-001 |
| FR-WORK-001~FR-WORK-008 | AC-WORK-006~AC-WORK-013 |
| BR-WORK-001~BR-WORK-027 | AC-WORK-014~AC-WORK-019；VF-WORK-002~VF-WORK-007 |
| Step 11 数据归属 | AC-WORK-020~AC-WORK-023；VF-WORK-003~VF-WORK-005 |
| Step 13 非功能要求 | AC-WORK-024~AC-WORK-029 |
| Step 6 / Step 12 依赖裁剪 | VF-WORK-008 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §14。正式文档可摘录本文件 §7.1~§7.4 的表格，不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 14. 验收标准

> 校准来源：
> - `design-calibration/00_req_step_14_acceptance_criteria.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“一票否决项”小节，了解本章如何从核心闭环、功能需求、规则边界、数据归属和非功能要求收敛验收条件。

本文采用 `design-calibration/00_req_step_14_acceptance_criteria.md` §7 的验收标准结论。验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类组织；一票否决项只覆盖核心闭环断裂、正式工作事实污染、相邻仓边界打穿、关键变化不可追溯和依赖裁剪失效。

正式验收章节应摘录：

- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.1 验收类别结论。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.2 验收标准表。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.3 一票否决项。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.4 验收与功能 / 规则映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把旧 `100ms / 300ms / 500w` 作为当前需求验收硬指标 | 是 | 否，作为后续测试 / 容量阶段候选目标 | 推荐 B。原因是 Step 13 已避免伪量化 |
| Q-002 | 外围增强能力未完成是否导致当前需求不通过 | 是 | 否，只要核心闭环和边界成立即可通过 | 推荐 B。原因是外围增强不决定 Work 成立 |
| Q-003 | 是否在需求验收章节写测试脚本、报告路径和接口调用步骤 | 写 | 不写，后移测试方案和验收标准专项文档 | 推荐 B。原因是 Step 14 只写需求层验收条件 |
| Q-004 | 一票否决是否包含普通缺陷和可延期优化 | 包含 | 不包含，只覆盖核心闭环和边界失效 | 推荐 B。原因是一票否决要保持高信号 |

当前建议：接受上述推荐后进入 Step 15。

---

## 10. 进入下一步条件

- 已按核心能力闭环、功能能力、规则 / 边界、数据归属、非功能五类整理验收项。
- 每条验收项都有可判断的验收条件。
- 已明确一票否决项。
- 已说明验收项与功能、规则、数据归属和非功能要求的映射。
- 未写测试步骤、测试脚本、接口调用、测试数据准备、监控实现或 CI 配置。
