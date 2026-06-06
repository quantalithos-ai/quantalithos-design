# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-06-06

---

## 1. 本步目标

先校准 `L1-governance` 需求文档的语义来源,明确它承接哪些上游结论,而不是重新定义共享契约、事件总线、SDK 接入、identity 成员、conversation truth、work truth、process execution、artifact truth、method definition、runtime execution、observability audit store 或 workspace view。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L1-governance/README.md` | 旧版仓定位材料 | 作为旧口径诊断输入,识别仍可保留的使命、依赖和开放问题 |
| `projects/L1-governance/00-需求文档.md` | 旧版需求文档 | 作为旧需求诊断输入,不作为新版正式基线 |
| `projects/L1-governance/01-架构设计.md` ~ `06-验收标准.md` | 旧版下游文档 | 作为后续一致性诊断输入,本步只判断需求来源关系 |
| `domain/governance/README.md` | 旧治理域详细设计 | 作为 Gate、Policy、Control、ImpactAssessment、SoADocument、Nonconformity、Approval、不变量和历史边界线索 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游,承接共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 口径 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为事件协作上游,承接发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 L5/L6 与外部调用方接入 governance 能力的默认封装边界输入 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 GlobalMember、actor、角色和成员生命周期来源 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 Gate / Policy / review 等治理事实在对话中的显化、可见性和引用边界来源 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 Project、ProjectMember、Backlog、WorkItem、Iteration 等治理触发和约束对象来源 |
| `projects/L1-process/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 waiting gate、ProcessInstance、Activity 和过程暂停 / 恢复意图来源 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为方法、流程、角色、工作产品、ViewProfile 和 AIPolicyDef 等定义来源 |
| `product/最终目的.md` | 产品叙事上游 | 承接关键节点强制人类、决策留痕、AI 自主性受控、合规证据链的产品动机 |
| `product/六域模型.md` | 领域模型上游 | 承接 Governance 是六域之一、回答“关键决策由谁定”的领域位置 |
| `architecture/仓库拆分方案.md` | 全局分层上游 | 承接 `quantalithos-governance` 在 L1 六域服务层的位置和相邻仓关系 |
| `architecture/架构设计.md` | 全局架构上游 | 承接 governance 与 identity、conversation、work、process、artifact、runtime、workspace 等仓的架构协作位置 |
| `architecture/标准对齐全景图.md` | 标准对齐输入 | 作为 ISO 42001、ISO 9001、ISO 24748-2 等合规语义的全局定位线索 |
| `methodology/standards-discussion/ISO-42001.md` | 方法论 / 标准讨论输入 | 作为 AIMS、Control、AIIA、SoA 和治理体系要求的候选语义输入 |
| `methodology/standards-discussion/ISO-9001.md` | 方法论 / 标准讨论输入 | 作为 Nonconformity、corrective action、PDCA 和管理评审的候选语义输入 |
| `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md` | 方法论 / 标准讨论输入 | 作为 Decision Gate 与 conformance 的候选语义输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接总依赖关系,并在后续 Step 6 / Step 12 裁剪出 `L1-governance` 自己的部分 |

---

## 3. SOP 问题回答

### 3.1 本文承接哪些上游文档？

本文直接承接七类上游:

1. 已稳定基础仓结论:`L0-core`、`L0-bus`、`L0-sdk` 的 `00`~`07`。
2. 已稳定相邻领域结论:`L1-identity`、`L1-conversation`、`L1-work`、`L1-process`、`L3-method-library` 的正式文档。
3. 全局产品与架构结论:`product/最终目的.md`、`product/六域模型.md`、`architecture/仓库拆分方案.md`、`architecture/架构设计.md`。
4. 全局标准对齐和方法论讨论稿:`architecture/标准对齐全景图.md`、ISO 42001、ISO 9001、ISO 24748-2 相关讨论文档。
5. 历史治理域草案:`domain/governance/README.md`、旧 `projects/L1-governance/README.md`、旧 `00-需求文档.md`。
6. 已完成相邻仓在治理边界上的反向约束,例如 process 不拥有 Gate decision、work 不拥有 Gate / Policy、conversation 只显化 governance fact。
7. 全局依赖基线:`standards/document/全局项目依赖关系与裁剪规则.md`。

其中 `L0-core`、`L0-bus`、`L0-sdk` 提供基础协作能力;`L1-identity`、`L1-conversation`、`L1-work`、`L1-process` 提供最容易混淆的相邻真相边界;`L3-method-library` 提供方法和 AIPolicyDef 等定义来源;旧 governance 文档提供历史领域线索,但不直接作为新版需求权威。

