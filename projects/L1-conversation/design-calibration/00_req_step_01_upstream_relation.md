# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-05-31

---

## 1. 本步目标

先校准 `L1-conversation` 需求文档的语义来源，明确它承接哪些上游结论，而不是重新定义六域模型、身份成员、事件总线、SDK 接入、Chat UI、Workspace 视图、Bridges 外部适配、Runtime 推理或 Governance 决策。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-conversation/README.md` | 旧版仓定位材料 | 作为旧口径诊断输入，识别仍可保留的使命、依赖和开放问题 |
| `projects/L1-conversation/00-需求文档.md` | 旧版需求文档 | 作为旧需求诊断输入，不作为新版正式基线 |
| `projects/L1-conversation/01-架构设计.md` ~ `06-验收标准.md` | 旧版下游文档 | 作为后续一致性诊断输入，本步只判断需求来源关系 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游，承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为事件协作上游，承接发布、订阅、ack、retry、dead-letter、replay、tap 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 L5/L6 与外部调用方接入 conversation 能力的默认封装边界输入 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为成员引用、actor、角色和生命周期来源 |
| `product/最终目的.md` | 产品叙事上游 | 承接“协作载体是对话”和用户与 AI member 协作入口的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Conversation 是六域之一、一等聚合根、跨域事件通信的规则 |
| `domain/conversation/README.md` | 旧对话域详细设计 | 作为四形态、Turn、不变量、AG-UI、性能目标等候选事实来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接 `L1-conversation` 对 `L0-core` 的编译期依赖、经 `L0-bus` 的事件协作、对 identity / governance / artifact 的运行期或事件关系 |

---

## 3. SOP 问题回答

### 3.1 本文承接哪些上游文档？

本文直接承接五类上游：

1. 稳定 L0 / L1 基础结论：`L0-core`、`L0-bus`、`L0-sdk`、`L1-identity` 的 `00`~`07`。
2. 全局产品与领域模型结论：`product/最终目的.md`、`product/六域模型.md`。
3. 历史对话域草案：`domain/conversation/README.md`、旧 `projects/L1-conversation/README.md`、旧 `00-需求文档.md`。
4. 全局依赖基线：`standards/document/全局项目依赖关系与裁剪规则.md`。
5. 当前旧版 `01`~`06` 下游文档：只作为后续一致性诊断输入，不作为新版需求权威。

### 3.2 承接的是上游哪一部分主题？

本仓承接的主题是：在六域模型中把“Conversation 是一等协作载体”落为对话真相域，负责对话空间、Turn 记录、参与者可见性、对话事件和面向 UI / SDK / Bridges 的可消费对话事实。

具体承接关系如下：

| 上游主题 | `L1-conversation` 承接方式 |
|---|---|
| `product/最终目的.md` 的人机协作叙事 | 转译为用户、AI member、项目成员通过对话协作的需求来源 |
| `product/六域模型.md` 的 Conversation 域 | 转译为 Conversation 是独立聚合根和跨域事件协作的需求边界 |
| `L0-core` 的共享契约 | 使用统一 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 口径 |
| `L0-bus` 的事件语义 | 通过事件接收 work / governance / artifact / identity 变化，并发布 conversation 事件 |
| `L0-sdk` 的 client 封装边界 | 面向 L5 / L6 和外部调用方时优先通过 SDK 暴露 conversation 能力 |
| `L1-identity` 的成员真相 | Conversation 只引用成员 / actor，不拥有成员生命周期和角色定义 |
| `domain/conversation/README.md` 的旧详细设计 | 作为四形态、Turn 不可变、AG-UI、性能目标和风险线索，后续逐步裁剪 |

### 3.3 本文为什么不是重新定义该主题？

因为 `L1-conversation` 的主题不是重新定义“六域模型是什么”，也不是重新定义身份、事件总线、SDK、Chat UI 或 runtime。它只把已经成立的产品与领域模型结论，收束为 conversation 仓的外部可见需求边界。

本文不得重新定义：

- `L0-core` 的 ID、Error、TraceContext、CloudEvents 和 metadata。
- `L0-bus` 的 publish / subscribe / ack / retry / dead-letter / replay 语义。
- `L1-identity` 的 GlobalMember、Actor、Role 和生命周期真相。
- `L5-chat` 的具体 UI 展现。
- `L1-workspace` 的个人视野 / 项目视野聚合逻辑。
- `L6-bridges` 的外部平台协议适配。
- `L2-runtime` 的 LLM 推理和 agent loop。
- `L1-governance` 的 Gate 决策真相。

### 3.4 本文在当前仓里承担什么细化作用？

本文承担 `L1-conversation` 的仓级需求基线作用。它需要回答：

- Conversation 仓作为对话真相域要做什么。
- 它与 identity、workspace、chat、bridges、runtime、governance、artifact、work、observability 的边界是什么。
- 哪些旧版事实可以保留，哪些旧版假设需要后移或重新裁剪。
- 后续架构、概要、详细、配置、测试、验收、实施计划应围绕哪些需求结论展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 文档头部 | 写“严格遵循 13 节结构”，下游为 `04-实施计划.md` | 最新主链是 `00`~`07`，且 `04` 应为配置设计 | Step 17 重建正式文档时统一改为新版主链 |
| §1 | 标题为“与 `product/` 的关系声明” | 来源过窄，漏掉稳定 L0/L1 上游、全局依赖裁剪、旧 domain 草案和 SDK 入口 | 正式 §1 改为“与上游文档的关系声明” |
| §2 | 使用 1.5 亿 Turn/月、AG-UI 17 等旧指标 | 这些可能仍有价值，但不应在 Step 1 直接继承为新版需求 | 后续 Step 3 / Step 13 再判断是否保留 |
| §4 | 权限矩阵把 User、Owner、AI Member、Auditor、系统混写 | 角色线索有价值，但需要与 identity / workspace / governance 边界重裁剪 | 后续 Step 5 重新收敛用户与角色 |
| §6 | 功能按四形态、Turn、StreamEvents、Gate、Artifact、Project、participants 等罗列 | 可迁移事实较多，但缺少最新核心能力闭环和依赖裁剪 | 后续 Step 7~Step 12 逐步收敛 |
| §10 | 写 core proto、bus、work / governance / artifact / identity 事件 | 依赖方向大体正确，但需按全局依赖类型区分编译期、运行期和事件协作 | Step 6 / Step 12 输出裁剪表 |
| 旧文档整体 | 没有 `design-calibration` 来源标注 | 不符合最新正式文档追溯要求 | Step 17 重建正式文档时逐章标注校准来源 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源层级 | 主要从 `product/` 与 `domain/conversation/README.md` 出发 | 从稳定 L0/L1 上游 + 产品 / 六域模型 / 依赖基线 / 旧草案共同收敛 | Conversation 的边界依赖 core、bus、sdk、identity 已稳定 |
| 来源章节名称 | 与 `product/` 的关系声明 | 与上游文档的关系声明 | 需求来源不只来自 product |
| 旧 domain README 级别 | 近似作为详细设计权威 | 作为历史草案和候选事实来源 | 避免旧结构体、内部约束直接进入需求 |
| 文档链 | `00` -> `01` -> `02` -> `03` -> `04-实施计划` | `00` -> `01` -> `02` -> `03` -> `04-配置设计` -> `05` -> `06` -> `07-实施计划` | 对齐当前文档主链 |
| 上游依赖 | core / bus / work / governance / artifact / identity 混写 | 先声明稳定上游与依赖类型，后续逐 Step 裁剪 | 防止需求阶段混入实现依赖 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接沿用旧 `00-需求文档.md` 做局部修补 | 快，保留旧内容多 | 旧章节结构、旧文档链和旧实现假设会残留 | 不采用 |
| 方案 B: 以稳定 L0/L1 上游和六域模型为来源，旧文档作为候选事实逐步裁剪 | 边界清楚，能对齐最新 SOP 和上游设计 | 需要逐 Step 重做需求 | 采用 |
| 方案 C: 只按 `domain/conversation/README.md` 生成实现需求 | 细节丰富 | 会把结构体、状态机和实现细节提前带入需求阶段 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 承接内容 | 权威级别 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 | 直接稳定上游 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay、tap 和报告证据口径 | 直接稳定上游 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 conversation client 封装入口 | 稳定接入层上游 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 成员、actor、角色和生命周期引用来源 | 稳定相邻真相域 |
| `product/最终目的.md` | 用户与 AI member 通过对话协作的产品叙事 | 产品输入 |
| `product/六域模型.md` | Conversation 是六域之一、一等聚合根和事件协作规则 | 领域模型输入 |
| `domain/conversation/README.md` | 四形态、Turn、参与者、不变量、AG-UI、性能和风险线索 | 历史草案输入 |
| `projects/L1-conversation/README.md` | 仓使命、主要对齐、关键依赖、旧目录结构、维护纪律 | 旧仓定位输入 |
| `projects/L1-conversation/00-需求文档.md` | 旧版需求结构、目标、功能清单、验收和风险 | 旧需求输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L1-conversation` 的编译期、运行期、事件协作依赖裁剪口径 | 依赖基线输入 |

