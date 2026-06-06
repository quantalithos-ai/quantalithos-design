# Step 14. 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 回填章节: `01-架构设计.md` §15 风险与待确认事项
> 生成日期: 2026-06-05

---

## 1. 本步目标

显式收纳 `L1-process` 当前尚未关闭的架构风险和待确认问题,说明它们分别影响什么、当前如何约束或挂起,以及是否阻塞后续主线推进。本步不新增架构方案,不补写详细设计,不把普通 TODO、实施任务、功能愿望或未来优化项包装成风险。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求层未关闭风险和一票否决项 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接不可变约束、候选质量目标和当前取舍 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接职责红线和易混淆边界 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | Step 7 已完成 | 承接非 core sibling 编译期依赖风险 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | Step 8 已完成 | 承接正文入仓、快照成真相和 recovery 分叉风险 |
| `design-calibration/01_arch_step_10_technology_choices.md` | Step 10 已完成 | 承接产品级技术栈、可靠传播和 evidence 待确认 |
| `design-calibration/01_arch_step_12_cross_cutting_concerns.md` | Step 12 已完成 | 承接横切约束的待确认细化项 |
| `design-calibration/01_arch_step_13_evolution_path.md` | Step 13 已完成 | 承接可接受债务、不可接受债务和触发条件 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 承接需求层风险和后续设计待确认事项 |

---

## 3. SOP 问题回答

### 3.1 当前还有哪些尚未关闭的架构风险?

当前尚未关闭的正式风险集中在后续概要、详细、配置、测试和实现过程中可能重新打穿架构边界:

| 风险 | 当前判断 |
|---|---|
| Runtime Process Shape 与 method-library definition 正文在后续设计中再次混写 | 会破坏 Process / method-library 边界。 |
| Activity / Token / Gateway 被写成 WorkItem / Iteration / runtime step | 会破坏 Process / Work / Runtime 边界。 |
| waiting gate 被写成 governance Gate / Policy / decision truth | 会破坏 Process / Governance 边界。 |
| checkpoint / recovery 被写成 runtime checkpoint、reasoning trace 或 archive package 正文 | 会破坏 Instance 级恢复连续性和正文边界。 |
| 外部正文通过 snapshot、ref、evidence、report 或 maintenance 进入 Process | 会破坏数据所有权和一票否决边界。 |
| query、projection、report、reconciliation 或 recovery maintenance 反写真相 | 会破坏写 / 读 / 维护边界。 |
| 非 `L0-core` sibling repo 进入编译期依赖 | 会破坏全局依赖裁剪和 L1 真相域平权。 |
| 旧性能数字被误硬化为架构硬指标 | 会导致未验证指标反向约束实现和验收。 |
| 完整 BPMN、嵌套过程、模板刚度、高级视图或自动化建议误入当前主线 | 会扩大当前阶段范围并冲淡核心闭环。 |
| 后续 Agent 因 API、状态机、存储或 schema 未定而自行补真相源 | 会在正式详细设计前形成隐含第二真相。 |

### 3.2 这些风险会影响哪一层架构结构?

| 风险类型 | 影响范围 |
|---|---|
| 定义 / runtime index 混写 | 职责边界、数据所有权、依赖倒置、技术机制、验收否决 |
| Activity / Work / Runtime 混写 | 职责边界、限界上下文、数据归属、关键交互、演进路线 |
| Governance decision 混写 | 系统上下文、关键交互、一致性策略、横切安全、治理联动演进 |
| checkpoint / recovery 混写 | 数据一致性、韧性 / 恢复、traceability、handoff、演进路线 |
| 外部正文入仓 | 数据所有权、外部快照 / 引用、审计与可追溯、配置变更控制 |
| 派生面反写 | read model / projection、后台维护、查询消费、交互方式 |
| 编译期依赖越界 | 依赖方向、技术选型、方案取舍、后续实施边界 |
| 伪量化和外围增强误入核心 | 架构目标、技术选型、演进路线、测试计划和验收标准 |

### 3.3 当前还有哪些待确认事项?

当前待确认事项不是架构主线缺口,而是进入后续设计时必须正式闭合的细化问题:

1. 具体 API / Command / Query / Event / Job 名称和字段形态。
2. ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery 的详细状态集和迁移规则。
3. checkpoint / recovery 的触发点、粒度、外置策略、evidence schema 和存储归属。
4. projection、handoff、event、snapshot refresh 的可靠传播、重建和失败可见性机制。
5. pending / failed / retryable / stale / unresolved / invalid 等 marker 的正式 schema。
6. Product / language / state store / bus / object storage 等产品级技术选择。
7. 完整 BPMN、复杂网关、嵌套过程、模板刚度分层是否由真实结构压力触发。
8. 旧性能候选指标是否由测试数据硬化为正式 SLO。
9. 配置项清单、默认值、变更审批方式和平台级安全制度承接边界。

### 3.4 哪些待确认项会影响前文结论是否成立?

| 待确认类型 | 对前文结论的影响 |
|---|---|
| API / Event / Job surface | 不影响架构能力边界;影响详细设计和测试方案。 |
| 状态机和迁移规则 | 不影响显式变化和恢复连续性原则;影响对象契约和状态矩阵。 |
| checkpoint / evidence 细节 | 不影响 recovery 不分叉原则;影响存储、追溯和测试证据。 |
| reliable propagation / handoff 机制 | 不影响下游不阻塞主真相原则;影响最终一致收敛质量。 |
| marker schema | 不影响 stale / unresolved 等口径;影响 public contract 和查询结果可落码性。 |
| 产品级技术选择 | 不影响架构机制;影响配置设计和实施计划。 |
| 完整 BPMN / 复杂表达力 | 不影响当前核心闭环;影响后续演进阶段。 |
| 性能候选指标 | 不影响当前主线成立;影响测试计划和容量目标。 |
| 配置和安全制度 | 不影响本仓边界约束;影响配置设计、平台安全和运维治理。 |

### 3.5 哪些风险是当前阶段可接受的,哪些会阻塞后续推进?

| 分类 | 条目 | 当前判断 |
|---|---|---|
| 当前可接受风险 | API / 状态机 / checkpoint / evidence / 存储 / marker /产品级技术栈未细化 | 不阻塞 Step 15 / Step 16,但必须在后续对应文档正式闭合。 |
| 当前可接受风险 | 旧性能数字未硬化 | 不阻塞架构整理,保留为测试和容量候选。 |
| 当前可接受风险 | 完整 BPMN / 嵌套过程 / 模板刚度 / 高级视图暂未进入主线 | 不阻塞当前主线成立,按演进路线触发。 |
| 有条件阻塞 | marker、evidence、handoff 或 recovery schema 在详细设计阶段仍无真相源 | 阻塞对应详细设计或实现 boundary,不能由 Agent 自行补字段。 |
| 有条件阻塞 | 产品级技术选择试图推翻依赖、数据、交互或恢复边界 | 阻塞配置 / 实施计划,必须回到架构取舍。 |
| 阻塞 | 相邻仓正文入仓、相邻仓 truth 被 Process 接管、派生面反写真相、recovery 产生第二份真相、非 core 仓成为编译期依赖 | 直接阻塞并要求回退修正。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 需求 Step 15 | 已有需求层风险和待确认事项 | 需转成架构层影响范围、阻塞性和挂起口径 | 作为本步主要输入 |
| 前序架构 Step Q 表 | 每步有待确认项 | 有些已被后续 Step 收敛,不能重复制造不确定 | 只保留仍影响后续架构 / 设计成立的问题 |
| Step 13 | 已列可接受债务和不可接受债务 | 需要转成风险 / 待确认拆分 | 本步拆成风险表和待确认事项表 |
| 旧 `01-架构设计.md` | 技术栈、流程引擎、存储等旧假设 | 若直接继承会污染新架构 | 作为风险处理,不回填为定论 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 分散在需求风险、待确认项和演进债务中 | 汇总为架构风险表 | 对齐架构规范 4.15 |
| 待确认事项 | 每步 Q 表重复存在 | 只保留仍需后续确认且影响主线判断的问题 | 避免重开已收敛结论 |
| 阻塞性 | 隐含在不可接受债务和一票否决中 | 明确不阻塞 / 有条件阻塞 / 阻塞 | 便于后续设计审查 |
| 当前处理口径 | 容易写解决方案 | 只写保守约束、暂存或挂起 | 不越过本步职责 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 汇总全部前序 Q 表 | 信息完整 | 大量问题已被后续 Step 吸收,会制造伪不确定 | 不采用 |
| 方案 B: 拆分正式风险和待确认事项 | 高信号,可支撑后续审查 | 需要判断已收敛项和未闭合项 | 采用 |
| 方案 C: 把 API / 状态机 / schema 未定全部写成阻塞风险 | 保守 | 会让架构文档承担详细设计职责 | 不采用 |
| 方案 D: 不保留任何待确认事项 | 文档干净 | 会诱导后续 Agent 自行脑补 | 不采用 |