### 3.2 承接的是上游哪一部分主题？

本仓承接的主题是:在六域模型中把“关键决策由谁定”落为治理决策与治理控制真相仓,负责把 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 收束为可审计、可追溯、可被 process、work、artifact、conversation、runtime、member-service、workspace、observability 和 archive 消费的需求基线。

具体承接关系如下:

| 上游主题 | `L1-governance` 承接方式 |
|---|---|
| `product/最终目的.md` 的关键节点强制人类和决策留痕 | 转译为 Gate、Approval、Decision、Policy 和审计追溯需求 |
| `product/六域模型.md` 的 Governance 域 | 转译为 Gate / Policy / Control / AIIA / SoA / Nonconformity 的仓级需求来源 |
| `L0-core` 的共享契约 | 使用统一 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 口径 |
| `L0-bus` 的事件语义 | 通过事件发布和消费与 process、work、artifact、conversation、runtime、member-service、observability 等仓协作 |
| `L0-sdk` 的 client 封装边界 | 面向 L5/L6 和外部调用方时优先通过 SDK 暴露 governance 能力 |
| `L1-identity` 的成员真相 | governance 只引用 actor / member / role,不拥有成员生命周期真相 |
| `L1-conversation` 的对话真相 | governance 可被显化为 Gate turn、review anchor 或治理事实,不拥有对话正文和可见性真相 |
| `L1-work` 的项目工作真相 | governance 只引用 Project / WorkItem / Iteration 等治理对象,不维护工作事实 |
| `L1-process` 的过程执行真相 | governance 响应或决策 waiting gate,不拥有 Process waiting state、Activity 或 checkpoint truth |
| `L3-method-library` 的定义真相 | governance 可消费方法 / 策略定义或定义快照,不拥有方法定义正文或 AIPolicyDef source truth |
| ISO 42001 / ISO 9001 / ISO 24748-2 讨论稿 | 作为治理能力、控制、AIIA、SoA、Nonconformity 和 Decision Gate 的语义来源,后续按需求层裁剪 |
| `domain/governance/README.md` 的旧详细设计 | 作为聚合、不变量、状态和历史边界线索,后续逐步裁剪 |

### 3.3 本文为什么不是重新定义该主题？

因为 `L1-governance` 的主题不是重新定义“整个系统如何治理”,也不是重新定义成员、对话、项目工作、过程执行、方法资产、产物正文、运行时执行或审计存储。它只把已经成立的产品、架构、标准语义和已完成子项目结论,收束为 governance 仓的外部可见需求边界。

本文不得重新定义:

- `L0-core` 的 ID、Error、TraceContext、CloudEvents、metadata 和 evidence。
- `L0-bus` 的 publish / subscribe / ack / retry / dead-letter / replay 语义。
- `L0-sdk` 的 client facade 和多语言接入口径。
- `L1-identity` 的 GlobalMember、Actor、Role 和成员生命周期真相。
- `L1-conversation` 的 conversation space、participant scope、conversation fact、trace / handoff 和可见性真相。
- `L1-work` 的 Project、ProjectMember、Backlog、WorkItem、Iteration 和项目执行事实。
- `L1-process` 的 ProcessInstance、Activity、Token / Gateway、checkpoint、waiting gate state 和恢复真相。
- `L3-method-library` 的 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 和 AIPolicyDef source truth。
- `L1-artifact` 的 Artifact 正文、evidence 正文、baseline、version lineage 或包体归属。
- `L2-runtime`、`L2-member-service` 的实际执行、容器调度、tool loop 和 policy cache 执行真相。
- `L4-observability` 的审计事件物理存储、指标、trace storage 或告警存储真相。
- `L1-workspace` 的聚合视图和 UI 局部状态。

### 3.4 本文在当前仓里承担什么细化作用？

本文承担 `L1-governance` 的仓级需求基线作用。它需要回答:

- Governance 仓作为治理决策与治理控制真相仓要做什么。
- Gate、Policy、Approval / Decision、Control、AIIA、SoA、Nonconformity 等需求概念如何在治理事实层收束。
- 它与 identity、conversation、work、process、method-library、artifact、runtime、member-service、workspace、observability、archive 的边界如何避免混写。
- 哪些旧版事实可以保留,哪些旧版假设需要后移或重新裁剪。
- 后续架构、概要、详细、配置、测试、验收、实施计划应围绕哪些需求结论展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 文档头部 | 写“严格遵循 13 节结构”,下游为 `04-实施计划.md` | 最新主链是 `00`~`07`,且 `04` 应为配置设计、`07` 才是实施计划 | Step 17 重建正式文档时统一改为新版主链 |
| 文档头部 | 前置文档只列 `product/最终目的.md`、`product/六域模型.md`、`domain/governance/README.md` 和 ADR-0008~0011 | 漏掉已完成的 L0/L1/L3 稳定上游、全局依赖基线和标准方法论输入;ADR 列表也不是 governance 专属来源 | 正式 §1 补充稳定上游和旧文档降级关系 |
| README | 技术栈写 `Rust + PostgreSQL` | 这是旧实现倾向,不能在需求阶段直接确认 | 后续架构 / 详细设计 / 实施计划重新评估 |
| §1 | 标题为“与 `product/` 的关系声明” | 来源过窄,无法表达跨仓稳定结论、标准语义和旧文档的降级关系 | 正式 §1 改为“与上游文档的关系声明” |
| §2 | 直接写 42001、9001、Gate 六段式、Policy DSL、47 条不变量和 200w / 1000w 规模 | 线索有价值,但 Step 1 不确认功能、规则、容量或测试覆盖率 | 后续 Step 3、Step 9、Step 10、Step 13 再裁剪 |
| §3 | 目标直接写 Gate 完整性、autonomy_level、SoA 38 控制项、P95 和传播时延 | 已混合目标、规则、数据、非功能和实现证据 | 后续 Step 4、Step 10、Step 13 再收敛 |
| §4 | 角色矩阵混合 Owner、Auditor、Tech Lead、各域服务、runtime / capability-hub | 用户角色和系统使用方混在一起 | Step 5 / Step 6 分开收敛 |
| §6 | 功能清单包含 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity、下游事件、DSL 和性能 | 候选功能有价值,但需要先经过核心闭环、边界、依赖裁剪和标准输入状态判断 | 后续 Step 7~Step 12 逐步收敛 |
| 旧文档整体 | 没有 `design-calibration` 来源标注 | 不符合最新正式文档追溯要求 | Step 17 重建正式文档时逐章标注校准来源 |
| `domain/governance/README.md` | 包含完整字段、状态机、RPC、事件名、不变量和实现链路 | 细节丰富但层级偏详细设计,不应直接压入需求来源声明 | 作为历史领域输入,后续按 Step 分批裁剪 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源层级 | 主要从 `product/`、`domain/governance/README.md` 和若干 ADR 出发 | 从稳定 L0/L1/L3 上游 + 产品 / 架构 / 标准讨论 / 旧草案共同收敛 | Governance 的边界依赖 process、work、artifact、conversation、method-library 等已稳定结论 |
| 来源章节名称 | 与 `product/` 的关系声明 | 与上游文档的关系声明 | 需求来源不只来自 product |
| 旧 domain README 级别 | 近似作为详细设计权威 | 作为历史领域输入和不变量线索 | 避免结构体、状态机、RPC 和事件名直接进入需求 |
| 标准讨论稿级别 | 近似直接推导功能和不变量 | 作为合规语义输入,后续按需求层裁剪 | 避免把标准原文或方法论讨论直接变成仓内对象字段 |
| 技术栈 | Rust + PostgreSQL 在 README 中作为仓定位 | 技术栈后移,需求阶段只保留候选输入 | 避免旧实现倾向覆盖新版架构选择 |
| 文档链 | `00` -> `01` -> `02` -> `03` -> `04-实施计划` | `00` -> `01` -> `02` -> `03` -> `04-配置设计` -> `05` -> `06` -> `07-实施计划` | 对齐当前文档主链 |
| 相邻仓来源 | process / work / artifact / runtime 等混在功能和依赖描述中 | 先声明稳定上游和相邻真相来源,后续 Step 6 / Step 12 再裁剪依赖 | 防止 Step 1 滑入边界、接口和依赖设计 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接沿用旧 `00-需求文档.md` 做局部修补 | 快,保留旧内容多 | 旧章节结构、旧文档链、旧实现假设、旧性能指标和未追溯来源会残留 | 不采用 |
| 方案 B: 以稳定上游正式文档、产品 / 架构 / 标准语义为来源,旧 governance 文档作为候选事实逐步裁剪 | 边界清楚,能对齐最新 SOP 和已完成子项目设计 | 需要逐 Step 重做需求 | 采用 |
| 方案 C: 以 `domain/governance/README.md` 为权威直接生成新版需求 | 细节丰富,能快速获得对象和不变量 | 会把字段、状态机、RPC、事件名和实现规则提前带入需求阶段,并可能覆盖已稳定相邻仓口径 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 承接内容 | 权威级别 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 | 直接稳定上游 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 | 直接稳定上游 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 governance client 封装入口 | 稳定接入层上游 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | GlobalMember、actor、role 和成员生命周期引用来源 | 稳定相邻真相域 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | Gate / Policy / review 等治理事实的显化、可见性和外部事实引用边界 | 稳定相邻真相域 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | Project、ProjectMember、Backlog、WorkItem、Iteration 等治理对象来源 | 稳定相邻真相域 |
| `projects/L1-process/00-需求文档.md` ~ `07-实施计划.md` | waiting gate、ProcessInstance、Activity、pause / resume 意图来源 | 稳定相邻真相域 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | method / role / work product / process template / view profile / AIPolicyDef 等定义来源 | 稳定定义来源 |
| `product/最终目的.md` | 关键节点强制人类、决策留痕、AI 自主性受控、合规证据链的产品叙事 | 产品输入 |
| `product/六域模型.md` | Governance 是六域之一、回答“关键决策由谁定”的领域位置 | 领域模型输入 |
| `architecture/仓库拆分方案.md` | `quantalithos-governance` 的 L1 六域服务层位置和仓际关系 | 全局架构输入 |
| `architecture/架构设计.md` | Governance 与 identity、conversation、work、process、artifact、runtime、workspace 等仓的架构协作位置 | 全局架构输入 |
| `architecture/标准对齐全景图.md` | ISO 42001、ISO 9001、ISO 24748-2 等标准对齐位置 | 标准对齐输入 |
| `methodology/standards-discussion/ISO-42001.md` | AIMS、Control、AIIA、SoA 和治理体系语义 | 方法论 / 标准输入 |
| `methodology/standards-discussion/ISO-9001.md` | Nonconformity、corrective action、PDCA 和管理评审语义 | 方法论 / 标准输入 |
| `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md` | Decision Gate 和 conformance 语义 | 方法论 / 标准输入 |
| `domain/governance/README.md` | Gate、Policy、Control、AIIA、SoA、Nonconformity、Approval、状态和不变量线索 | 历史领域输入 |
| `projects/L1-governance/README.md` | 仓使命、主要对齐、关键依赖、旧目录结构、维护纪律 | 旧仓定位输入 |
| `projects/L1-governance/00-需求文档.md` | 旧版需求结构、目标、功能清单、验收和风险 | 旧需求输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖关系和后续按本仓裁剪的格式约束 | 依赖基线输入 |

