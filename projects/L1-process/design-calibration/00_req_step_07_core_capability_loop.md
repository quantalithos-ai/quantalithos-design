# Step 7. 核心能力闭环

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 7
> 回填章节: `00-需求文档.md` §7 核心能力闭环
> 生成日期: 2026-06-05

---

## 1. 本步目标

从 `L1-process` 存在的必要性出发,收敛这个仓成立所需的过程执行事实核心能力骨架。本步不直接搬旧功能清单,不写接口、事件、函数、表结构、DTO、实现步骤、阶段优先级或用户故事句式。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Process 是过程执行真相仓 |
| `design-calibration/00_req_step_04_goals_non_goals.md` | Step 4 已完成 | 固定 runtime index / Profile、ProcessInstance / Activity / Token、waiting gate / checkpoint / recovery 和相邻仓协作边界目标 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定闭环强前置和相邻仓协作范围 |
| `projects/L1-process/00-需求文档.md` §5~§6 | 旧用例和功能清单 | 作为功能回填线索,不直接作为闭环 |
| `projects/L1-process/02-概要设计.md` §6~§7 | 旧主流程和分层结构 | 提取定义运行时索引、Profile、实例运行、节奏、挂起恢复、投影线索 |
| `product/六域模型.md` §6 | 领域模型上游 | 承接 Process 回答“按什么规矩推进”的定位和三段式线索 |

---

## 3. SOP 问题回答

### 3.1 如果没有这个仓,系统会缺什么不可替代的能力或结构？

如果没有 `L1-process`,平台会缺少统一的过程执行事实结构。项目会退化成任务列表、对话叙事、治理审批、产物证据、runtime 执行记录或 workspace 视图里的局部进度,系统无法稳定回答:

- 某个项目采用的方法定义是否已经形成可执行的过程形态。
- 当前过程实例运行到哪里,哪些过程节点正在进行或等待。
- 为什么过程停住,它是在等待治理决策、执行反馈还是恢复处理。
- 从哪个 Instance 级恢复点继续,以及恢复后如何回到同一个过程事实。
- 相邻仓消费的是哪一份正式过程执行事实。

### 3.2 这个仓成立必须共同具备哪些能力？

`L1-process` 的核心能力闭环不是功能列表,而是一组必须共同成立的过程执行事实能力:

1. 过程定义能够被转成可执行的运行时过程形态。
2. 项目过程实例能够作为正式运行事实成立。
3. 过程节点和流控能够表达当前推进位置。
4. 暂停、等待和恢复能够保持同一过程事实连续。
5. 过程执行事实能够被相邻体系持续消费和追溯。

### 3.3 哪些能力缺一个,这个仓就不算真正成立？

| 能力 | 缺失后果 |
|---|---|
| 运行时过程形态成立 | Process 无法把方法定义转成项目可执行语境,会退回 method-library 定义正文或人工解释 |
| 项目过程实例成立 | 过程没有正式运行主体,Activity、节奏、等待和恢复都没有稳定归属 |
| 节点与流控位置成立 | 系统无法回答当前运行到哪里、哪些节点活跃、下一步为何可推进 |
| 暂停等待恢复连续成立 | waiting gate、checkpoint 和 recovery 会散落成孤立状态,过程停住后无法解释或续跑 |
| 可消费可追溯成立 | work、governance、artifact、runtime、workspace 等会各自解释过程状态,形成多真相 |

### 3.4 哪些能力只是外围增强,而不是闭环核心？

| 外围增强能力 | 为什么不是闭环核心 |
|---|---|
| 高级过程投影视图 / timeline / dashboard | 依赖过程执行事实,但属于展示和聚合增强 |
| 完整 BPMN 形态、复杂网关和嵌套过程 | 对表达力重要,但不决定基本过程执行事实是否成立 |
| 模板刚度分层和高级裁剪策略 | 与 Profile 语义相关,但 ADR-0010 仍为 Proposed,不进入当前核心闭环 |
| 高级容量指标、P95 和大规模恢复 SLO | 属于非功能和规模阶段 |
| 自动调度、自动重试和复杂补偿策略 | 可提升运行效率,但不决定暂停 / 恢复事实是否成立 |
| 完整归档恢复和观测报表 | 重要但属于 archive / observability 协作增强 |

### 3.5 哪些能力根本不属于这个仓？