### 6.1 待确认问题的方案选择

#### API / 状态机 / schema 未定是否阻塞正式架构文档整理?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 阻塞 Step 16 | 架构文档会被迫下沉详细设计 |
| 方案 B | 不阻塞 Step 16,但阻塞对应详细设计 / 实现 boundary 自行补字段 | 保持文档层级正确 |

推荐方案 B。

#### 完整 BPMN / 嵌套过程是否写成当前风险?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 未支持完整 BPMN 本身是风险 | 会把外围增强误写成当前缺陷 |
| 方案 B | 误升级为当前核心主线才是风险 | 保持当前主线范围稳定 |

推荐方案 B。

#### 产品级技术栈未定是否写成架构风险?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成正式架构风险 | 会让架构层承担产品横评 |
| 方案 B | 写成待确认事项,并约束不得推翻架构边界 | 对齐 Step 10 / Step 13 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| Runtime Process Shape 与 method-library definition 正文混写风险 | 职责边界;数据所有权;依赖倒置;技术机制 | 当前只允许 Process 拥有 runtime index / process shape 语境,不拥有 definition 正文 | 阻塞 | 一旦发生会直接打穿 method-library / Process 边界。 |
| Activity / Token / Gateway 被写成 WorkItem / Iteration / runtime step 风险 | 职责边界;统一语言;数据归属;关键交互 | 当前只允许 Activity / Token / Gateway 表达过程节点、承担语境和流控位置 | 阻塞 | 一旦发生会让 Process 接管 Work 或 Runtime truth。 |
| waiting gate 被写成 governance decision truth 风险 | 系统上下文;关键交互;一致性;横切安全 | 当前只允许 waiting gate 表达等待意图和恢复语境,decision truth 必须来自 Governance | 阻塞 | 一旦发生会让 Process 接管治理裁决。 |
| checkpoint / recovery 与 runtime checkpoint、reasoning trace 或 archive package 正文混写风险 | 数据一致性;韧性 / 恢复;traceability;handoff | 当前只固定 Instance 级 recovery 连续性,不保存 runtime / trace / archive 正文 | 阻塞 | 一旦混写会破坏恢复连续性和正文边界。 |
| 外部正文通过 snapshot、ref、evidence、report 或 maintenance 入仓风险 | 数据所有权;外部镜像;审计追溯;配置控制 | 当前所有外部材料只能以 ref / snapshot / marker 方式承接,正文禁止入仓 | 阻塞 | 该风险命中数据归属一票否决。 |
| 派生消费和维护路径反写真相风险 | read model / projection;report;reconciliation;后台维护 | 当前查询、投影、报告、对账和维护只能消费、解释或修复派生结果 | 阻塞 | 一旦发生会破坏写 / 读 / 维护边界。 |
| 非 `L0-core` sibling repo 成为编译期依赖风险 | 依赖方向;跨仓协作;技术选型;实施边界 | 当前只允许非 core sibling 通过运行期接缝、事件、ref、snapshot 或 handoff 协作 | 阻塞 | 一旦发生会破坏全局依赖裁剪。 |
| 旧性能数字被误硬化风险 | 架构目标;横切性能;测试计划;验收标准 | 当前旧 P95、checkpoint 和 recovery 数字只作为候选目标暂存 | 不阻塞 | 风险已被识别,当前可带约束进入后续测试验证。 |
| 外围增强误入当前核心主线风险 | 架构目标;技术选型;方案取舍;演进路线 | 当前完整 BPMN、嵌套过程、模板刚度、高级视图和自动化建议只作为演进项 | 不阻塞 | 风险在于误升级,不是增强能力本身。 |
| 后续 Agent 自行补 API / 状态机 / 存储 / schema 真相源风险 | 详细设计;配置设计;测试方案;实现 boundary | 当前明确这些内容后移对应文档,不得在实现中自行补字段或选边 | 有条件阻塞 | 若详细设计仍未闭合就进入实现,该风险会阻塞落码。 |
| 产品级技术选择推翻架构边界风险 | 技术选型;配置设计;实施计划 | 当前产品选择后移,但不得推翻依赖、数据、交互、恢复和横切约束 | 有条件阻塞 | 若产品能力反向定义 Process truth,必须回到架构取舍。 |