### 7.2 承接主题结论

`L1-governance` 承接的不是成员真相、对话真相、项目工作事实、过程执行事实、方法定义、产物正文、runtime 执行、审计存储或聚合视图,而是治理决策与治理控制真相。它的需求主线应围绕以下主题展开:

| 主题 | 说明 |
|---|---|
| Gate | 关键节点的结构化治理请求、决策候选、证据要求、决策人和决议结果 |
| Approval / Decision | 人类、审批组或授权策略形成的治理裁决与可追溯决策记录 |
| Policy | 组织、项目、角色或成员范围内的治理策略生效、优先级、继承和下发事实 |
| Control | 标准控制项适用性、实施状态、复核和治理约束事实 |
| AIIA | AI impact assessment 的治理生命周期、评审和批准事实,不保存 artifact 正文 |
| SoA | Statement of Applicability 的适用性声明、覆盖关系和批准事实,不保存 artifact 正文 |
| Nonconformity | 不符合事件、纠正措施、验证和关闭事实 |
| 跨仓事实引用 | 引用 identity、conversation、work、process、method-library、artifact、runtime、observability、archive 的事实或定义,不拥有其正文真相 |

### 7.3 收束说明结论

```text
Product narrative + Six-domain model + standard alignment
  |
  v
L0-core + L0-bus + L0-sdk
  |
  v
L1-identity + L1-conversation + L1-work + L1-process + L3-method-library
  |
  v
L1-governance
  owns governance decision and governance control truth
  |
  +-- consumes work / process / artifact / method / identity refs without owning their truth
  +-- publishes Gate / Policy / Control / AIIA / SoA / Nonconformity facts for adjacent domains
  +-- delegates audit storage, runtime execution, UI rendering and artifact bodies to their owning repos
```

