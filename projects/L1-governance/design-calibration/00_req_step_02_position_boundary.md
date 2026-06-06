# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-06-06

---

## 1. 本步目标

建立 `L1-governance` 的仓级心智:它是治理决策与治理控制真相仓,而不是过程等待状态、项目工作事实、产物正文、对话显化、身份成员、方法定义、runtime 执行、审计存储或 workspace 视图仓。后续需求讨论必须以这个边界为前提,避免把相邻仓职责混入 Governance。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已完成 | 作为来源与承接边界前提 |
| `projects/L1-governance/README.md` | 旧仓定位材料 | 保留“治理域服务”“Gate / Policy / Control / AIIA / SoA / Nonconformity”“ISO 42001 AIMS 技术载体”等定位线索 |
| `projects/L1-governance/00-需求文档.md` | 旧版需求文档 | 提取关键节点强制人类、Policy / shared_rules、治理闭环和下游消费等需求线索 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取 Gate、Policy、Control、AIIA、SoA、Nonconformity、Approval、边界和不变量线索 |
| `product/六域模型.md` | 领域模型上游 | 固定 Governance 回答“关键决策由谁定”的六域位置 |
| `projects/L1-process/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 固定 waiting gate / pause context 属于 process,Gate / Policy / decision truth 属于 governance |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 固定 Project / WorkItem / Iteration truth 属于 work,governance 只引用或约束 |
| `projects/L1-conversation/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 固定对话事实、显化、review anchor 和可见性边界,governance 不拥有 conversation truth |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 固定方法、流程、角色、工作产品、ViewProfile 和 AIPolicyDef source truth 属于 method-library |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 固定 `L1-governance` 编译期只应直接依赖 L0-core,通过 L0-bus 进行事件协作 |

---

## 3. SOP 问题回答

### 3.1 本仓一句话定义是什么？

`L1-governance` 是治理决策与治理控制真相仓,负责把关键节点 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 收束为正式、可审计、可追溯、可被相邻仓消费的治理事实。

这句话有四个限制:

- “治理决策与治理控制真相”是本仓核心,不是所有合规、审计、策略、风险或 UI 相关对象都归本仓。
- “Gate / Policy / Approval / Decision”表示本仓拥有治理裁决结果和策略生效事实,不拥有 process 的 waiting state 或 work 的业务状态。
- “Control / AIIA / SoA / Nonconformity”表示本仓拥有治理生命周期与适用性结论,不拥有 artifact 正文、证据正文或标准原文。
- “被相邻仓消费”表示 governance 向其他仓提供治理事实,不把其他仓的业务事实复制成本仓真相。

### 3.2 为什么它需要单独成仓？

因为治理事实同时被 process、work、artifact、conversation、identity、runtime、member-service、workspace、observability、archive 等多个仓引用。如果没有独立的 Governance 真相仓,关键决策、策略生效、控制适用性、影响评估、适用性声明和不符合纠正会散落在流程等待、任务状态、产物证据、对话卡片、runtime policy cache 和审计日志中,后续无法稳定回答“谁批准了什么、依据什么 Policy、哪些控制适用、AIIA / SoA 是否成立、哪条不符合如何纠正、相邻仓应消费哪一个治理结论”。

单独成仓的理由不是“合规内容多”,而是事实边界独立:

- Gate / Approval / Decision 是治理裁决事实,不能退化为 process waiting state、work lifecycle 字段或 conversation turn。
- Policy 是治理策略生效事实,不能退化为 runtime policy cache、capability-hub 工具白名单或 method-library 定义正文。
- Control / AIIA / SoA 是治理适用性和生命周期事实,不能退化为 artifact 文档正文或标准讨论稿。
- Nonconformity 是治理纠正闭环事实,不能退化为普通 work blocker、process incident 或 observability alert。
- 治理事实必须能被多个相邻仓引用、消费和追溯,且只保留必要引用、摘要和结论,不接管相邻仓正文真相。

### 3.3 本仓不是什么？

`L1-governance` 不是以下对象:

- 不是 process 执行仓:不拥有 ProcessInstance、Activity、Token / Gateway、checkpoint、waiting gate state 或恢复真相。
- 不是 work 项目工作事实仓:不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 或承诺子集真相。
- 不是 artifact 正文仓:不拥有 Artifact、Evidence、Baseline、ComplianceDeclaration、AIIA / SoA 文档正文或归档包正文。
- 不是 conversation 真相仓:不拥有 conversation space、participant scope、conversation fact、Gate UI turn、review anchor 可见性或对话显化规则。
- 不是 identity 成员真相仓:不拥有 GlobalMember、Actor、Role 和成员生命周期。
- 不是 method-library 定义仓:不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile、AIPolicyDef source 或方法正文。
- 不是 runtime / member-service 执行仓:不拥有 LLM / tool loop、容器生命周期、policy cache 命中、工具调用事实或执行步骤。
- 不是 capability-hub 工具策略执行仓:不拥有 MCP / A2A 能力注册、工具适配、执行白名单运行时判定或工具调用结果。
- 不是 observability 审计存储仓:不拥有审计总账、指标、trace storage、告警流水或不可变日志物理存储。
- 不是 workspace / console UI 仓:不拥有跨域看板、治理卡片渲染、审批页面状态或用户界面交互状态。
- 不是外部 GRC 套件:不替代完整供应商审计系统、法律咨询系统或标准原文管理系统。

### 3.4 最容易与哪些相邻仓或概念混淆？

最容易混淆的对象如下:

| 类型 | 对象 | 混淆点 |
|---|---|---|
| 仓 | `L1-process` | waiting gate / pause context 与 Gate / approval / decision truth |
| 仓 | `L1-work` | WorkItem lifecycle / blocker / dependency 与 Gate decision / Nonconformity corrective action |
| 仓 | `L1-artifact` | AIIA / SoA / evidence 正文与 governance 适用性 / 批准结论 |
| 仓 | `L1-conversation` | Gate turn / review display 与 governance decision truth |
| 仓 | `L1-identity` | approver / actor / role 引用与成员生命周期真相 |
| 仓 | `L3-method-library` | AIPolicyDef / method definition 与 runtime governance Policy truth |
| 仓 | `L2-runtime` | policy cache / autonomy enforcement 与 Policy 生效和授权事实 |
| 仓 | `L3-capability-hub` | capability registration / tool whitelist 执行与 Policy 定义 / 生效事实 |
| 仓 | `L4-observability` | audit event storage / alert 与 Governance 决策或纠正事实 |
| 仓 | `L1-workspace` / `L5-console` | 治理视图和审批 UI 与治理真相 |
| 概念 | `Gate` | 关键节点治理裁决事实,不是 UI 卡片、流程等待状态或任务状态字段 |
| 概念 | `Policy` | 治理策略生效事实,不是运行时缓存条目、DSL 引擎或工具白名单本身 |
| 概念 | `Control` | 标准控制项适用 / 实施 / 复核事实,不是标准原文 |
| 概念 | `AIIA / SoA` | 治理生命周期和批准结论,不是 artifact 正文或外部标准方法论正文 |
| 概念 | `Nonconformity` | 不符合与纠正闭环事实,不是普通 bug、任务 blocker 或日志告警 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` 头部 | 定位为“治理域服务”,承载 Gate / Policy / Control / AIIA / SoA / Nonconformity | 方向正确,但未明确“治理决策与治理控制真相”以及与相邻仓 truth 的边界 | 正式 §2 改为“治理决策与治理控制真相仓” |
| `README.md` | 写 `Rust + PostgreSQL(强一致 + 高可用)` | 技术栈和存储实现提前进入仓定位 | 后移架构、详细设计、实施计划重新评估 |
| `README.md` | 写 Policy DSL、runtime C6 Policy Cache、capability-hub 白名单 | 运行时执行、工具能力注册和策略定义 / 生效事实混在一起 | Step 2 只确认 governance 拥有 Policy 生效事实,不拥有 runtime cache 或 tool execution |
| `domain/governance/README.md` §1.2 | 边界写“不做 Gate UI、不做审计事件物理存储、不做 Policy Tool 级执行、不做 AIIA 方法论” | 这些边界有价值,但还缺 process / work / artifact / method-library 已稳定结论 | 本步补齐相邻仓边界 |
| `domain/governance/README.md` §2 | 直接展开 Gate / Policy / Control / AIIA / SoA / Nonconformity 完整字段 | 历史线索有价值,但 Step 2 不能确认字段、状态机和 RPC | 后续 Step 9~Step 12 / 03 详细设计再裁剪 |
| `00-需求文档.md` §3 | 目标直接写 P95、Policy 下发时延、SoA 38 控制项 | 已滑入目标、非功能和数据规则 | 后移 Step 4、Step 10、Step 13 |
| `00-需求文档.md` §6 | 功能清单直接列 API-like 功能、下游事件扇出、DSL 和性能 | 候选能力有价值,但混入接口、实现和依赖 | 后续 Step 7~Step 12 逐步收敛 |
| 旧文档整体 | Gate、Policy、AIIA、SoA、Control、Nonconformity 与 process / work / artifact / runtime 交织 | 治理事实和相邻仓 truth 边界没有先钉住 | Step 2 先写非职责和混淆对象 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定位 | “治理域服务”“ISO 42001 AIMS 技术载体” | “治理决策与治理控制真相仓” | 更准确表达 Governance 拥有的是治理裁决、策略、控制和纠正事实,不是所有合规相关功能 |
| Gate 口径 | Gate 六段式容易被读作 UI / 流程等待 / 下游状态触发合集 | Gate 是治理裁决事实,process / conversation / work 只引用或消费 | 防止 governance 与 process / conversation / work 多真相 |
| Policy 口径 | Policy 下发、DSL、runtime cache、capability-hub 白名单混写 | Governance 拥有 Policy 生效与治理授权事实,不拥有执行缓存或工具调用 | 防止策略定义 / 生效 / 执行混在一个仓 |
| AIIA / SoA 口径 | AIIA / SoA 同时像 governance 对象和 artifact 文档 | Governance 拥有治理生命周期、适用性、批准和结论;artifact 拥有正文和版本 | 防止保存第二份 artifact 正文 |
| Nonconformity 口径 | 不符合事件和纠正措施容易混入 work task / alert | Governance 拥有不符合与纠正闭环事实;work / observability 是协作方 | 保持纠正闭环真相唯一 |
| 表达粒度 | 旧文档混入功能、SLA、接口、字段和实现 | Step 2 只保留仓级边界声明 | 对齐需求规范 4.2 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 定位为“合规 / AIMS 服务” | 贴近 ISO 42001 叙事 | 太宽,容易把标准方法论、文档正文、审计存储和外部 GRC 套件并入本仓 | 不采用 |
| 方案 B: 定位为“Gate / Policy 服务” | 突出最核心高频能力 | 会弱化 Control、AIIA、SoA、Nonconformity 的治理闭环 | 不采用 |
| 方案 C: 定位为“治理决策与治理控制真相仓” | 精确表达 Gate / Policy / Control / AIIA / SoA / Nonconformity 的共同事实边界 | 需要后续章节解释“治理控制”与标准原文、artifact 正文、runtime 执行的区别 | 采用 |
| 方案 D: 定位为“审计与审批服务” | 容易被业务方理解 | 会把 observability 审计存储、conversation UI 和 Gate decision 混在一起 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 AIIA / SoA 写入一句话定义？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 只写 Gate / Policy / Control,不写 AIIA / SoA | 定位更短,但会漏掉旧文档和 ISO 42001 对治理闭环的核心承诺 |
| 方案 B | 写 AIIA / SoA,但明确它们是治理生命周期和批准结论,不保存 artifact 正文 | 覆盖治理闭环,同时保护 artifact 边界 |
| 方案 C | 写 AIIA / SoA 文档管理 | 会误导读者认为 governance 拥有文档正文和版本 |

推荐方案 B。原因是 AIIA / SoA 是 governance 的核心治理对象,但 artifact 才是正文和版本真相。

#### 是否把 Nonconformity 纳入仓定位？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不写 Nonconformity,后续合规功能再说 | Step 2 更短,但会弱化 ISO 9001 / 42001 的纠正闭环 |
| 方案 B | 写 Nonconformity,但明确它不是普通 bug、blocker 或 alert | 能保护治理纠正闭环和 work / observability 边界 |

推荐方案 B。原因是旧文档已把 Nonconformity 作为聚合根,且它是治理真相不可缺少的一类。

#### 是否把 capability-hub 列入 Step 2 最易混淆对象？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不列,留到依赖章节 | Step 2 更短,但 Policy / tool whitelist / runtime enforcement 容易串线 |
| 方案 B | 列入边界对象,但不展开依赖和接口 | 提前保护 Policy truth 与工具能力执行边界 |

推荐方案 B。原因是旧文档已经把 Policy DSL、runtime C6 cache 和 capability-hub 混在一起,需要先拆开。

---

## 7. 结构化中间产物

### 7.1 一句话定义结论

```text
L1-governance 是治理决策与治理控制真相仓,负责把关键节点 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 收束为正式、可审计、可追溯、可被相邻仓消费的治理事实。
```

### 7.2 非职责结论

| 非职责对象 | 结论 |
|---|---|
| `L1-process` | `L1-governance` 不拥有 ProcessInstance、Activity、Token / Gateway、checkpoint、waiting gate state 或恢复真相 |
| `L1-work` | `L1-governance` 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 或承诺子集真相 |
| `L1-artifact` | `L1-governance` 不拥有 Artifact、Evidence、Baseline、ComplianceDeclaration、AIIA / SoA 文档正文或归档包正文 |
| `L1-conversation` | `L1-governance` 不拥有 conversation space、participant scope、conversation fact、Gate UI turn、review anchor 可见性或对话显化规则 |
| `L1-identity` | `L1-governance` 不拥有 GlobalMember、Actor、Role 和成员生命周期 |
| `L3-method-library` | `L1-governance` 不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile、AIPolicyDef source 或方法正文 |
| `L2-runtime` / `L2-member-service` | `L1-governance` 不拥有 LLM / tool loop、容器生命周期、policy cache 命中、工具调用事实或执行步骤 |
| `L3-capability-hub` | `L1-governance` 不拥有 MCP / A2A 能力注册、工具适配、执行白名单运行时判定或工具调用结果 |
| `L4-observability` | `L1-governance` 不拥有审计总账、指标、trace storage、告警流水或不可变日志物理存储 |
| `L1-workspace` / `L5-console` | `L1-governance` 不拥有跨域看板、治理卡片渲染、审批页面状态或用户界面交互状态 |

### 7.3 边界对象结论

| 边界对象 | 本步结论 |
|---|---|
| Gate | 关键节点治理裁决事实,不是 UI 卡片、流程等待状态或任务状态字段 |
| Approval / Decision | 治理裁决和可追溯记录,不是 identity 成员生命周期或 conversation comment |
| Policy | 治理策略生效、授权和优先级事实,不是 runtime cache、DSL 引擎或工具白名单本身 |
| Control | 标准控制项适用 / 实施 / 复核事实,不是标准原文 |
| AIIA | AI impact assessment 的治理生命周期和批准结论,不是 artifact 正文 |
| SoA | Statement of Applicability 的治理生命周期、覆盖和批准结论,不是 artifact 正文 |
| Nonconformity | 不符合与纠正闭环事实,不是普通 bug、work blocker 或 observability alert |
| Cross-domain governance reference | 指向 work / process / artifact / identity / method / runtime 等事实或定义的引用,不得复制其正文真相 |

### 7.4 单独成仓原因结论

`L1-governance` 必须单独成仓,因为 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 是多个相邻仓共同引用的治理事实。如果这些事实落入 process、work、artifact、conversation、runtime、observability 或 workspace,各仓会各自拥有一份不同的“治理结论”,导致关键决策、策略授权、适用性声明、影响评估和不符合纠正不可追溯。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §2。

```md
## 2. 本仓定位与边界