### 7.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| API / Command / Query / Event / Job 名称和字段形态 | 详细设计;测试方案;实现 boundary | 缺正式协议和字段级契约 | 当前只保留能力级边界,不回填为架构定论 | 不影响架构主线成立,但影响后续可落码性。 |
| ProcessProfile / ProcessInstance / Activity / Token / Gateway / waiting gate / recovery 状态集和迁移规则 | 详细对象契约;状态矩阵;测试方案 | 缺字段级状态和转换表 | 当前只固定显式变化、主真相连续和一票否决边界 | 不影响架构原则,但不能由实现临时补状态。 |
| checkpoint / recovery 触发点、粒度、外置策略、evidence schema 和存储归属 | 详细设计;配置设计;测试证据;archive / observability handoff | 缺具体机制和证据承载 | 当前只固定 recovery 连续性、可追溯和正文禁止 | 该事项进入详细设计前必须闭合。 |
| projection / handoff / event / snapshot refresh 的可靠传播、重建和失败可见性机制 | 详细设计;配置设计;横切可观测;测试方案 | 缺可靠传播机制和失败状态细化 | 当前只保留 pending / failed / retryable / stale / unresolved 等架构口径 | 该事项影响最终一致收敛质量,不影响主真相边界。 |
| pending / failed / retryable / stale / unresolved / invalid marker 的正式 schema | public contract;query result;test fixtures | 缺字段级 schema 和归属 | 当前只保留语义口径,不得在实现中临时造字段 | 该事项是后续 1:1 落码的高风险待确认项。 |
| 产品级语言、state store、bus、object storage 和运行部署选择 | 概要设计;配置设计;实施计划 | 缺产品级输入和运行约束 | 当前只固定承载角色和架构机制 | 产品选择不得推翻本架构边界。 |
| 完整 BPMN / 复杂网关 / 嵌套过程 / 模板刚度分层是否进入后续主线 | 演进路线;ADR;详细设计范围 | 缺真实表达力压力和方法库协作前提 | 当前作为演进触发项挂起 | 不能作为当前主线完成前置。 |
| 旧性能候选指标是否硬化为正式 SLO | 测试计划;容量评估;横切性能 | 缺测试数据和容量基线 | 当前作为候选目标挂起 | 不能作为当前架构硬指标。 |
| 配置项清单、默认值、变更审批和平台安全制度承接方式 | 配置设计;实施计划;平台安全 | 缺配置治理和平台协作结论 | 当前只保留配置不得绕过主线的架构约束 | 不由架构文档直接定义制度细节。 |

### 7.3 当前处理口径说明

当前风险和待确认事项的处理原则是:已经明确会打穿 Process truth、依赖方向、数据归属、一致性或关键交互的事项进入风险表;尚未形成定论、但会影响后续详细设计或实现可落码性的事项进入待确认事项表。API、状态机、schema、存储和产品选择不阻塞正式架构文档整理,但会阻塞后续对应 detailed boundary 的实现,不能由 Agent 自行补设计。外围增强能力本身不是风险,误升级为当前核心主线才是风险。任何不确定项都不得回填成前文确定结论。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/01_arch_step_14_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“风险表”“待确认事项表”和“当前处理口径说明”小节,了解本章如何区分正式风险、挂起事项和阻塞条件。

正式章节应摘录:

- `design-calibration/01_arch_step_14_risks_open_questions.md` §7.1 风险表。
- `design-calibration/01_arch_step_14_risks_open_questions.md` §7.2 待确认事项表。
- `design-calibration/01_arch_step_14_risks_open_questions.md` §7.3 当前处理口径说明。
```

---

## 9. 进入下一步条件

- 已明确拆分正式风险与待确认事项。
- 已写清每项风险的影响范围、当前处理口径和阻塞性。
- 已写清每项待确认事项的影响范围、缺失确认和当前挂起口径。
- 未把普通 TODO、功能愿望、实施任务或已收敛结论重新包装成风险。
- 未为了形成完整叙事而脑补确定性架构结论。

结论:可以进入 Step 15 `ADR 与需求追溯`。