本图只表达需求来源和承接方向,不表达具体表结构、Rust struct、handler、outbox、projection、数据库约束或事件处理伪代码。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §1。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节,了解本章上游来源和承接边界如何收敛。

本文承接已经稳定的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation`、`L1-work`、`L1-process` 和 `L3-method-library` 设计结论,以及 `product/最终目的.md`、`product/六域模型.md`、全局架构、标准对齐和旧 governance 领域文档中的相关输入。本文不重新定义共享契约、事件协作、SDK 接入、GlobalMember、conversation truth、work truth、process execution、method definition、artifact truth、runtime execution、observability audit store 或 workspace view;这些由对应上游或相邻仓承载。本文只把“关键决策由谁定”收束为 `L1-governance` 的仓级需求基线。

| 来源文档 | 承接内容 |
|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 事件发布、订阅、ack、retry、dead-letter、replay 和报告证据口径 |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | 面向 L5/L6 和外部调用方的 governance client 封装入口 |
| `projects/L1-identity/00-需求文档.md` ~ `07-实施计划.md` | GlobalMember、actor、role 和成员生命周期引用来源 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | Gate / Policy / review 等治理事实的显化、可见性和引用边界 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | Project、ProjectMember、Backlog、WorkItem、Iteration 等治理对象来源 |
| `projects/L1-process/00-需求文档.md` ~ `07-实施计划.md` | waiting gate、ProcessInstance、Activity 和过程暂停 / 恢复意图来源 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | method / role / work product / process template / view profile / AIPolicyDef 等定义来源 |
| `product/最终目的.md` | 关键节点强制人类、决策留痕、AI 自主性受控、合规证据链的产品叙事 |
| `product/六域模型.md` | Governance 是六域之一、回答“关键决策由谁定”的领域位置 |
| `architecture/仓库拆分方案.md` | `quantalithos-governance` 的 L1 六域服务层位置和仓际关系 |
| `architecture/架构设计.md` | Governance 与 identity、conversation、work、process、artifact、runtime、workspace 等仓的架构协作位置 |
| `architecture/标准对齐全景图.md` | ISO 42001、ISO 9001、ISO 24748-2 等标准对齐位置 |
| `methodology/standards-discussion/ISO-42001.md` | AIMS、Control、AIIA、SoA 和治理体系语义 |
| `methodology/standards-discussion/ISO-9001.md` | Nonconformity、corrective action、PDCA 和管理评审语义 |
| `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md` | Decision Gate 和 conformance 语义 |
| `domain/governance/README.md` | Gate、Policy、Control、AIIA、SoA、Nonconformity、Approval、状态和不变量线索 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖关系和后续按本仓裁剪的格式约束 |

旧 `README.md` 和旧 `00-需求文档.md` 中可保留 Gate、Policy、Approval / Decision、Control、AIIA、SoA、Nonconformity、shared_rules、autonomy_level 和合规闭环等事实线索;但旧的 13 节结构、缺少 `04-配置设计.md` / `07-实施计划.md` 的文档链、`Rust + PostgreSQL` 技术栈假设、Policy DSL 选型、P95 / 容量 / 覆盖率数字,以及把详细字段、状态机、RPC 和事件名直接带入需求的口径不直接继承,后续章节将按新版需求 SOP 重新收束。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `domain/governance/README.md` 的权威级别 | 作为正式需求直接继承 | 作为历史领域输入和候选事实 | 推荐 B。原因是它包含大量详细设计、字段、状态机和实现约束,不能高于新版需求 SOP 与已完成上游正式文档 |
| Q-002 | ISO 42001 / ISO 9001 / ISO 24748-2 讨论稿是否直接转成对象字段和 P0 不变量 | 直接继承为对象字段、规则和验收 | 后续在 Step 4、Step 9、Step 10、Step 13 逐条裁剪 | 推荐 B。原因是 Step 1 只确认来源,不做目标、功能、规则和非功能裁决 |
| Q-003 | 旧版 `Rust + PostgreSQL` 技术栈是否作为需求前提 | 直接继承 | 后移到架构、详细设计和实施计划重新评估 | 推荐 B。原因是需求阶段只写外部可见行为,不锁定实现技术栈 |
| Q-004 | 旧版 Gate kind、Policy DSL、AIIA 自动化和 Nonconformity 阈值是否作为已定真相 | 直接继承 | 后续按边界、功能、数据和接口 Step 逐条确认 | 推荐 B。原因是它们会影响协议、对象契约、配置和实施计划,不能在来源声明阶段提前定案 |
