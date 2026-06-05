# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-06-02

---

## 1. 本步目标

先校准 `L1-work` 需求文档的语义来源，明确它承接哪些上游结论，而不是重新定义共享契约、事件总线、SDK 接入、GlobalMember、conversation truth、method definition、process 执行、governance 决策或 artifact 正文。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-work/README.md` | 旧版仓定位材料 | 作为旧口径诊断输入，识别仍可保留的使命、依赖和开放问题 |
| `projects/L1-work/00-需求文档.md` | 旧版需求文档 | 作为旧需求诊断输入，不作为新版正式基线 |
| `projects/L1-work/01-架构设计.md` ~ `06-验收标准.md` | 旧版下游文档 | 作为后续一致性诊断输入，本步只判断需求来源关系 |
| `domain/work/README.md` | 旧工作域详细设计 | 作为 Project、ProjectMember、Backlog、WorkItem、Iteration、不变量和历史边界线索 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游，承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为事件协作上游，承接发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 L5/L6 与外部调用方接入 work 能力的默认封装边界输入 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 GlobalMember、actor、角色和成员生命周期来源 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为对话事实、conversation space、trace / handoff 和授权查询来源 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 task / work product / process template / view profile 等定义来源 |
| `product/最终目的.md` | 产品叙事上游 | 承接“工作对象是软件项目”和人机协作需要项目承载的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Work 是六域之一、Project 是 SoI、ProjectMember / Backlog / WorkItem / Iteration 的领域位置 |
| `architecture/仓库拆分方案.md` | 全局分层上游 | 承接 `quantalithos-work` 在 L1 六域服务层的位置和相邻仓关系 |
| `architecture/架构设计.md` | 全局架构上游 | 承接 Work 与 identity、conversation、process、governance、artifact、workspace 等仓的架构协作位置 |
| `architecture/adr/0004-global-vs-project-member.md` | 已有 ADR | 承接 GlobalMember 与 ProjectMember 的双层 Member 边界 |
| `architecture/adr/0008-activity-completion-policy.md` | 已有 ADR | 承接 WorkItem 完成与 Process Activity 完成的关系口径 |
| `architecture/adr/0009-viewprofile-in-method-library.md` | 已有 ADR | 承接 ViewProfile / 方法定义归属 method-library 的边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接总依赖关系，并在后续 Step 6 / Step 12 裁剪出 `L1-work` 自己的部分 |

---

## 3. SOP 问题回答

### 3.1 本文承接哪些上游文档？

本文直接承接六类上游：

1. 已稳定基础仓结论：`L0-core`、`L0-bus`、`L0-sdk` 的 `00`~`07`。
2. 已稳定相邻领域结论：`L1-identity`、`L1-conversation`、`L3-method-library` 的 `00`~`07`。
3. 全局产品与架构结论：`product/最终目的.md`、`product/六域模型.md`、`architecture/仓库拆分方案.md`、`architecture/架构设计.md`。
4. 已有边界 ADR：ADR-0004、ADR-0008、ADR-0009。
5. 历史工作域草案：`domain/work/README.md`、旧 `projects/L1-work/README.md`、旧 `00-需求文档.md`。
6. 全局依赖基线：`standards/document/全局项目依赖关系与裁剪规则.md`。

其中 `L0-core`、`L0-bus`、`L0-sdk` 提供基础协作能力；`L1-identity`、`L1-conversation`、`L3-method-library` 提供 `L1-work` 最容易混淆的相邻真相来源；旧 work 文档提供历史领域线索，但不直接作为新版需求权威。

### 3.2 承接的是上游哪一部分主题？

本仓承接的主题是：在六域模型中把“软件项目是工作对象”落为项目工作事实域，负责把 Project、ProjectMember、Backlog、WorkItem、Iteration、ImplementationPlan 等项目执行事实收束为可被 process、governance、artifact、workspace、conversation、runtime 和产品入口消费的需求基线。

具体承接关系如下：

| 上游主题 | `L1-work` 承接方式 |
|---|---|
| `product/最终目的.md` 的软件项目产品叙事 | 转译为用户与 AI member 围绕项目推进软件交付的需求来源 |
| `product/六域模型.md` 的 Work 域 | 转译为 Project、ProjectMember、Backlog、WorkItem、Iteration 等工作事实的仓级需求来源 |
| `L0-core` 的共享契约 | 使用统一 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 口径 |
| `L0-bus` 的事件语义 | 通过事件发布和消费与 identity、conversation、process、governance、artifact、workspace 等仓协作 |
| `L0-sdk` 的 client 封装边界 | 面向 L5/L6 和外部调用方时优先通过 SDK 暴露 work 能力 |
| `L1-identity` 的成员真相 | Work 只引用 GlobalMember / actor，并拥有 ProjectMember 项目内分配事实 |
| `L1-conversation` 的对话真相 | Work 只引用或显化工作相关 conversation context，不拥有对话正文和参与可见性真相 |
| `L3-method-library` 的方法定义 | Work 只引用 task、work product、process template、view profile 等定义，并记录项目执行事实 |
| ADR-0004 / ADR-0008 / ADR-0009 | 分别承接双层 Member、WorkItem 与 Activity 完成关系、ViewProfile 归属边界 |
| `domain/work/README.md` 的旧详细设计 | 作为五类聚合、不变量、状态和历史边界线索，后续逐步裁剪 |

### 3.3 本文为什么不是重新定义该主题？

因为 `L1-work` 的主题不是重新定义“项目协作体系是什么”，也不是重新定义成员、对话、方法资产、流程、治理、产物或事件基础设施。它只把已经成立的产品、架构、ADR 和已完成子项目结论，收束为 work 仓的外部可见需求边界。

本文不得重新定义：

- `L0-core` 的 ID、Error、TraceContext、CloudEvents、metadata 和 evidence。
- `L0-bus` 的 publish / subscribe / ack / retry / dead-letter / replay 语义。
- `L0-sdk` 的 client facade 和三语言接入口径。
- `L1-identity` 的 GlobalMember、Actor、Role 和成员生命周期真相。
- `L1-conversation` 的 conversation space、participant scope、conversation fact、trace / handoff 和授权查询真相。
- `L3-method-library` 的 RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef 和 ViewProfile 定义真相。
- `L1-process` 的 Activity / ProcessInstance 执行流。
- `L1-governance` 的 Gate / Policy 决策真相。
- `L1-artifact` 的 Artifact 正文、evidence 正文或 baseline 归属。

### 3.4 本文在当前仓里承担什么细化作用？

本文承担 `L1-work` 的仓级需求基线作用。它需要回答：

- Work 仓作为项目工作事实域要做什么。
- Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、ImplementationPlan 等需求概念如何在项目执行事实层收束。
- 它与 identity、conversation、method-library、process、governance、artifact、workspace、runtime、member-service 的边界如何避免混写。
- 哪些旧版事实可以保留，哪些旧版假设需要后移或重新裁剪。
- 后续架构、概要、详细、配置、测试、验收、实施计划应围绕哪些需求结论展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 文档头部 | 写“严格遵循 13 节结构”，下游为 `04-实施计划.md` | 最新主链是 `00`~`07`，且 `04` 应为配置设计、`07` 才是实施计划 | Step 17 重建正式文档时统一改为新版主链 |
| 文档头部 | 前置文档只列 `product/最终目的.md`、`product/六域模型.md`、`domain/work/README.md` 和 ADR | 漏掉已完成的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L3-method-library` | 正式 §1 补充稳定上游和相邻真相来源 |
| §1 | 标题为“与 `product/` 的关系声明” | 来源过窄，无法表达跨仓稳定结论和旧文档的降级关系 | 正式 §1 改为“与上游文档的关系声明” |
| §2 | 使用 `10w 项目 x 50 WorkItem` 等旧量化 | 可能有参考价值，但 Step 1 不确认量化目标 | 后续 Step 3 / Step 13 再判断是否保留 |
| §3 | 目标直接写 Project lifecycle、DAG、done 必有 approved Artifact、性能指标 | 这些是候选事实，但已进入目标、规则、数据和非功能层 | 后续 Step 4、Step 10、Step 13 再裁剪 |
| §4 | 角色权限矩阵混合 Owner、ProjectMember、Governance、Process、Artifact | 角色线索有价值，但使用方与依赖应后移到 Step 6 | Step 5 / Step 6 分开收敛 |
| §6 | 功能清单包含 Project CRUD、process 事件、governance gate、artifact 关联等 | 功能方向有价值，但需要先经过核心能力闭环和依赖裁剪 | 后续 Step 7~Step 12 逐步收敛 |
| 旧文档整体 | 没有 `design-calibration` 来源标注 | 不符合最新正式文档追溯要求 | Step 17 重建正式文档时逐章标注校准来源 |
| `domain/work/README.md` | 包含完整字段、状态机、46 条不变量和实现倾向 | 细节丰富但层级偏详细设计，不应直接压入需求来源声明 | 作为历史领域输入，后续按 Step 分批裁剪 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源层级 | 主要从 `product/`、`domain/work/README.md` 和 ADR 出发 | 从稳定 L0/L1/L3 上游 + 产品 / 架构 / ADR / 旧草案共同收敛 | Work 的边界依赖 identity、conversation、method-library 已稳定 |
| 来源章节名称 | 与 `product/` 的关系声明 | 与上游文档的关系声明 | 需求来源不只来自 product |
| 旧 domain README 级别 | 近似作为详细设计权威 | 作为历史领域输入和不变量线索 | 避免结构体、状态机和实现字段直接进入需求 |
| 文档链 | `00` -> `01` -> `02` -> `03` -> `04-实施计划` | `00` -> `01` -> `02` -> `03` -> `04-配置设计` -> `05` -> `06` -> `07-实施计划` | 对齐当前文档主链 |
| 相邻仓来源 | identity / process / governance / artifact 等混在功能和依赖描述中 | 先声明稳定上游和相邻真相来源，后续 Step 6 / Step 12 再裁剪依赖 | 防止 Step 1 滑入边界、接口和依赖设计 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接沿用旧 `00-需求文档.md` 做局部修补 | 快，保留旧内容多 | 旧章节结构、旧文档链、旧实现假设和未追溯来源会残留 | 不采用 |
| 方案 B: 以稳定上游正式文档、产品 / 架构 / ADR 为来源，旧 work 文档作为候选事实逐步裁剪 | 边界清楚，能对齐最新 SOP 和已完成子项目设计 | 需要逐 Step 重做需求 | 采用 |
| 方案 C: 以 `domain/work/README.md` 为权威直接生成新版需求 | 细节丰富，能快速获得对象和不变量 | 会把字段、状态机、实现规则提前带入需求阶段，并可能覆盖已稳定相邻仓口径 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 承接内容 | 权威级别 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 | 直接稳定上游 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 | 直接稳定上游 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 work client 封装入口 | 稳定接入层上游 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | GlobalMember、actor、role 和成员生命周期引用来源 | 稳定相邻真相域 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | conversation space、conversation fact、trace / handoff 和授权查询来源 | 稳定相邻真相域 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | role / task / work product / process template / view profile 等定义来源 | 稳定定义来源 |
| `product/最终目的.md` | 软件项目作为工作对象、人机协作围绕项目推进的产品叙事 | 产品输入 |
| `product/六域模型.md` | Work 是六域之一、Project 是 SoI、ProjectMember / Backlog / WorkItem / Iteration 的领域位置 | 领域模型输入 |
| `architecture/仓库拆分方案.md` | `quantalithos-work` 的 L1 六域服务层位置和仓际关系 | 全局架构输入 |
| `architecture/架构设计.md` | Work 与 identity、conversation、process、governance、artifact、workspace 等仓的架构协作位置 | 全局架构输入 |
| `architecture/adr/0004-global-vs-project-member.md` | GlobalMember 与 ProjectMember 的双层 Member 边界 | ADR 输入 |
| `architecture/adr/0008-activity-completion-policy.md` | WorkItem 完成与 Process Activity 完成的关系 | ADR 输入 |
| `architecture/adr/0009-viewprofile-in-method-library.md` | ViewProfile / 方法定义在 method-library 的归属 | ADR 输入 |
| `domain/work/README.md` | Project、ProjectMember、Backlog、WorkItem、Iteration、状态和不变量线索 | 历史领域输入 |
| `projects/L1-work/README.md` | 仓使命、主要对齐、关键依赖、旧目录结构、维护纪律 | 旧仓定位输入 |
| `projects/L1-work/00-需求文档.md` | 旧版需求结构、目标、功能清单、验收和风险 | 旧需求输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖关系和后续按本仓裁剪的格式约束 | 依赖基线输入 |