> 校准来源:
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“设计取舍”和“结构化中间产物”小节,了解本仓定位、非职责和最易混淆边界如何收敛。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L1-governance` 是治理决策与治理控制真相仓,负责把关键节点 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 收束为正式、可审计、可追溯、可被相邻仓消费的治理事实。 |
| 本仓不是什么 | 它不是过程执行仓、项目工作事实仓、artifact 正文仓、conversation 真相仓、identity 成员真相仓、method-library 定义仓、runtime / member-service 执行仓、capability-hub 工具策略执行仓、observability 审计存储仓、workspace / console UI 仓或外部 GRC 套件。 |
| 边界对象列表 | 仓:`L1-process`;仓:`L1-work`;仓:`L1-artifact`;仓:`L1-conversation`;仓:`L1-identity`;仓:`L3-method-library`;仓:`L2-runtime`;仓:`L2-member-service`;仓:`L3-capability-hub`;仓:`L4-observability`;仓:`L1-workspace`;仓:`L5-console`;概念:`Gate`;概念:`Policy`;概念:`Control`;概念:`AIIA / SoA`;概念:`Nonconformity`。 |
| 单独成仓原因 | 平台需要一处独立、稳定、可追溯的治理事实来源,避免关键决策、策略授权、控制适用、影响评估、适用性声明和不符合纠正散落在流程、工作、产物、对话、runtime cache、审计日志和 UI 视图中。 |

`L1-governance` 需要单独存在,因为 Gate、Policy、Approval / Decision、Control、AIIA、SoA 和 Nonconformity 是多个相邻仓共同引用的治理事实。它最容易与 `L1-process` 混淆在 waiting gate 与 Gate decision 边界上,与 `L1-work` 混淆在任务推进、blocker / dependency 与治理裁决边界上,与 `L1-artifact` 混淆在 AIIA / SoA / evidence 正文与治理批准结论边界上,也容易与 conversation、identity、method-library、runtime、capability-hub、observability、workspace 和 console 在显化、授权、策略定义、执行、审计和 UI 边界上串线;这些边界必须分开,否则后续需求、设计、测试和实现都会出现多真相。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 一句话定义是否采用“治理决策与治理控制真相仓” | 使用旧称“治理域服务 / 合规服务” | 使用“治理决策与治理控制真相仓” | 推荐 B。原因是它更能解释 Governance 为什么不能并入 process、work、artifact、runtime、observability 或 UI |
| Q-002 | 是否在 Step 2 提及 AIIA / SoA | 不提,留到功能需求 | 提及治理生命周期和批准结论,但明确不拥有 artifact 正文 | 推荐 B。原因是 AIIA / SoA 是治理闭环核心,但正文边界必须从一开始钉住 |
| Q-003 | 是否在 Step 2 提及 Nonconformity | 不提,留到功能需求 | 提及不符合与纠正闭环事实,但明确不是普通 bug / blocker / alert | 推荐 B。原因是 Nonconformity 是治理真相核心,且最容易与 work / observability 串线 |
| Q-004 | 是否把 capability-hub 列入边界对象 | 后续依赖章节再说 | Step 2 列为 Policy / tool whitelist / runtime enforcement 容易混淆的边界 | 推荐 B。原因是旧文档已把 Policy DSL、runtime C6 cache 和 capability-hub 混在一起 |

当前建议:接受上述推荐后进入 Step 3。

---

## 10. 进入下一步条件

- 已能用一句话定义 `L1-governance`:治理决策与治理控制真相仓。
- 已明确本仓不拥有 process、work、artifact、conversation、identity、method-library、runtime、member-service、capability-hub、observability、workspace、console 或外部 GRC 的真相。
- 已明确 Gate 是治理裁决事实,不是 UI 卡片、流程等待状态或任务状态字段。
- 已明确 Policy 是治理策略生效事实,不是 runtime cache、DSL 引擎或工具白名单本身。
- 已明确 AIIA / SoA 是治理生命周期和批准结论,不是 artifact 正文。
- 已明确 Nonconformity 是不符合与纠正闭环事实,不是普通 bug、work blocker 或 observability alert。
- 已准备进入 Step 3,讨论背景与问题定义。
