# Step 1. 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵
> 生成日期: 2026-06-05

---

## 1. 本步目标

确认当前架构设计依赖的需求结论已经收敛到足以支撑架构推导的程度,并识别哪些需求结论会直接影响系统边界、数据所有权、依赖方向和一致性策略。本步只提炼对架构有约束力的需求结论,不重写需求文档全文,不定义容器、模块、协议、状态机、数据库或技术栈。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-process/00-需求文档.md` | 已按需求 SOP Step 1~17 重建 | 作为架构设计直接需求基线 |
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 识别上游承接来源 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 提炼本仓定位和非职责 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 提炼依赖裁剪和禁止依赖 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | 已完成 | 固定 C-1~C-5 核心闭环 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | 已完成 | 提炼边界规则和禁止行为 |
| `design-calibration/00_req_step_11_data_ownership.md` | 已完成 | 提炼真相、快照、引用和禁止正文边界 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | 已完成 | 提炼验收与一票否决边界 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 识别后续设计待确认项 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 检查需求闭环和漏项 |
| 旧 `projects/L1-process/01-架构设计.md` | 旧 Draft | 只作为问题诊断来源 |

---

## 3. SOP 问题回答

### 3.1 当前架构设计依赖哪些需求结论?

当前架构设计直接依赖新版 `00-需求文档.md` 中已经闭合的以下需求结论:

| 编号 | 需求结论 | 对架构的约束 |
|---|---|---|
| ARB-PROC-001 | `L1-process` 是过程执行真相仓 | 架构必须围绕过程执行事实组织,不能退化为视图、调度器或方法定义仓 |
| ARB-PROC-002 | Process 只拥有 ProcessTemplate runtime index / 运行时过程形态,不拥有 method-library 定义正文 | 架构必须把定义来源和运行时索引分开 |
| ARB-PROC-003 | ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery 是 Process 主体事实 | 架构必须能承载这些事实的生命周期和追溯 |
| ARB-PROC-004 | Project、WorkItem、Iteration、Backlog、ProjectMember truth 不归 Process | 架构不得把 work truth 引入 Process 核心 |
| ARB-PROC-005 | Gate / Policy / decision truth 不归 Process | waiting gate 只能表达等待意图和恢复语境 |
| ARB-PROC-006 | Runtime 执行正文、工具调用、agent loop 和 runtime 微步 checkpoint 不归 Process | Activity feedback 只能作为反馈摘要或引用进入 |
| ARB-PROC-007 | Artifact、Evidence、Baseline、ImplementationPlan 和 Archive Package 正文不归 Process | 只能通过引用或摘要协作 |
| ARB-PROC-008 | 查询、投影、报告、恢复对账和维护任务不得隐式改变业务真相 | 架构必须区分写路径、读路径和维护路径 |
| ARB-PROC-009 | `L0-core` 是唯一编译期依赖;其他 L1/L2/L3/L4 仓不得成为 package dependency | 架构依赖方向必须通过运行期、事件、adapter 或引用边界表达 |
| ARB-PROC-010 | C-1~C-5 核心闭环必须成立 | 架构目标必须覆盖运行时过程形态、实例、节点流控、暂停恢复和可消费追溯 |
| ARB-PROC-011 | 外围增强不阻塞当前核心闭环 | 完整 BPMN、嵌套过程、模板刚度、高级视图和自动化建议不能被误写为当前必达核心范围 |
| ARB-PROC-012 | 旧性能数字只是候选目标 | 架构可保留性能方向,但不能把旧 `200ms / 50ms / 500ms / 30s` 直接写成已验证硬验收 |

### 3.2 这些需求结论里哪些已经稳定?

| 稳定结论 | 判断 |
|---|---|
| 仓定位 | 稳定。`L1-process` 是过程执行真相仓。 |
| 真相边界 | 稳定。Process 只拥有过程执行事实,相邻仓正文禁止入仓。 |
| 核心闭环 | 稳定。C-1~C-5 均有故事、功能、规则、数据和验收承接。 |
| 依赖裁剪 | 稳定。唯一编译期依赖为 `L0-core`;其他仓只能运行期、事件协作、引用或 adapter 协作。 |
| 验收否决项 | 稳定。多真相、正文入仓、边界打穿、恢复分叉和非 core 编译依赖均为否决项。 |

### 3.3 哪些需求结论仍然待确认?

当前没有阻塞架构 Step 2 的需求缺口。下列事项已在需求文档 §15 挂起,属于后续架构、概要、详细、配置、测试或实施阶段的细化问题:

| 待确认事项 | 当前架构处理口径 |
|---|---|
| API / Command / Query / Event 名称和字段形态 | 不在 Step 1 定义;后续详细设计收敛 |
| ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、recovery 的详细状态集 | 不在 Step 1 定义;后续详细设计状态矩阵收敛 |
| checkpoint 的触发点、粒度、外置策略和与 runtime / observability 的边界 | 架构只保留 Instance 级恢复连续性原则 |
| mandatory gate / 强制 gate / 高风险裁剪的具体判断来源 | 架构只保留不得绕过 method-library / governance 正式约束 |
| 完整 BPMN / 嵌套过程 / 模板刚度是否进入版本主线 | 当前作为外围增强,不进入核心架构目标 |
| 旧性能 / 恢复候选指标是否升级为测试目标 | 架构可列为候选 SLO,不得写成已验证硬指标 |
| PostgreSQL、object storage 或其他存储实现是否进入正式基线 | 后续架构技术选型和配置设计再收敛 |

### 3.4 哪些需求会直接影响架构边界?

| 需求 | 影响的架构边界 |
|---|---|
| Process 不拥有 method-library 定义正文 | Definition source 与 runtime index 边界 |
| Process 不拥有 work truth | ProcessInstance / Activity 与 Project / WorkItem / Iteration 边界 |
| waiting gate 不拥有 governance decision truth | Process pause context 与 Governance decision 边界 |
| Activity feedback 不保存 runtime 正文 | Process runtime feedback 与 L2-runtime / member-service 边界 |
| checkpoint / recovery 不替代 reasoning trace 或 archive package | Recovery 与 observability / archive 边界 |
| 查询、投影、维护不得反写真相 | write model、read model、maintenance model 边界 |

### 3.5 哪些需求会直接影响数据所有权?

| 数据类别 | 架构影响 |
|---|---|
| Process 真相 | 架构必须为运行时过程形态、ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery、process timing 和 traceability record 留出主真相承载 |
| 外部快照 | 架构可接收方法定义、项目工作、actor、governance、artifact、runtime、conversation 等摘要,但必须能表达来源和滞后状态 |
| 外部引用 | 架构必须通过 Ref / metadata / trace context 保持相邻仓可追溯连接 |
| 禁止正文 | 架构不得设计任何保存相邻仓正文、runtime 执行正文、conversation 正文、observability 正文或 archive package 正文的主路径 |

### 3.6 哪些需求会直接影响依赖方向或一致性策略?

| 需求 | 影响 |
|---|---|
| `L0-core` 唯一编译期依赖 | 内部层次和 Cargo dependency 必须遵守裁剪规则 |
| 其他仓通过运行期 / 事件协作 / adapter 协作 | 架构需要明确 port、adapter、consumer、publisher 和 snapshot 边界 |
| 重复输入不得产生重复正式事实 | 架构必须支持幂等和冲突识别 |
| 恢复不得产生第二份过程真相 | 架构必须支持 checkpoint chain / recovery continuity |
| 投影可滞后但不得反写真相 | 架构必须区分强一致写模型与最终一致消费模型 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `01-架构设计.md` 文档元信息 | 状态为 Draft,日期为 2026-05-11 | 与当前新版需求基线日期和链路不一致 | Step 16 删除旧文件后重建 |
| 旧 `01-架构设计.md` §2 | 语言栈写为 Python | 与后续实现仓真实技术栈和新版文档链可能冲突 | 不继承旧技术栈结论,后续 Step 10 重新选型 |
| 旧 `01-架构设计.md` §4 | 依赖对象仍含 PostgreSQL / object storage 等实现候选 | 需求层已明确这些不是正式需求依赖 | 后续架构技术选型重新判断 |
| 旧 `01-架构设计.md` | 旧性能数字被写成目标值 | 新版需求只把这些作为候选目标 | 后续作为候选 SLO,不直接写硬验收 |
| 旧文档链 | 缺 `04-配置设计.md` / `07-实施计划.md` 新链路 | 不符合当前项目文档体系 | 正式文档重建时补齐链路 |
| 旧内容 | 容器、技术、能力、边界混写 | 不利于逐 Step 审查 | 架构校准按 SOP 重建中间产物 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构输入 | 旧 `00` / 旧 README / domain README 混合 | 新版 `00-需求文档.md` 为直接基线 | 避免旧口径残留 |
| 技术栈 | 旧文档预设 Python / PostgreSQL | Step 1 不做技术定稿 | 技术选型属于 Step 10 |
| 性能目标 | 旧数字直接写目标值 | 旧数字降为候选目标 | 与新版需求 §13 / §15 一致 |
| 依赖边界 | 旧文档未完整体现唯一编译期依赖 | 明确 `L0-core` 唯一编译期依赖 | 与需求裁剪和验收否决项一致 |
| 风险处理 | 部分不确定项隐含在正文 | 显式列入待确认或后续细化 | 防止后续自行脑补 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接修补旧 `01-架构设计.md` | 快 | 旧口径残留风险高,难以追溯到 Step | 不采用 |
| 方案 B: 按架构 SOP 生成 Step 1~16 中间产物后重建正式文档 | 可追溯,能逐步消除旧口径 | 需要更多步骤 | 采用 |
| 方案 C: 在 Step 1 直接确定技术栈和容器 | 进展看似更快 | 越过 Step 2~Step 10,会把候选项写成结论 | 不采用 |
| 方案 D: 把需求 §15 的待确认项全部视为架构阻塞 | 保守 | 会让架构承担详细设计职责 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否保留旧 Python / PostgreSQL 口径?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 延续旧架构技术假设 | 可能与新版实现链路和依赖裁剪冲突 |
| 方案 B | Step 1 不继承旧技术栈,Step 10 重新选型 | 保持需求到架构的推导关系 |

推荐方案 B。原因是旧技术栈属于历史输入,不是新版需求基线结论。

#### 外围增强是否进入架构硬前提?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完整 BPMN、嵌套过程、模板刚度、高级视图全部作为当前硬目标 | 会扩大当前核心闭环范围 |
| 方案 B | 作为演进和风险线索保留,不阻塞当前核心架构 | 与需求 §15 一致 |

推荐方案 B。原因是当前架构应优先保护 C-1~C-5 核心闭环。

---

## 7. 结构化中间产物

### 7.1 需求基线结论

| 结论编号 | 需求基线结论 | 架构承接方式 |
|---|---|---|
| RB-PROC-001 | `L1-process` 是过程执行真相仓 | 架构围绕 Process truth、read model、maintenance boundary 组织 |
| RB-PROC-002 | Process 不拥有 method-library 定义正文 | 架构区分 definition source 和 runtime index |
| RB-PROC-003 | Process 不拥有 work / governance / artifact / runtime / identity / conversation / workspace / observability / archive 正文或 truth | 架构通过引用、快照、事件和 adapter 协作 |
| RB-PROC-004 | ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery 是主事实 | 架构必须保留这些事实的生命周期与追溯路径 |
| RB-PROC-005 | C-1~C-5 核心闭环必须成立 | 架构目标必须覆盖形成、实例、推进、暂停恢复、消费追溯 |
| RB-PROC-006 | 查询、投影、报告和维护不得反写真相 | 架构必须隔离写路径与读 / 维护路径 |
| RB-PROC-007 | `L0-core` 是唯一编译期依赖 | 架构依赖方向和实现计划必须执行依赖裁剪 |
| RB-PROC-008 | 旧性能数字为候选目标 | 架构可把性能作为质量目标,但不把旧数字定为硬验收 |

### 7.2 架构硬约束结论

| 约束编号 | 硬约束 | 影响章节 |
|---|---|---|
| HC-PROC-001 | 不得接管 method-library / work / governance / artifact / runtime / identity / conversation / workspace / observability / archive truth | §4 职责边界;§8 依赖方向;§9 数据所有权 |
| HC-PROC-002 | 不得保存相邻仓正文、runtime 执行正文、conversation 正文、reasoning trace 正文或 archive package 正文 | §9 数据所有权;§13 横切关注点 |
| HC-PROC-003 | waiting gate 只能表达等待意图,不得成为 governance decision truth | §4 职责边界;§10 关键交互 |
| HC-PROC-004 | Activity / Token / Gateway 只能表达过程节点和流控位置,不得等同 WorkItem 或 runtime step | §6 限界上下文;§9 数据所有权 |
| HC-PROC-005 | checkpoint / recovery 必须保持同一 Process truth 连续,不得生成第二份过程真相 | §9 数据所有权;§10 关键交互;§13 横切关注点 |
| HC-PROC-006 | 唯一编译期上游限定为 `L0-core` | §8 依赖方向 |
| HC-PROC-007 | 投影、查询、报告、对账和恢复维护不得隐式创建、推进、暂停、恢复或完成过程事实 | §7 容器;§9 数据所有权;§13 横切关注点 |

### 7.3 未关闭需求风险结论

| 风险 | 当前状态 | 是否阻塞 Step 2 |
|---|---|---|
| API / Command / Event 形态未定 | 后续详细设计职责 | 否 |
| 状态集和迁移规则未定 | 后续详细设计职责 | 否 |
| checkpoint 机制和存储策略未定 | 后续架构 / 详细 / 配置职责 | 否 |
| mandatory gate / 高风险裁剪具体前置未定 | 后续与 method-library / governance 契约收敛 | 否 |
| 完整 BPMN / 嵌套过程 / 模板刚度版本范围未定 | 外围增强和演进事项 | 否 |
| 旧性能指标是否升级未定 | 后续测试与容量验证 | 否 |
| 存储实现未定 | 后续技术选型和配置设计 | 否 |
| 相邻仓正文进入 Process 或非 core 仓成为编译期依赖 | 后续若发生则一票否决 | 不阻塞 Step 2,但必须作为硬约束 |

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

本文首先承接 `projects/L1-process/00-需求文档.md` 已收稳的需求基线,再向上追溯产品、全局架构、ADR 和相邻仓设计结论。本文不重新定义需求、业务规则、数据归属或验收标准,只把这些结论转译为系统结构、职责边界、依赖方向、数据所有权、一致性策略、技术取舍和演进约束。

旧版 `01-架构设计.md` 中的 Python、PostgreSQL、旧性能硬目标和旧文档链只作为历史输入,不作为新版架构真相源直接继承。
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
| Q-001 | 是否需要在 Step 2 把旧性能数字列入架构候选 SLO | 建议列为候选质量目标,不写成硬验收 |
| Q-002 | 是否需要在 Step 2 明确当前不支持完整 BPMN / 嵌套过程 / 高级模板刚度 | 建议写成架构非目标或演进事项 |
| Q-003 | 是否需要在 Step 10 重新选择技术栈 | 需要。旧 Python 口径不得直接继承 |

---

## 10. 进入下一步条件

- 已明确哪些需求可直接作为架构前提。
- 已明确哪些需求仍然待确认,且这些待确认项不阻塞 Step 2。
- 已明确会影响架构边界、数据所有权、依赖方向和一致性策略的需求结论。
- 已识别旧 `01-架构设计.md` 的残留口径,不会在新版架构中直接继承。

结论:可以进入 Step 2 `明确架构目标与约束`。