### 7.2 承接主题结论

`L1-conversation` 承接的不是 UI、桥接、runtime 或治理决策，而是对话真相域。它的需求主线应围绕以下主题展开：

| 主题 | 说明 |
|---|---|
| Conversation 真相 | 管理对话空间及其生命周期、参与者与可见性，不把对话当 UI 附属表 |
| Turn 真相 | 记录对话发言、系统通知、事件投影类消息等不可变对话事实 |
| 跨域事件承接 | 消费 work / governance / artifact / identity 等事件，并把必要信息转为对话可见事实 |
| 对外消费 | 为 chat、workspace、bridges、AI member runtime、observability 和 SDK 提供可查询 / 可订阅的对话能力 |
| 审计与追溯 | 保证对话历史、关键事件和 trace 可追溯，不承担完整 observability 存储职责 |

### 7.3 收束说明结论

```text
Product narrative + Six-domain model
  |
  v
L0-core + L0-bus + L0-sdk + L1-identity
  |
  v
L1-conversation
  owns conversation and turn truth
  |
  +-- consumed by L5-chat / L1-workspace / L6-bridges
  +-- used by AI member runtime as conversational context
  +-- collaborates with work / governance / artifact through events
```

本图只表达需求来源和依赖方向，不表达具体表结构、Rust struct、handler、streaming adapter 或事件处理伪代码。

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