### 7.2 承接主题结论

`L1-work` 承接的不是成员真相、对话真相、方法定义、流程执行、治理决策或产物正文，而是项目工作事实域。它的需求主线应围绕以下主题展开：

| 主题 | 说明 |
|---|---|
| Project 工作对象 | 软件项目作为系统工作对象和项目级上下文载体 |
| ProjectMember 项目分配 | GlobalMember 在项目内的分配、角色和工作参与事实 |
| Backlog 与 WorkItem | 项目待办、任务、子任务、依赖和协作工作事实 |
| Iteration / cadence | 迭代、节奏、承诺子集和项目推进周期 |
| ImplementationPlan 关系 | 个人或局部执行计划与正式协作 WorkItem 的关系，避免 plan item 与 WorkItem 混写 |
| 跨仓事实引用 | 引用 identity、conversation、method-library、process、governance、artifact 的事实或定义，不拥有其正文真相 |

### 7.3 收束说明结论

```text
Product narrative + Six-domain model + ADRs
  |
  v
L0-core + L0-bus + L0-sdk
  |
  v
L1-identity + L1-conversation + L3-method-library
  |
  v
L1-work
  owns project work facts
  |
  +-- consumed by process / governance / artifact / workspace / runtime / member-service
  +-- references member, conversation and method definitions without redefining them
```