| 边界外能力 | 归属原因 |
|---|---|
| ProcessTemplateDef / TaskDefinition / Method Content 定义管理 | 属于 `L3-method-library` |
| Project / ProjectMember / WorkItem / Iteration truth | 属于 `L1-work` |
| Gate / Policy / Approval / decision truth | 属于 `L1-governance` |
| Artifact / evidence / baseline 正文 | 属于 `L1-artifact` |
| agent loop、工具调用、执行计划推进和 runtime 微步 checkpoint | 属于 `L2-runtime` / `L2-member-service` |
| GlobalMember、actor lifecycle 和成员状态 | 属于 `L1-identity` |
| conversation fact、可见性和聊天呈现 | 属于 `L1-conversation` 或 L5 产品入口 |
| workspace 聚合视图和 dashboard 状态 | 属于 `L1-workspace` |
| reasoning trace、指标存储、审计总账和归档包正文 | 属于 `L4-observability` / `L4-archive` |

### 3.6 当前已有或预期功能中,哪些是在支撑这些核心能力？

| 旧功能 / 用例线索 | 支撑的核心能力节点 | 处理口径 |
|---|---|---|
| ProcessTemplate 索引 / source sync / drift 检测 | 运行时过程形态成立 | 保留为后续功能线索,但定义真相不归 Process |
| ProcessProfile Tailoring | 运行时过程形态成立 | 保留为裁剪后可执行形态线索,不在本步写字段 |
| Start ProcessInstance | 项目过程实例成立 | 保留为后续故事和功能线索,不在本步写接口 |
| Activity 状态机 / Token / Gateway 推进 | 节点与流控位置成立 | 保留为运行事实线索,后续按能力展开 |
| planning / review / retro timing | 节点与流控位置成立或外围增强 | 基础节奏语境进入闭环,具体节奏动作后移功能和规则 |
| waiting_gate / governance resume | 暂停等待恢复连续成立 | 保留为核心边界线索,决策真相不归 Process |
| Checkpoint / RecoverInstance | 暂停等待恢复连续成立 | 保留为恢复事实线索,性能和实现后移 |
| Activity outputs / artifact references | 可消费可追溯成立 | 后移规则、数据和接口章节展开 |
| timeline / trace / progress projection | 可消费可追溯成立或外围增强 | 基础消费能力进入闭环,高级视图作为外围增强 |
| Nested process / Template rigidity | 外围增强 | 受 Proposed ADR 约束,后续 Step 15 风险确认 |

---

## 4. 核心能力闭环结论

### 4.1 闭环定义

`L1-process` 的核心能力闭环是:方法定义必须先被转成项目可执行的运行时过程形态;运行时过程形态稳定后,项目过程实例才能作为正式运行事实成立;实例成立后,过程节点和流控位置才能表达当前推进状态;推进过程中出现暂停、等待和恢复时,同一过程事实必须保持连续;这些过程执行事实最终必须能被相邻体系持续消费和追溯。只要其中任何一环缺失,Process 仓就会退化成方法定义缓存、任务执行日志、治理等待列表、runtime 调度记录或 workspace 进度投影。

### 4.2 核心能力闭环图

```text
运行时过程形态能够从方法定义中成立
  -> 项目过程实例能够作为正式运行事实成立
  -> 过程节点和流控位置能够表达当前推进状态
  -> 暂停等待恢复能够保持同一过程事实连续
  -> 过程执行事实能够被持续消费和追溯
```

本图只表达能力成立的逻辑依赖关系,不表达运行时调用顺序、接口时序、事件传播顺序、开发实施步骤或对象字段。

### 4.3 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 运行时过程形态成立;项目过程实例成立;过程节点和流控位置成立;暂停等待恢复连续成立;过程执行事实可消费可追溯 |
| 外围增强能力 | 高级过程投影视图 / timeline / dashboard;完整 BPMN 形态、复杂网关和嵌套过程;模板刚度分层和高级裁剪策略;高级容量指标和恢复 SLO;自动调度、自动重试和复杂补偿;完整归档恢复和观测报表 |
| 边界外能力 | 方法定义管理;项目工作事实;治理决策;产物正文;runtime 执行推进;成员生命周期;对话事实;workspace 聚合视图;observability / archive 正文 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §5 | 以核心用例和用户故事开头 | 用户故事应在 Step 8,不能替代核心能力闭环 | Step 7 先定义闭环,Step 8 再写故事 |
| `00-需求文档.md` §6 | 功能清单按 Template、Profile、Instance、Activity、Gateway、Checkpoint 等对象 / 功能展开 | 功能清单不能直接作为闭环 | 只作为功能回填映射线索 |
| `00-需求文档.md` §6.3 | 功能依赖图围绕 Template -> Profile -> Instance -> Activity 展开 | 可作为流程线索,但更像功能 / 对象依赖图,不符合能力闭环图规范 | 重新画能力成立图 |
| `02-概要设计.md` §6.5~§6.6 | 主流程包含 template sync、instance start、activity/token、waiting_gate、checkpoint | 结构有价值,但表达运行时流程和协作方向 | 转译为需求层能力节点,不继承时序 |
| 旧文档整体 | 将 BPMN、Temporal、LangGraph、P95、恢复时间等并列为核心内容 | 混合标准 / 实现倾向 / 非功能指标 | 本步只保留能力成立条件,其余后移 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把旧 F-001~F-013 功能清单当闭环 | 快,覆盖面多 | 是功能列表,不是能力成立结构 | 不采用 |
| 方案 B: 以过程执行事实成立过程定义闭环 | 对齐仓存在必要性,能约束后续故事和功能 | 需要后续 Step 9 再细化功能 | 采用 |
| 方案 C: 以 Template -> Profile -> Instance -> Activity -> Checkpoint 对象链定义闭环 | 贴近旧文档 | 仍偏对象 / 流程链,且容易把方法定义和实现细节带入 | 不采用 |
| 方案 D: 以跨仓事件协作定义闭环 | 能体现依赖关系 | 会把事件链和依赖链误写成能力闭环 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把完整 BPMN / 嵌套过程放入核心闭环？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 放入核心闭环 | 闭环会偏向实现模型和高级表达力 |
| 方案 B | 基础节点与流控位置进入闭环,完整 BPMN / 嵌套过程作为外围增强 | 保护过程执行事实边界 |