本文承接已经稳定的 `L0-core`、`L0-bus`、`L0-sdk` 和 `L1-identity` 设计结论，以及 `product/最终目的.md`、`product/六域模型.md`、`domain/conversation/README.md` 和全局依赖裁剪规则中的相关输入。本文不重新定义共享 ID、ActorRef、TraceContext、Error、CloudEvents、事件投递语义、SDK 接入方式或成员生命周期；这些分别由 `L0-core`、`L0-bus`、`L0-sdk` 和 `L1-identity` 承载。本文只把“Conversation 是一等协作载体”收束为 `L1-conversation` 的仓级需求基线。

| 来源文档 | 承接内容 |
|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay、tap 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 conversation client 封装入口 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 成员、actor、角色和生命周期引用来源 |
| `product/最终目的.md` | 用户与 AI member 通过对话协作的产品叙事 |
| `product/六域模型.md` | Conversation 是六域之一、一等聚合根和事件协作规则 |
| `domain/conversation/README.md` | 四形态、Turn、参与者、不变量、AG-UI、性能和风险线索 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L1-conversation` 的编译期、运行期、事件协作依赖裁剪口径 |

旧 `README.md` 和旧 `00-需求文档.md` 中可保留“Conversation 一等聚合根、Turn 不可变、参与者、实时推送、对话历史、Chat / Bridges / Governance / Observability 依赖”等事实线索；但旧的 13 节结构、缺少 `04-配置设计.md` / `07-实施计划.md` 的文档链，以及把详细设计字段直接带入需求的口径不直接继承，后续章节将按新版需求 SOP 重新收束。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `domain/conversation/README.md` 的权威级别 | 作为正式需求直接继承 | 作为历史草案和候选输入 | 推荐 B。原因是它包含大量详细设计和实现字段，不能高于新版需求 SOP |
| Q-002 | 旧版“四形态 / Turn 五 kind / AG-UI 17”是否直接进入 P0 | 直接继承为 P0 | 后续在 Step 4 / Step 7 / Step 9 判断优先级 | 推荐 B。原因是 Step 1 只确认来源，不做功能优先级裁决 |
| Q-003 | `L1-conversation` 是否拥有 workspace / chat / bridges 的展示逻辑 | 是，conversation 统一展示 | 否，只拥有对话真相并提供消费边界 | 推荐 B。原因是 workspace、chat、bridges 是消费方或视图 / 适配层，不应把展示职责混入真相域 |

当前建议：接受上述推荐后进入 Step 2。

---

## 10. 进入下一步条件

- 已明确 `L1-conversation` 的稳定上游包括 `L0-core`、`L0-bus`、`L0-sdk` 和 `L1-identity`。
- 已明确本文承接产品叙事与六域模型，但不重新定义六域本身。
- 已明确旧 `domain/conversation/README.md`、旧 `README.md` 和旧 `00-需求文档.md` 是候选输入，不是新版需求权威。
- 已识别旧文档中需要后续清理的旧口径。