本图只表达需求来源和承接方向，不表达具体表结构、Rust struct、handler、outbox、projection、数据库约束或事件处理伪代码。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §1。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节，了解本章上游来源和承接边界如何收敛。

本文承接已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library` 设计结论，以及 `product/最终目的.md`、`product/六域模型.md`、全局架构、ADR 和旧 work 领域文档中的相关输入。本文不重新定义共享契约、事件协作、SDK 接入、GlobalMember、conversation truth、method definition、process execution、governance decision 或 artifact truth；这些由对应上游或相邻仓承载。本文只把“软件项目是工作对象”收束为 `L1-work` 的仓级需求基线。

| 来源文档 | 承接内容 |
|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 work client 封装入口 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | GlobalMember、actor、role 和成员生命周期引用来源 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | conversation space、conversation fact、trace / handoff 和授权查询来源 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | role / task / work product / process template / view profile 等定义来源 |
| `product/最终目的.md` | 软件项目作为工作对象、人机协作围绕项目推进的产品叙事 |
| `product/六域模型.md` | Work 是六域之一、Project 是 SoI、ProjectMember / Backlog / WorkItem / Iteration 的领域位置 |
| `architecture/仓库拆分方案.md` | `quantalithos-work` 的 L1 六域服务层位置和仓际关系 |
| `architecture/adr/0004-global-vs-project-member.md` | GlobalMember 与 ProjectMember 的双层 Member 边界 |
| `architecture/adr/0008-activity-completion-policy.md` | WorkItem 完成与 Process Activity 完成的关系 |
| `architecture/adr/0009-viewprofile-in-method-library.md` | ViewProfile / 方法定义在 method-library 的归属 |
| `domain/work/README.md` | Project、ProjectMember、Backlog、WorkItem、Iteration、状态和不变量线索 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖关系和后续按本仓裁剪的格式约束 |

旧 `README.md` 和旧 `00-需求文档.md` 中可保留“Project / ProjectMember / Backlog / WorkItem / Iteration、双层 Member、WorkItem DAG、done 判据、process / governance / artifact 协作”等事实线索；但旧的 13 节结构、缺少 `04-配置设计.md` / `07-实施计划.md` 的文档链，以及把详细字段和实现约束直接带入需求的口径不直接继承，后续章节将按新版需求 SOP 重新收束。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `domain/work/README.md` 的权威级别 | 作为正式需求直接继承 | 作为历史领域输入和候选事实 | 推荐 B。原因是它包含大量详细设计、字段和实现约束，不能高于新版需求 SOP 与已完成上游正式文档 |
| Q-002 | 旧版 Project / WorkItem / Iteration 状态和 46 条不变量是否直接进入新版需求 | 直接继承为 P0 需求和规则 | 后续在 Step 4、Step 9、Step 10、Step 11 逐条裁剪 | 推荐 B。原因是 Step 1 只确认来源，不做目标、功能、规则和数据归属裁决 |
| Q-003 | `L1-work` 是否把 `L1-conversation` 和 `L3-method-library` 作为上游来源 | 不作为上游，只在后续依赖章节提及 | 作为已稳定相邻真相来源，但不在 Step 1 展开接口和依赖 | 推荐 B。原因是 WorkItem、ImplementationPlan、trace / handoff、method definition 的边界都依赖这两个仓的稳定结论 |

当前建议：接受上述推荐后进入 Step 2。

---

## 10. 进入下一步条件

- 已明确 `L1-work` 的稳定上游包括 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library`。
- 已明确本文承接产品叙事、六域模型、全局架构和 ADR，但不重新定义这些上游主题。
- 已明确旧 `domain/work/README.md`、旧 `README.md` 和旧 `00-需求文档.md` 是候选输入，不是新版需求权威。
- 已识别旧文档中需要后续清理的旧口径。
- 已准备进入 Step 2，讨论 `L1-work` 的本仓定位与边界。