推荐方案 B。原因是 Process 必须表达当前推进位置,但不需要在需求核心闭环中确认完整 BPMN 或 Proposed ADR-0011。

#### 是否把 checkpoint 写成核心闭环图的独立节点？

| 方案 | 内容 | 影响 |
|---|---|
| 方案 A | 写成独立节点 | 图会偏向具体恢复机制和规则 |
| 方案 B | 放入“暂停等待恢复能够保持同一过程事实连续”节点 | 保持闭环图能力层级干净 |

推荐方案 B。原因是 checkpoint 是恢复连续性的关键线索,但在 Step 7 不直接写机制。

#### 是否把 process projection / dashboard 放入核心闭环？

| 方案 | 内容 | 影响 |
|---|---|
| 方案 A | 放入核心闭环 | 闭环会偏向 UI / workspace 展示 |
| 方案 B | 基础消费与追溯进入闭环,高级投影视图作为外围增强 | 保留可消费性,但不越界到 workspace |

推荐方案 B。原因是 Process 事实必须可被消费和追溯,但 dashboard / timeline 形态不是本仓成立的必要条件。

---

## 7. 结构化中间产物

### 7.1 仓存在必要性结论

`L1-process` 不可替代的能力是统一过程执行事实。没有它,项目会散落为方法定义、工作项、治理审批、产物证据、runtime 执行记录和视图投影中的局部进度,平台无法稳定表达运行时过程形态、项目过程实例、过程节点与流控位置、暂停等待恢复连续性和跨仓可追溯事实。

### 7.2 核心能力闭环结论

| 节点 | 能力成立描述 |
|---|---|
| C-1 | 运行时过程形态能够从方法定义中成立 |
| C-2 | 项目过程实例能够作为正式运行事实成立 |
| C-3 | 过程节点和流控位置能够表达当前推进状态 |
| C-4 | 暂停等待恢复能够保持同一过程事实连续 |
| C-5 | 过程执行事实能够被持续消费和追溯 |

### 7.3 外围增强能力结论

| 能力 | 处理口径 |
|---|---|
| 高级过程投影视图 / timeline / dashboard | 外围增强,后续由 workspace / conversation / 产品入口消费 Process 事实 |
| 完整 BPMN 形态、复杂网关和嵌套过程 | 表达力增强,后续设计阶段和 ADR-0011 再确认 |
| 模板刚度分层和高级裁剪策略 | 后续与 ADR-0010、method-library 和规则边界一起展开 |
| 高级容量指标、P95 和恢复 SLO | 后移 Step 13 非功能需求 |
| 自动调度、自动重试和复杂补偿 | 后续规则或功能增强 |
| 完整归档恢复和观测报表 | 后续与 archive / observability 协作展开 |

### 7.4 边界外能力结论

| 能力 | 归属 |
|---|---|
| ProcessTemplateDef / TaskDefinition / Method Content 定义管理 | `L3-method-library` |
| Project / ProjectMember / WorkItem / Iteration truth | `L1-work` |
| Gate / Policy / Approval / decision truth | `L1-governance` |
| Artifact / evidence / baseline 正文 | `L1-artifact` |
| agent loop、工具调用、执行计划推进和 runtime 微步 checkpoint | `L2-runtime` / `L2-member-service` |
| GlobalMember、actor lifecycle 和成员状态 | `L1-identity` |
| conversation fact、可见性和聊天呈现 | `L1-conversation` / L5 产品入口 |
| workspace 聚合视图和 dashboard 状态 | `L1-workspace` |
| reasoning trace、指标存储、审计总账和归档包正文 | `L4-observability` / `L4-archive` |

### 7.5 功能回填映射结论

| 旧功能 / 能力线索 | 映射节点 | 后续处理 |
|---|---|---|
| ProcessTemplate 索引 / source sync / drift 检测 | C-1 | Step 9 功能需求、Step 10 规则、Step 12 依赖 |
| ProcessProfile Tailoring | C-1 | Step 9 功能需求、Step 10 规则、Step 11 数据归属 |
| Start ProcessInstance | C-2 | Step 8 用户故事、Step 9 功能需求、Step 14 验收 |
| Activity 状态机 / Token / Gateway 推进 | C-3 | Step 9 功能需求、Step 10 规则 |
| planning / review / retro timing | C-3 | Step 9 功能需求、Step 10 规则 |
| waiting_gate / governance resume | C-4 | Step 9 功能需求、Step 10 规则、Step 12 依赖 |
| Checkpoint / RecoverInstance | C-4 | Step 9 功能需求、Step 10 规则、Step 13 非功能 |
| Activity outputs / artifact references | C-5 | Step 10 规则、Step 11 数据归属、Step 12 接口与依赖 |
| timeline / trace / progress projection | C-5 或外围增强 | 基础消费能力进入核心闭环,高级视图后移外围增强 |
| Nested process / Template rigidity | 外围增强 | Step 15 风险与待确认事项 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §7。

````md
## 7. 核心能力闭环

> 校准来源:
> - `design-calibration/00_req_step_07_core_capability_loop.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“核心能力闭环结论”“能力层级划分表”和“功能回填映射结论”小节,了解本章如何从仓存在必要性而不是旧功能清单中收敛核心闭环。

`L1-process` 的核心能力闭环是:方法定义必须先被转成项目可执行的运行时过程形态;运行时过程形态稳定后,项目过程实例才能作为正式运行事实成立;实例成立后,过程节点和流控位置才能表达当前推进状态;推进过程中出现暂停、等待和恢复时,同一过程事实必须保持连续;这些过程执行事实最终必须能被相邻体系持续消费和追溯。只要其中任何一环缺失,Process 仓就会退化成方法定义缓存、任务执行日志、治理等待列表、runtime 调度记录或 workspace 进度投影。

```text
运行时过程形态能够从方法定义中成立
  -> 项目过程实例能够作为正式运行事实成立
  -> 过程节点和流控位置能够表达当前推进状态
  -> 暂停等待恢复能够保持同一过程事实连续
  -> 过程执行事实能够被持续消费和追溯
```

本图只表达能力成立的逻辑依赖关系,不表达运行时调用顺序、接口时序、事件传播顺序、开发实施步骤或对象字段。

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 运行时过程形态成立;项目过程实例成立;过程节点和流控位置成立;暂停等待恢复连续成立;过程执行事实可消费可追溯 |
| 外围增强能力 | 高级过程投影视图 / timeline / dashboard;完整 BPMN 形态、复杂网关和嵌套过程;模板刚度分层和高级裁剪策略;高级容量指标和恢复 SLO;自动调度、自动重试和复杂补偿;完整归档恢复和观测报表 |
| 边界外能力 | 方法定义管理;项目工作事实;治理决策;产物正文;runtime 执行推进;成员生命周期;对话事实;workspace 聚合视图;observability / archive 正文 |
````

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把完整 BPMN / 嵌套过程放入核心闭环 | 放入核心闭环 | 基础节点与流控位置进入闭环,完整 BPMN / 嵌套过程作为外围增强 | 推荐 B。原因是核心闭环应表达过程执行事实成立条件,不提前确认完整 BPMN 或 ADR-0011 |
| Q-002 | 是否把 checkpoint 写成核心闭环图的独立节点 | 写成独立节点 | 放入“暂停等待恢复能够保持同一过程事实连续”节点 | 推荐 B。原因是 checkpoint 是恢复连续性的关键线索,但在 Step 7 不直接写机制 |
| Q-003 | 是否把 process projection / dashboard 放入核心闭环 | 放入核心闭环 | 基础消费与追溯进入闭环,高级投影视图作为外围增强 | 推荐 B。原因是 dashboard / timeline 形态不是本仓成立的必要条件 |

当前建议:接受上述推荐后进入 Step 8。

---

## 10. 进入下一步条件

- 已说明 `L1-process` 的仓存在必要性。
- 已收敛 5 个核心闭环能力节点。
- 已区分核心闭环、外围增强和边界外能力。
- 已避免将功能清单、接口链、事件链、对象字段或实现步骤直接当成闭环。
- 已能为后续用户故事、功能需求和验收标准提供结构锚点。
